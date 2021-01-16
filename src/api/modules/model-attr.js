//////////字典接口/////////////////////

import instance from '@/api/request';
const baseUrl = '/api'

export default{
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
}