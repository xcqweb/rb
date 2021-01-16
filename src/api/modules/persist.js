//////////字典接口/////////////////////

import instance from '@/api/request';
const baseUrl = '/api'

export default{
    /////////////////////////设备数据参数告警//////////////////////

  // 设备参数告警列表
  getDeviceParamAlarmList: (params) => {
    return instance.get(`${baseUrl}/persist/log/alarm`, {params});
  },

  // 设备状态日志列表
   getDeviceLogStateList: (params) => {
    return instance.get(`${baseUrl}/persist/log/device/state`, {params});
  },
  // 设备信息日志列表
  getDeviceLogInfoList: (params) => {
    return instance.get(`${baseUrl}/persist/log/device/info`, {params});
  },



  //////////////最后一笔数据///////////////////////////
}