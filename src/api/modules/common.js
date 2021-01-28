//////////公共接口/////////////////////

import instance from '@/api/request';
import systemConfig from '@/config/system'
const isDev = process.env.NODE_ENV === 'development'
const baseUrl = isDev ? '' : systemConfig.baseUrl
export default{
  //获取版本文件
  getVersion: () => {
    return instance.get(`${baseUrl}/version.json`);
  },
}

export const getVersion = () => {
  return instance.get(`${baseUrl}/version.json`);
}