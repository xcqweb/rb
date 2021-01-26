

export const formualList = [
  {
    value: '==',
    text: '等于',
  },
  {
    value: '!=',
    text: '不等于',
  },
  {
    value: '><',
    text: '介于',
  },
  {
    value: '<>',
    text: '不介于',
  },
  {
    value: '>',
    text: '大于',
  },
  {
    value: '<',
    text: '小于',
  },
  {
    value: '<=',
    text: '不大于',
  },
  {
    value: '>=',
    text: '不小于',
  },
];
export const formualMap = {
  '==': '等于',
  '!=': '不等于',
  '><': '介于',
  '<>': '不介于',
  '>': '大于',
  '<': '小于',
  '<=': '不大于',
  '>=': '不小于',
};

//报警来源
export const alarmSource = [
  {text: '参数监控',value: 0},
  {text: '设备联动',value: 1},
]
export const alarmSourceTextList = [
  {text: '参数告警',value: '参数告警'},
  {text: '设备联动',value: '设备联动'},
]
export const alarmSourceList = ['参数监控','设备联动']

//报警等级
export const alarmLevel = [
  {text: '注意',value: 0},
  {text: '告警',value: 1},
  {text: '危险',value: 2},
]
export const alarmLevelTextList = [
  {text: '注意',value: '注意'},
  {text: '告警',value: '告警'},
  {text: '危险',value: '危险'},
]
export const alarmLevelList = ['注意','告警','危险']

//日志类型
export const logType = [
  {text: '网络状态',value: '网络状态'},
  {text: '设备状态',value: '设备状态'},
]

//操作类型
export const operatorType = [
  {text: '信息编辑',value: '信息编辑'},
  {text: '设备解绑',value: '设备解绑'},
  {text: '设备绑定',value: '设备绑定'},
  {text: '设备移动',value: '设备移动'},
]

//属性类型
export const attrType = [
  {text: '文本',value: 0},
  {text: '日期',value: 1},
  {text: '数值',value: 2},
  {text: '枚举',value: 3},
]
export const attrTypeList = ['文本','日期','数值','枚举']

//获取类型
export const getType = [
  {text: '手动填写',value: 0},
  {text: '数据上报',value: 1},
]
export const getTypeList = ['手动填写','数据上报']

//异常判断
export const judgeType = [
  {text: '心跳包模式',value: 0},
  {text: '数据包模式',value: 1},
]
export const judgeTypeList = ['心跳包模式','数据包模式']

//参数类型
export const paramType = [
  {text: '字符',value: 0},
  {text: '浮点型',value: 1},
  {text: '日期',value: 2},
  {text: '32位整型',value: 3},
  {text: '双精度浮点型',value: 4},
  {text: '布尔型',value: 5},
]
export const paramTypeList = ['字符','浮点型','日期','32位整型','双精度浮点型','布尔型']

//设备网络
export const deviceNetType = [
  {text: '在线',value: 0},
  {text: '离线',value: 1},
  {text: '未激活',value: 2},
]
export const deviceNetTypeList = ['在线','离线','未激活']

//设备状态Array
export const deviceStatusType = [
  {text: '正常',value: 0},
  {text: '离线',value: 1},
]
export const deviceStatusTypeList = ['正常','离线']

//发送状态
export const sendType = [
  {text: '发送成功',value: 0},
  {text: '发送失败',value: 1},
]
export const sendTypeList = ['发送成功','发送失败']

//执行结果
export const resultType = [
  {text: '执行成功',value: 0},
  {text: '执行失败',value: 1},
]
export const resultTypeList = ['执行成功','执行失败']

//频率
export const rateType = [
  {text: '秒',value: 1},
  {text: '分钟',value: 60},
  {text: '小时',value: 3600},
  {text: '天',value: 86400},
]
export const rateTypeList = ['秒','分钟','小时','天']

export const useOption = ['存储', '显示', '显示、存储']

export const netStatusClass =  ['online','offline', 'noActive']
export const statusClass =  ['normal','offline_text']

