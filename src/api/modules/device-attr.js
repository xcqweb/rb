//////////字典接口/////////////////////

import instance from '@/api/request';
const baseUrl = '/api'

export default{
    /////////////////////////设备属性信息////////////////////// 
  // 新增设备属性信息
  addDeviceAttr: (params) => {
    return instance.post(`${baseUrl}/ruban-device/deviceAttribute`, params);
  },
  // 修改设备属性信息
  editDeviceAttr: (params) => {
    return instance.put(`${baseUrl}/ruban-device/deviceAttribute`, params);
  },
  // 设备属性信息列表
  getDeviceAttrList: (params) => {
    return instance.get(`${baseUrl}/ruban-device/deviceAttribute/list`, {params});
  },
  // 根据id删除设备属性信息
  delDeviceAttrById: (params) => {
    return instance.delete(`${baseUrl}/ruban-device/deviceAttribute/${params.id}`);
  },
  // 根据id获取设备属性信息
  getDeviceAttrDetailById: (params) => {
    return instance.get(`${baseUrl}/ruban-device/deviceAttribute/${params.id}`);
  },
}