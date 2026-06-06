import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button, message } from 'antd';
import { uploadAudioAsr } from '../api/scene';

interface MicrophoneProps {
  onTranscribeSuccess?: (text: string) => void;
}

const Microphone: React.FC<MicrophoneProps> = ({ onTranscribeSuccess }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const recordingLockRef = useRef<boolean>(false);

  const releaseResources = useCallback(() => {
    if (recorderRef.current) {
      try {
        recorderRef.current.ondataavailable = null;
        recorderRef.current.onstop = null;
        recorderRef.current.onerror = null;
      } catch {
        // ignore
      }
      recorderRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    chunksRef.current = [];
    recordingLockRef.current = false;
    setIsRecording(false);
    setLoading(false);
  }, []);

  const startRecord = useCallback(async () => {
    if (recordingLockRef.current || isRecording || loading) return;

    releaseResources();
    recordingLockRef.current = true;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm; codecs=opus',
      });
      recorderRef.current = recorder;

      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onerror = () => {
        message.error('录音器发生错误，请重试');
        releaseResources();
      };

      recorder.start(100);
      setIsRecording(true);
      message.success('开始录音');
    } catch (err: any) {
      releaseResources();
      if (err.name === 'NotAllowedError') {
        message.error('麦克风权限被禁止，请在浏览器地址栏重新允许权限');
      } else if (err.name === 'NotFoundError') {
        message.error('未检测到麦克风设备，请检查设备连接');
      } else {
        message.error('麦克风授权失败，请允许麦克风权限');
      }
      console.error('录音启动失败：', err);
    }
  }, [isRecording, loading, releaseResources]);

  const stopRecordAndGetFile = useCallback((): Promise<File | null> => {
    return new Promise((resolve) => {
      const recorder = recorderRef.current;
      if (!recorder || recorder.state === 'inactive') {
        resolve(null);
        return;
      }

      const timeoutTimer = setTimeout(() => {
        releaseResources();
        message.error('录音结束超时，请重试');
        resolve(null);
      }, 3000);

      recorder.onstop = () => {
        clearTimeout(timeoutTimer);

        if (chunksRef.current.length === 0) {
          releaseResources();
          message.warning('未获取到有效录音数据');
          resolve(null);
          return;
        }

        const audioBlob = new Blob(chunksRef.current, {
          type: 'audio/webm; codecs=opus',
        });

        if (audioBlob.size < 100) {
          releaseResources();
          message.warning('录音文件过小，请重新录音');
          resolve(null);
          return;
        }

        const file = new File([audioBlob], 'record.webm', {
          type: 'audio/webm; codecs=opus',
        });

        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop());
          streamRef.current = null;
        }
        recorderRef.current = null;
        chunksRef.current = [];
        recordingLockRef.current = false;
        setIsRecording(false);

        message.success('录音结束');
        resolve(file);
      };

      recorder.stop();
    });
  }, [releaseResources]);

  const handleStopAndUpload = useCallback(async () => {
    if (loading || !isRecording) return;

    const file = await stopRecordAndGetFile();

    if (!file) {
      return;
    }

    try {
      setLoading(true);
      const res = await uploadAudioAsr(file);
      console.log('✅ ASR接口返回数据：', res);

      if (res.code === 200 && res.data) {
        const data = res.data as string | { text?: string };
        let text: string;
        if (typeof data === 'object' && data !== null) {
          text = data.text || JSON.stringify(data);
        } else {
          text = String(data);
        }
        onTranscribeSuccess?.(text);
        message.success('语音识别成功');
      } else {
        message.warning(res.msg || '语音识别结果为空');
      }
    } catch (err: any) {
      console.error(' ASR识别失败详情：', err.response?.data || err.message || err);
      if (!err.response) {
        message.error('接口连接失败，请检查后端服务、端口和跨域配置');
      } else if (err.response?.status === 400) {
        message.error('音频文件解析失败，录音数据不完整');
      } else {
        message.error('音频识别失败，请重试');
      }
    } finally {
      setLoading(false);
    }
  }, [loading, isRecording, stopRecordAndGetFile, onTranscribeSuccess]);

  useEffect(() => {
    return () => {
      releaseResources();
    };
  }, [releaseResources]);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <Button
        type="primary"
        danger={isRecording}
        onClick={isRecording ? handleStopAndUpload : startRecord}
        size="large"
        loading={loading}
        disabled={loading}
      >
        {isRecording ? '停止录音' : '开始录音'}
      </Button>
    </div>
  );
};

export default Microphone;
