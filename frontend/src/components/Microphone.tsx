import { useState, useRef, useCallback, useEffect } from 'react';
import { Button, message } from 'antd';
import { uploadAudioAsr } from '../api/scene';

// 标准受控组件：通过 props 回调上传结果
interface MicrophoneProps {
  onTranscribeSuccess?: (text: string) => void;
}

// 补全React导入，根除FC类型报错
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

  // 停止录音（修复Promise提前return导致无响应BUG）
  const stopRecord = useCallback((): Promise<Blob | null> => {
    return new Promise((resolve) => {
      // 修复：不return，仅兜底resolve，阻断流程卡死
      if (!recorderRef.current || !isRecording) {
        resolve(null);
        return;
      }

      // 超时兜底，彻底解决停止无响应、卡死
      const timeoutTimer = setTimeout(() => {
        streamRef.current?.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        resolve(null);
        message.error('录音停止超时，请重试');
      }, 2000);

      recorderRef.current.onstop = () => {
        clearTimeout(timeoutTimer);
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        streamRef.current?.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        message.success('录音结束');
        resolve(audioBlob);
      };

      recorderRef.current.stop();
    });
  }, [isRecording]);

  // 导出音频文件（PR6 保留）
  const getAudioFile = useCallback(async () => {
    const blob = await stopRecord();
    if (!blob) return null;
    return new File([blob], 'record.webm', { type: 'audio/webm' });
  }, [stopRecord]);

  // PR7 停止录音+自动上传ASR（修复时序、状态冲突）
  const handleStopAndUpload = useCallback(async () => {
    // 仅拦截上传中，允许正常停止录音
    if (loading) return;

    const blob = await stopRecord();
    if (!blob) {
      message.warning('未获取到录音数据，请重新录音');
      return;
    }

    const file = new File([blob], 'record.webm', { type: 'audio/webm' });

    try {
      setLoading(true);
      const res = await uploadAudioAsr(file);
      if (res.code === 200 && res.data) {
        onTranscribeSuccess?.(res.data);
        message.success('语音识别成功');
      } else {
        message.warning('语音识别结果为空');
      }
    } catch (err) {
      message.error('音频上传识别失败');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [loading, stopRecord, onTranscribeSuccess]);

  // 页面销毁强制释放资源，杜绝内存泄漏
  useEffect(() => {
    return () => {
      if (recorderRef.current) {
        recorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsRecording(false);
      setLoading(false);
    };
  }, []);

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
