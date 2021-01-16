//////////字典接口/////////////////////

import instance from '@/api/request';
const baseUrl = '/api'

export default{
   ///////////////////////参数////////////////////////////
  // 新增模型参数
  addModelParams: (params) => {
    return instance.post(`${baseUrl}/ruban-device/modelParam`, params);
  },
  // 修改模型参数
  editModelParams: (params) => {
    return instance.put(`${baseUrl}/ruban-device/modelParam`, params);
  },
  // 获取模型参数列表
  getModelParamsList: (params) => {
    return instance.get(`${baseUrl}/ruban-device/modelParam/list`, {params});
  },
  // 删除模型参数
  delModelParams: (params) => {
    return instance.delete(`${baseUrl}/ruban-device/modelParam/${params.id}`);
  },
  // 根据id获取模型参数
  getModelParamsById: (params) => {
    return instance.get(`${baseUrl}/ruban-device/modelParam/${params.id}`);
  },
  ////////////////////////监控////////////////////////////
  // 获取模型参数监控列表
  getModelParamsAlarmList: (params) => {
    return instance.get(`${baseUrl}/ruban-device/modelParamAlarm/list`, {params});
  },
  // 新增模型参数监控列表
  addModelParamsAlarm: (params) => {
    return instance.post(`${baseUrl}/ruban-device/modelParamAlarm`, params);
  },
  // 编辑模型参数监控列表
  editModelParamsAlarm: (params) => {
    return instance.put(`${baseUrl}/ruban-device/modelParamAlarm`, params);
  },
  // 删除模型参数监控
  delModelParamsAlarm: (params) => {
    return instance.delete(`${baseUrl}/ruban-device/modelParamAlarm/${params.id}`,);
  },
}