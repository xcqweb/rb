//设备table
export const commomColumns = [
  {
    title: '设备名称',
    dataIndex: 'name',
  },
  {
    title: '所属模型',
    dataIndex: 'systemName',
    ellipsis: true,
  },
  {
    title: '网络',
    ellipsis: true,
    dataIndex: 'description',
    width: 100,
    customRender:(item) => {
      // return <a href='javascript:;' onClick={this.viewUserDetail(item)}>{item.uid}</a>
    }
  },
  {
    title: '状态',
    ellipsis: true,
    dataIndex: 'createName',
    width: 136,
    customRender:(item) => {
      // return <a href='javascript:;' onClick={this.viewUserDetail(item)}>{item.uid}</a>
    }
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
    dataIndex: 'commandTemplateId',
  },
  {
    title: '描述',
    ellipsis: true,
    dataIndex: 'remark',
  },
]