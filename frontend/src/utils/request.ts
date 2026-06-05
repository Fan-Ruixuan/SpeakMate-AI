import axios from 'axios'

// 读取环境变量后端地址
const baseURL = import.meta.env.VITE_API_BASE_URL

// 创建axios实例
const service = axios.create({
  baseURL,
  timeout: 10000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 后续可统一在这里挂载token
    return config
  },
  err => Promise.reject(err)
)

// 响应拦截器
service.interceptors.response.use(
  res => res.data,
  err => Promise.reject(err)
)

export default service