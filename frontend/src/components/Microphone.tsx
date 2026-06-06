import { useState, useRef, useCallback } from 'react';
import { Button, message } from 'antd';

const Microphone = () => {
  // 录音状态
  const [isRecording, setIsRecording] = useState<boolean>(false);
  // 媒体流 & 录制实例 ref 持久化
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);

  // 开始录音
  const startRecord = useCallback(async () => {
    try {
      // WebRTC 获取麦克风权限
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      streamRef.current = stream;

      // 初始化录制器
      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;
      chunksRef.current = [];

      // 收集音频分片
      recorder.ondataavailable = (e) => {
        if (e.data.size) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.start();
      setIsRecording(true);
      message.success('开始录音');
    } catch (err) {
      message.error('麦克风授权失败，请允许麦克风权限');
      console.error(err);
    }
  }, []);

  // 停止录音
  const stopRecord = useCallback(() => {
    return new Promise<Blob | null>((resolve) => {
      if (!recorderRef.current) return resolve(null);

      recorderRef.current.onstop = () => {
        // 合成完整音频 Blob
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        // 关闭麦克风占用
        streamRef.current?.getTracks().forEach(track => track.stop());
        setIsRecording(false);
        message.success('录音结束');
        resolve(audioBlob);
      };

      recorderRef.current.stop();
    });
  }, []);

  // 对外暴露：获取标准音频File，用于上传ASR接口
  // eslint-disable-next-line no-unused-vars
  const getAudioFile = useCallback(async () => {
    const blob = await stopRecord();
    if (!blob) return null;
    return new File([blob], 'record.webm', { type: 'audio/webm' });
  }, [stopRecord]);

  // 【唯一改动：换回标准JSX返回，修复爆红】
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