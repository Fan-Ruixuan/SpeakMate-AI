import request from '../utils/request';

// 后端统一返回类型
interface ApiResponse<T> {
  code: number;
  data: T;
  msg: string;
}

export const loginApi = (data: { username: string; pwd: string }) =>
  request.post<any, ApiResponse<{ uid: number }>>('/api/user/login', data);