import instance from '@/api/request';
const baseUrl = process.env.NODE_ENV === 'development' ? '/api' : '/api'

export default{

  /////////////////////////设备信息//////////////////////
  // 新增设备信息
  addDevice: (params) => {
    return instance.post(`${baseUrl}/ruban-device/deviceInfo`, params);
  },
  // 修改设备信息
  editDevice: (params) => {
    return instance.put(`${baseUrl}/ruban-device/deviceInfo`, params);
  },
  // 设备信息列表
  getDeviceList: (params) => {
    return instance.get(`${baseUrl}/ruban-device/deviceInfo/list`, {params});
  },
  // 根据id删除设备信息
  delDeviceById: (params) => {
    return instance.delete(`${baseUrl}/ruban-device/deviceInfo/${params.id}`);
  },
  // 根据id获取设备协议信息
  getDeviceProtocolById: (params) => {
    return instance.get(`${baseUrl}/ruban-device/deviceInfo/protocol/${params.id}`);
  },

  // 根据id获取设备信息
  getDeviceDetailById: (params) => {
    return instance.get(`${baseUrl}/ruban-device/deviceInfo/${params.id}`);
  },
}
