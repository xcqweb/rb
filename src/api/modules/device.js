import instance from '@/api/request';
const baseUrl = '/ch'

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

  /////////////////////////设备数据参数告警//////////////////////
  // 新增设备参数告警
   addDeviceParamAlarm: (params) => {
    return instance.post(`${baseUrl}/ruban-device/deviceParamAlarm`, params);
  },
  // 修改设备参数告警
  editDeviceParamAlarm: (params) => {
    return instance.put(`${baseUrl}/ruban-device/deviceParamAlarm`, params);
  },
  // 设备参数告警列表
  getDeviceParamAlarmList: (params) => {
    return instance.get(`${baseUrl}/ruban-device/deviceParamAlarm/list`, {params});
  },
  // 根据id删除设备参数告警
  delDeviceParamAlarmById: (params) => {
    return instance.delete(`${baseUrl}/ruban-device/deviceParamAlarm/${params.id}`);
  },
  // 根据id获取设备参数告警
  getDeviceParamAlarmDetailById: (params) => {
    return instance.put(`${baseUrl}/ruban-device/deviceParamAlarm/${params.id}`);
  },

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
