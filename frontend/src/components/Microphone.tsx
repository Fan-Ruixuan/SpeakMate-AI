import { useState, useRef, useCallback, useEffect } from 'react';
import { Button, message } from 'antd';

const Microphone = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  // 开始录音
  const startRecord = useCallback(async () => {
    // 防重复点击
    if (isRecording) return;
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
      // 精准权限异常捕获
      if (err.name === 'NotAllowedError') {
        message.error('麦克风权限被禁止，请在浏览器地址栏重新允许权限');
      } else if (err.name === 'NotFoundError') {
        message.error('未检测到麦克风设备，请检查设备连接');
      } else {
        message.error('麦克风授权失败，请允许麦克风权限');
      }
      console.error(err);
    }
  }, [isRecording]);

  // 停止录音
  const stopRecord = useCallback(() => {
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

  // 第二笔核心：导出标准音频文件（供后续ASR上传使用）
  // eslint-disable-next-line no-unused-vars
  const getAudioFile = useCallback(async () => {
    const blob = await stopRecord();
    if (!blob) return null;
    return new File([blob], 'record.webm', { type: 'audio/webm' });
  }, [stopRecord]);

  // 页面销毁强制释放麦克风资源，杜绝设备占用、内存泄漏
  useEffect(() => {
    return () => {
      if (recorderRef.current) {
        recorderRef.current.stop();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <Button
        type="primary"
        danger={isRecording}
        onClick={isRecording ? stopRecord : startRecord}
        size="large"
      >
        {isRecording ? '停止录音' : '开始录音'}
      </Button>
    </div>
  );
};

export default Microphone;