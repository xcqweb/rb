//////////字典接口/////////////////////

import instance from '@/api/request';
const baseUrl = '/api'

export default{
    /////////////////////////设备数据参数//////////////////////
  // 新增设备参数信息
  addDeviceParam: (params) => {
    return instance.post(`${baseUrl}/ruban-device/deviceParam`, params);
  },
  // 修改设备参数信息
  editDeviceParam: (params) => {
    return instance.put(`${baseUrl}/ruban-device/deviceParam`, params);
  },
  // 设备参数信息列表
  getDeviceParamList: (params) => {
    return instance.get(`${baseUrl}/ruban-device/deviceParam/list`, {params});
  },
  // 根据id删除设备参数信息
  delDeviceParamById: (params) => {
    return instance.delete(`${baseUrl}/ruban-device/deviceParam/${params.id}`);
  },
  // 根据id获取设备参数信息
  getDeviceParamDetailById: (params) => {
    return instance.put(`${baseUrl}/ruban-device/deviceParam/${params.id}`);
  },
}