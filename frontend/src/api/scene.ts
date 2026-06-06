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

// ASR音频语音识别上传接口
// 使用原生 fetch + 标准 FormData，不手动设置 Content-Type，浏览器自动填充 boundary
export const uploadAudioAsr = async (file: File): Promise<ApiResponse<string>> => {
  const formData = new FormData();
  formData.append('audio', file);

  const res = await fetch('/api/asr/recognize', {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    const err: any = new Error(errorText || `HTTP ${res.status}`);
    err.response = { status: res.status, data: errorText };
    throw err;
  }

  return res.json() as Promise<ApiResponse<string>>;
};
