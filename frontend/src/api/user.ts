import request from '../utils/request';
export const loginApi = (data: any) => request.post('/api/user/login', data);