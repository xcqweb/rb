

export const formualList = [
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
    value: '>=',
    text: '大于等于',
  },
  {
    value: '<',
    text: '小于',
  },
  {
    value: '<=',
    text: '小于等于',
  },
  {
    value: '==',
    text: '等于',
  },
  {
    value: '!=',
    text: '不等于',
  },
];
export const formualMap = {
  '><': '介于',
  '<>': '不介于',
  '>': '大于',
  '>=': '大于等于',
  '<': '小于',
  '<=': '小于等于',
  '==': '等于',
  '!=': '不等于',
};

//报警来源
export const alarmSource = [
  {text: '参数监控',value: '0'},
  {text: '设备联动',value: '1'},
]
export const alarmSourceList = ['参数监控','设备联动']

//报警等级
export const alarmLevel = [
  {text: '注意',value: '0'},
  {text: '告警',value: '1'},
  {text: '危险',value: '2'},
]
export const alarmLevelList = ['注意','告警','危险']

//日志类型
export const logType = [
  {text: '网络',value: '0'},
  {text: '状态',value: '1'},
]
export const logTypeList = ['网络','状态']

//操作类型
export const operatorType = [
  {text: '信息编辑',value: '0'},
  {text: '设备解绑',value: '1'},
  {text: '设备绑定',value: '2'},
  {text: '设备移动',value: '3'},
]
export const operatorTypeList = ['信息编辑','设备解绑','设备绑定','设备移动']

//属性类型
export const attrType = [
  {text: '文本',value: '0'},
  {text: '日期',value: '1'},
  {text: '数值',value: '2'},
  {text: '枚举',value: '3'},
]
export const attrTypeList = ['文本','日期','数值','枚举']

//获取类型
export const getType = [
  {text: '手动填写',value: '0'},
  {text: '数据上报',value: '1'},
]
export const getTypeList = ['数据上报','手动填写']

//异常判断
export const judgeType = [
  {text: '心跳包模式',value: '0'},
  {text: '数据包模式',value: '1'},
]
export const judgeTypeList = ['数据包模式','心跳包模式']

//参数类型
export const paramType = [
  {text: '浮点型',value: '0'},
  {text: '日期',value: '1'},
  {text: '32位整型',value: '2'},
  {text: '双精度浮点型',value: '3'},
  {text: '布尔型',value: '4'},
  {text: '字符',value: '5'},
]
export const paramTypeList = ['浮点型','日期','32位整型','双精度浮点型','布尔型','字符']

//设备网络
export const deviceNetType = [
  {text: '在线',value: '0'},
  {text: '离线',value: '1'},
  {text: '未工作',value: '2'},
]
export const deviceNetTypeList = ['在线','离线','未工作']

//设备状态Array
export const deviceStatusType = [
  {text: '正常',value: '0'},
  {text: '故障',value: '1'},
  {text: '未激活',value: '2'},
]
export const deviceStatusTypeList = ['正常','故障','未激活']

//发送状态
export const sendType = [
  {text: '发送成功',value: '0'},
  {text: '发送失败',value: '1'},
]
export const sendTypeList = ['发送成功','发送失败']

//执行结果
export const resultType = [
  {text: '执行成功',value: '0'},
  {text: '执行失败',value: '1'},
]
export const resultTypeList = ['执行成功','执行失败']

//频率
export const rateType = [
  {text: '秒',value: '1'},
  {text: '分钟',value: '60'},
  {text: '小时',value: '3600'},
  {text: '天',value: '86400'},
]
export const rateTypeList = ['秒','分钟','小时','天']

export const useOption = ['显示', '存储']
