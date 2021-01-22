//////////字典接口/////////////////////

import instance from '@/api/request';
const baseUrl = '/api'

export default{
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
  getModelCommandTemplateSelect: ({ids}) => {
    return instance.get(`${baseUrl}/ruban-command-center/commandTemplate/select`,{params: {ids}});
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
  // 获取指令发送记录列表
  getCommandSendRecordList: (params) => {
    return instance.get(`${baseUrl}/ruban-command-center/commandRecord/list`, {params});
  },

  // 获取模型指令模板id列表
  getModelCommandTempIdList: (params) => {
    return instance.get(`${baseUrl}/ruban-device/modelCommand/commandTemplateList/${params.id}`);
  },
}

