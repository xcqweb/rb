import API from '@/api'
export default{
  state: {
    alarmLevelList: [],
    alarmLevelMap: {},
  },
  mutations: {
    getAlarmLevelList(state) {
      if (state.alarmLevelList.length) {
        return
      }
      state.alarmLevelList = []
      state.alarmLevelMap = {}
      API.alarmLevelList().then( res => {
        res.data.records.forEach( item => {
          state.alarmLevelList.push({
            text: item.alarmLevel,
            value: item.id + ''
          })
          state.alarmLevelMap[item.id] = item.alarmLevel
        })
      })
    },
  }
}