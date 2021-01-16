//设备table
export const commomColumns = [
  {
    title: '设备名称',
    dataIndex: 'deviceName',
    ellipsis: true,
  },
  {
    title: '所属模型',
    dataIndex: 'modelName',
    ellipsis: true,
  },
  {
    title: '网络',
    ellipsis: true,
    dataIndex: 'netStatus',
    width: 100,
    scopedSlots: {customRender: 'netStatus'}
  },
  {
    title: '状态',
    ellipsis: true,
    dataIndex: 'status',
    width: 100,
    scopedSlots: {customRender: 'status'}
  },
]

export const commandColumns = [
  {
    title: '指令标识',
    dataIndex: 'commandMark',
    ellipsis: true,
  },
  {
    title: '指令名称',
    dataIndex: 'commandName',
    ellipsis: true,
  },
  {
    title: '指令模板',
    ellipsis: true,
    dataIndex: 'commandTemplateName',
    width: 240,
    scopedSlots: {
      filterDropdown: 'filterDropdown', //自定义filter
    }
  },
  {
    title: '描述',
    ellipsis: true,
    dataIndex: 'remark',
  },
]