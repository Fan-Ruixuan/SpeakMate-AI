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