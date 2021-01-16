//////////字典接口/////////////////////

import instance from '@/api/request';
const baseUrl = '/api'

export default{
  /////////////////////////设备位置//////////////////////
  // 根据父节点id查询设备位置
  queryLocationById: (params) => {
    return instance.get(`${baseUrl}/ruban-device/deviceLocation/${params.id}`);
  },
  // 根据父节点id查询设备位置
  queryChildLocation: (params) => {
    return instance.get(`${baseUrl}/ruban-device/deviceLocation/child/list`, {params});
  },
  // 新增节点
  addLocation: (params) => {
    return instance.post(`${baseUrl}/ruban-device/deviceLocation`, params);
  },
  // 删除节点
  delLocation: (params) => {
    return instance.delete(`${baseUrl}/ruban-device/deviceLocation/${params.id}`);
  },
  // 重名名节点
  renameLocation: (params) => {
    return instance.put(`${baseUrl}/ruban-device/deviceLocation`, params);
  },
  // 移动节点
  moveLocation: (params) => {
    return instance.put(`${baseUrl}/ruban-device/deviceLocation/move`, params);
  },
}