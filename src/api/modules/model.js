import instance from '@/api/request';
const baseUrl = '/api'
export default{
  ///////////////模型////////////////
  // 新增模型
  addModel: (params) => {
    return instance.post(`${baseUrl}/ruban-device/model`, params);
  },
  // 编辑模型
  editModel: (params) => {
    return instance.put(`${baseUrl}/ruban-device/model`, params);
  },
  // 删除模型
  delModel: (params) => {
    return instance.delete(`${baseUrl}/ruban-device/model/${params.id}`);
  },
  // 获取模型
  getModelById: (params) => {
    return instance.get(`${baseUrl}/ruban-device/model/${params.id}`,);
  },
  // 获取模型
  getModelList: (params) => {
    return instance.get(`${baseUrl}/ruban-device/model/list`, {params});
  },
  ///////////////////////属性////////////////////////////
  // 新增模型属性
  addModelAttr: (params) => {
    return instance.post(`${baseUrl}/ruban-device/modelAttribute`, params);
  },
  // 修改模型属性
  editModelAttr: (params) => {
    return instance.put(`${baseUrl}/ruban-device/modelAttribute`, params);
  },
  // 获取模型属性列表
  getModelAttrList: (params) => {
    return instance.get(`${baseUrl}/ruban-device/modelAttribute/list`, {params});
  },
  // 删除模型属性
  delModelAttr: (params) => {
    return instance.delete(`${baseUrl}/ruban-device/modelAttribute/${params.id}`);
  },
  // 根据id获取模型属性
  getModelAttrById: (params) => {
    return instance.get(`${baseUrl}/ruban-device/modelAttribute/${params.id}`);
  },
  //////////////////枚举属性//////////////////

// 根据id获取模型属性枚举列表
getModelAttrEmunList: (params) => {
  return instance.get(`${baseUrl}/ruban-device/modelAttributeTypeEnum/list`,{params});
},

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

////////////参数告警 ///////////////////
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
  ///////////////////////指令////////////////////////////
  // 新增模型指令
  addModelCommand: (params) => {
    return instance.post(`${baseUrl}/ruban-device/modelCommand`, params);
  },
  // 修改模型指令
  editModelCommand: (params) => {
    return instance.put(`${baseUrl}/ruban-device/modelCommand`, params);
  },
  // 获取模型指令列表
  getModelCommandList: (params) => {
    return instance.get(`${baseUrl}/ruban-device/modelCommand/list`, {params});
  },
  // 删除模型指令
  delModelCommand: (params) => {
    return instance.delete(`${baseUrl}/ruban-device/modelCommand/${params.id}`);
  },
  // 根据id获取模型指令
  getModelCommandById: (params) => {
    return instance.get(`${baseUrl}/ruban-device/modelCommand/${params.id}`);
  },
  // 指令模板下拉项
  getModelCommandById: () => {
    return instance.get(`${baseUrl}/ruban-command-center/commandTemplate/select`);
  },
  // 指令模板下拉项
  getModelCommandTemplateSelect: () => {
    return instance.get(`${baseUrl}/ruban-command-center/commandTemplate/select`);
  },
  // 获取指令模板对应的属性
  getModelCommandAttrList: (params) => {
    return instance.get(`${baseUrl}/ruban-command-center/commandTemplate/attr/${params.id}`);
  },
  /////////////////指令变量/////////////
  // 获取指令对应的变量列表
  getModelCommandVarList: (params) => {
    return instance.get(`${baseUrl}/ruban-device/modelCommandVar/list`, {params});
  },
}


