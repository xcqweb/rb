//////////字典接口/////////////////////

import instance from '@/api/request';
const baseUrl = '/api'

export default{
    /////////////////////////设备组合//////////////////////
  // 新增组合
  addComposition: (params) => {
    return instance.post(`${baseUrl}/ruban-device/deviceCombination`, params);
  },
  // 修改组合
  editComposition: (params) => {
    return instance.put(`${baseUrl}/ruban-device/deviceCombination`, params);
  },
  //组合列表
  getCompositionList: (params) => {
    return instance.get(`${baseUrl}/ruban-device/deviceCombination/list`, {params});
  },
  // 根据id删除组合
  delCompositionById: (params) => {
    return instance.delete(`${baseUrl}/ruban-device/deviceCombination/${params.id}`);
  },
  // 根据id获取组合详情
  getCompositionDetailById: (params) => {
    return instance.get(`${baseUrl}/ruban-device/deviceCombination/${params.id}`);
  },

  // 根据id获取组合的设备信息
  getCompositionDeviceInfo: (params) => {
    return instance.get(`${baseUrl}/ruban-device/deviceCombination/deviceDetail/${params.id}`);
  },

  // 分页获取组合设备基本信息列表
  getCompositionDeviceList: (params) => {
    return instance.get(`${baseUrl}/ruban-device/deviceCombination/list`, {params});
  },

  // 组合绑定设备
  compositionBindDevice: (params) => {
    return instance.put(`${baseUrl}/ruban-device/deviceCombination/bindDevice`, params);
  },
  // 组合解除绑定设备
  compositionUnBindDevice: (params) => {
    return instance.put(`${baseUrl}/ruban-device/deviceCombination/untieDevice/${params.id}`);
  },
  // 组合移动设备
  compositionMoveDevice: (params) => {
    return instance.put(`${baseUrl}/ruban-device/deviceCombination/move`, params);
  },
}