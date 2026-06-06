import request from '../utils/request';

interface ApiResponse<T> {
  code: number;
  data: T;
  msg: string;
}

interface SceneItem {
  sid: number;
  scene_name: string;
  prompt: string;
}

export const getSceneList = () =>
  request.get<any, ApiResponse<SceneItem[]>>('/api/scene/list');

// ASR音频语音识别上传接口（PR7 第一笔）
export const uploadAudioAsr = (file: File) => {
  const formData = new FormData();
  formData.append('audio', file);
  return request.post<any, ApiResponse<string>>('/api/asr/transcribe', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};