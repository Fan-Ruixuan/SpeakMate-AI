import { useState, useRef, useCallback, useEffect } from 'react';
import { Button, message } from 'antd';
import { uploadAudioAsr } from '../api/scene';

// 标准受控组件：通过 props 回调上传结果
interface MicrophoneProps {
  onTranscribeSuccess?: (text: string) => void;
}

const Microphone: React.FC<MicrophoneProps> = ({ onTranscribeSuccess }) => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  // 开始录音
  const startRecord = useCallback(async () => {
    if (isRecording || loading) return;
    const audioConfig: MediaStreamConstraints = {
      audio: true
    };

    try {
      const stream = await navigator.mediaDevices.getUserMedia(audioConfig);
      streamRef.current = stream;
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.start();
      setIsRecording(true);
      message.success('开始录音');
    } catch (err: any) {
      if (err.name === 'NotAllowedError') {
        message.error('麦克风权限被禁止，请在浏览器地址栏重新允许权限');
      } else if (err.name === 'NotFoundError') {
        message.error('未检测到麦克风设备，请检查设备连接');
      } else {
        message.error('麦克风授权失败，请允许麦克风权限');
      }
      console.error(err);
    }
  }, [isRecording, loading]);

  // 停止录音
  const stopRecord = useCallback(async () => {
    return new Promise<Blob | null>((resolve) => {
      if (!recorderRef.current || !isRecording) return resolve(null);
      recorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        streamRef.current?.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        message.success('录音结束');
        resolve(audioBlob);
      };
      recorderRef.current.stop();
    });
  }, [isRecording]);

  // 导出音频文件（PR6 ）
  const getAudioFile = useCallback(async () => {
    const blob = await stopRecord();
    if (!blob) return null;
    return new File([blob], 'record.webm', { type: 'audio/webm' });
  }, [stopRecord]);

  // PR7 ：停止录音后自动上传（安全时序）
  const handleStopAndUpload = useCallback(async () => {
    if (loading || isRecording) return;

    const blob = await stopRecord();
    if (!blob) return;

    const file = new File([blob], 'record.webm', { type: 'audio/webm' });

    try {
      setLoading(true);
      const res = await uploadAudioAsr(file);
      // 回调父组件回显文本
      if (res.code === 200 && res.data) {
        onTranscribeSuccess?.(res.data);
        message.success('语音识别成功');
      }
    } catch (err) {
      message.error('音频上传识别失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading, isRecording, stopRecord, onTranscribeSuccess]);

  // 页面销毁释放资源
  useEffect(() => {
    return () => {
      if (recorderRef.current) recorderRef.current.stop();
      if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <Button
        type="primary"
        danger={isRecording}
        // 核心修复：停止时走【停止+上传】统一逻辑
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