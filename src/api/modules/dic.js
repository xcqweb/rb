//////////字典接口/////////////////////

import instance from '@/api/request';
const baseUrl = '/api'

export default{
  //告警级别列表
  alarmLevelList: () => {
    return instance.get(`${baseUrl}/ruban-device/modelParamAlarmLevel/list`);
  },
}