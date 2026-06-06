import request from '../utils/request';
export const getSceneList = () => request.get('/api/scene/list');