import instance from '@/api/request';
const baseUrl = process.env.NODE_ENV === 'development' ? '/api' : '/api'
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
}


