<template>
  <div class="data">
    <div class="c_searchArea" :class="{'fd':!addBtn}">
      <p-button @click="paramHandler" type="primary" v-if="addBtn">添加参数</p-button>
      <Search :selectList='selectList' @search='onSearch' v-model="keyword.keyword" @reset="reset" v-if="search" />
    </div>
    <div class="tableCon">
      <p-table
        :row-key="isDevice ? 'modelParamId' : 'id'"
        @change="tableChange"
        @expand="expand"
        :loading="loading"
        :pagination="add ? false : pagination"
        :expandIcon="customExpandIcon"
        :expandIconAsCell="false"
        :expandIconColumnIndex="0"
        :indentSize="30"
        :expandedRowKeys='expandedRowKeys'
        :columns="columns"
        :data-source="tableData"
        >
        <template slot="operation" slot-scope="record">
          <span class="operateBtn" @click="paramHandler(record, 'edit')">编辑</span>
          <span class="operateBtn" @click="monitorHandler(record, 'add')">监控</span>
          <span class="operateBtn" @click="delHandler(record, 'param')">删除</span>
        </template>
        <p-table
            v-if="isShowExpand"
            slot="expandedRowRender"
            slot-scope="record"
            :columns="innerColumns"
            :data-source="record.innerData"
            :pagination="false"
            :loading='innerLoading'
            :row-key="isDevice ? 'modelParamId' : 'id'"
            style="margin:10px 0;"
            class="innerTable"
          >
          <template slot="switch" slot-scope="record1">
            <p-switch v-model="record1.enabled" @click.native="switchClick(record1)">启用</p-switch>
          </template>
          <template slot="alarmOperator" slot-scope="record1">
            <span class="operateBtn" @click="monitorHandler(record1, 'edit',record)" v-show="!record1.enabled">编辑</span>
            <span class="operateBtn" @click="delHandler(record, 'monitor',record1)" v-show="!record1.enabled">删除</span>
          </template>
          </p-table>
      </p-table>
    </div>
    <!-- 弹窗 -->
    <component
      :is="componentId"
      v-model="visible"
      :options="options"
      :title="title"
      @callback="callback"
      :validFun='validFun'
      ref='modal'
    />
  </div>
</template>

<script>
import modelMixins from './modelMixins'
import DataModal from '../modal/param'
import Monitor from '../modal/monitor'
import BtnTabs from '../../device/deviceView/children/btnTabs'
import { mapState } from 'vuex'
import {paramType,paramTypeList,formualMap,useOption,paramTypeNumList} from '@/utils/baseData'
import {analysisFormula,formatnumber} from '@/utils/util'
function formualTransfrom({limit, firstVal,secondVal}) {
  const isBetween = limit === '<>' || limit === '><'
  return formualMap[limit] + (isBetween ? `${firstVal} ~ ${secondVal}` : firstVal)
}

const INTERVALTIME = 5000 //拉去最后一笔数据频率5s
let timer = null
export default {
  mixins: [modelMixins],
  components: {DataModal,Monitor,BtnTabs},
  props: {
    deviceMark: String, //设备标识
    modelMark: String, //模型标识
  },
  data() {
    return {
      selectList: [
        {name:'参数名称',key: 'paramName'},
        {name:'参数标识',key: 'paramMark'},
      ],
      filtersList: this.filter ? paramType : [],
      lastLoading: false
    };
  },
  watch: {
    activeTabkey(val) {
      if (val === 'data') {
        this.setIntervalHanadler()
      }else{
        this.clearIntervalHanadler()
      }
    },
    tenantMark() {
      this.isDevice && this.getLastData(this.tableData)
    },
    deviceMark() {
      this.isDevice && this.getLastData(this.tableData)
    }
  },
  deactivated() {
    this.clearIntervalHanadler()
  },
  beforeDestroy() {
    this.clearIntervalHanadler()
  },
  computed: {
    ...mapState({
      alarmLevelList: state => state.dic.alarmLevelMap,
      tenantMark: state => state.user.userInfo.tenantId
    }),
    innerColumns() {
      const that = this
      const arr1 = [
        {dataIndex: 'alarmLevelId',title: '报警等级',ellipsis: true,customRender: data => that.alarmLevelList[data]},
        {title: '报警阈值',ellipsis: true,dataIndex: 'formulaView'},
        {dataIndex: 'remark',title: '报警信息',ellipsis: true},
        {title: '是否启用',ellipsis: true,scopedSlots: { customRender: 'switch' }},
      ]
      const arr2 = [{title: '操作',ellipsis: true,scopedSlots: { customRender: 'alarmOperator' }},]
      return this.isDevice ? arr1 : [...arr1, ...arr2]
    },
    columns(){
      let { filteredInfo1,lastLoading } = this;
      return this.isDevice ? [
        {title: '参数标识',dataIndex: 'paramMark',ellipsis: true},
        {title: '参数名称',dataIndex: 'paramName',ellipsis: true},
        {title: '最新上报数据',dataIndex: 'paramValue',ellipsis: true,
        customRender: data => {
          return <div class='flex'>
            {data}
            {lastLoading && <p-spin class='ml16'>
              <p-icon slot="indicator" type="loading" style="font-size: 18px" spin />
            </p-spin>}
          </div>
        }},
        {title: '最近上报时间',dataIndex: 'reportTime',ellipsis: true,
        customRender: data => {
          return <div class='flex'>
            {data}
            {lastLoading && <p-spin class='ml16'>
              <p-icon slot="indicator" type="loading" style="font-size: 18px" spin />
            </p-spin>}
          </div>
        }},
      ] :[
        {title: '参数标识',dataIndex: 'paramMark',ellipsis: true},
        {title: '参数名称',dataIndex: 'paramName',ellipsis: true},
        {
          title: '参数类型',
          ellipsis: true,
          dataIndex: 'paramType',
          filterMultiple: false,
          filteredValue: filteredInfo1.paramType || [],
          filters: this.$arrayItemToString(this.filtersList),
          width: 120,
          customRender: data => paramTypeList[data]
        },
        {title: '计算精度',ellipsis: true,dataIndex: 'paramPrecision',width: 100,},
        {title: '单位',ellipsis: true,dataIndex: 'unit',width: 100,},
        {title: '用途',ellipsis: true,dataIndex: 'used',width: 100,customRender(data) {return useOption[data]}},
        {title: '操作',align: 'right',width: 136,scopedSlots: { customRender: 'operation' }},
      ]
    } 
  },
  methods: {
    setIntervalHanadler() {
      this.clearIntervalHanadler()
      timer = setInterval(() => {
        !this.lastLoading && this.getLastData(this.tableData, 'disabledLoading')
      },INTERVALTIME)
    },
    clearIntervalHanadler() {
      timer && clearInterval(timer)
      timer = null
    },
    //展开子列表
    expandhandler(modelParamId, del) {
      if (!modelParamId) {
        return
      }
      const params = this.isDevice ? {
        ...this.paramsInner,
        deviceId: this.deviceId,
        modelParamId,
      } : {
        ...this.paramsInner,
        modelParamId
      }
      this.$API[this.isDevice ? 'getDeviceParamMonitorList' : 'getModelParamsAlarmList'](params).then( res => {
        this.tableData.forEach( item => {
          if (item.id === modelParamId || item.modelParamId === modelParamId) {
            this.$set(item, 'innerData',res.data.records.map( item => {
              return {
                ...item,
                enabled: item.enabled || item.enable
              }
            }))
            if (del && !res.data.records.length) { //删除是如果子项为空 收起table
              this.expandedRowKeys = []
            }
          }
        })
      }).catch(() => {
        // 
      })
    },
    setRealData(dataItem, item) {
      const {paramValue,ts} = dataItem
      const {paramPrecision,paramType} = item
      this.$set(item, 'paramValue', paramTypeNumList.includes(paramType) ? paramPrecision ? formatnumber(paramValue,paramPrecision) : formatnumber(paramValue) : paramValue)
      this.$set(item, 'reportTime', this.$formatDate(ts))
    },
    //获取最后一笔数据
    getLastData(data = [],disabledLoading) {
      if (!data.length ||  !this.tenantMark || !this.deviceMark || !this.modelMark) {
        console.error('标识不存在！')
        return
      }
      const params = [{
        tenantMark: this.tenantMark,
        deviceModelMark: this.modelMark,
        deviceMark: this.deviceMark,
        deviceParams: data.map( item => item.paramMark)
      }]
      !disabledLoading && (this.lastLoading = true)
      this.$API.getLastData(params).then(res => {
        const reData = res.data[0].deviceParams
        data.forEach( item => {
          const findItem = reData.find( el => el.paramMark === item.paramMark)
          findItem && this.setRealData(findItem, item)
        })
        this.lastLoading = false
      }).catch( () => {
        this.lastLoading = false
      })
    },
    getTableData({searchKey = this.selectList[0].key,keyword} = {}){
      const param = {
        modelId: this.modelId,
        searchKey,
        keyword,
        limit: this.pagination.pageSize,
        pageNo: this.pagination.current,
        paramType: this.filteredInfo1.paramType && this.filteredInfo1.paramType[0],
        deviceId: this.isDevice ? this.deviceId : undefined
      }
      this.loading = true;
      let fun = this.$API[this.isDevice ? 'getDeviceParamList' : 'getModelParamsList']
      fun(param).then( res =>{
        if ( res.code === 0 ){
          this.tableData = res.data.records || [];
          if (this.isDevice) {//设备或组合里面才去请求
            //最后一笔数据
            this.getLastData(this.tableData)
            this.setIntervalHanadler()
          }
          this.tableData.forEach( item => {
            this.$set(item, 'innerData', [])
          })
          //加载已展开的子列表
          this.expandhandler(this.expandedRowKeys[0])
          this.pagination.total = res.data.total;
        }
        this.loading = false;
      }).catch( e =>{
        this.loading = false;
        console.log(e);
      });
    },
    paramHandler(item, type){
      this.visible = true
      this.componentId = 'DataModal'
      this.options = {}
      this.options.modelId = this.$route.query.id
      if (type === 'edit') {
        this.title = '编辑参数'
        if (this.add) {
          this.options = {...item, type: 'first-edit'}
        }else{
          this.options = {...item, type: 'edit'}
        }
      }else{
        this.title = '添加参数'
        if (this.add) {
          this.options.type = 'first-add'
        }else{
          this.options.type = 'add'
        }
      }
    },
    monitorHandler(item,type,pItem) {
      this.visible = true
      this.componentId = 'Monitor'
      this.options = {}
      if (type === 'edit') {
        this.title = '编辑监控'
        if (this.add) {
          this.options = {...item, type: 'first-edit'}
          this.options.paramId = pItem.id
          this.options.paramMark = pItem.paramMark
        }else{
          this.options = {...item,...analysisFormula(item.formulaView), type: 'edit'}
          this.options.modelParamId = pItem.id
          this.options.paramId = pItem.id
          this.options.paramMark = pItem.paramMark
        }
      }else{
        this.title = '添加监控'
        if (this.add) {
          this.options.type = 'first-add'
          this.options.paramId = item.id
        }else{
          this.options.type = 'add'
          this.options.paramId = item.id
          this.options.modelParamId = item.id
          this.options.paramMark = item.paramMark
        }
      }
      
    },
    //type monitor 删除监控 param 删除参数
    delHandler(pRow, type, row){
      const that = this;
      this.$confirm({
        centered: true,
        title: '确定要删除吗？',
        icon: h => <p-icon class="exclamation" type="exclamation-circle" />,
        content: (h, params) => {
          const str = type === 'param' ? `确定删除该参数"${pRow.paramName || ''}（${pRow.paramMark}）"吗？` : `确定要删除监控 "阈值${formualTransfrom(row)}" `;
          return h('div', {
          }, str);
        },
        onOk() {
          if (that.add) {
            if (type === 'param') {
              const $index = that.tableData.findIndex(item => item.id === pRow.id)
              that.tableData.splice($index, 1)
              that.$message.success('删除成功');
              that.expandedRowKeys = that.expandedRowKeys.filter( item => item !== row.id)
            }else{
              const index = that.tableData.findIndex(item => item.id === pRow.id)
              const $index = that.tableData[index].innerData.findIndex(item => item.id === row.id)
              that.tableData[index].innerData.splice($index, 1)
              if (!that.tableData[index].innerData.length) {
                that.expandedRowKeys = []
              }
              that.$message.success('删除成功');
            }
          }else{
            if (type === 'param') {
              that.$API.delModelParams({id: pRow.id}).then( res =>{
                if ( res.code === 0 ){
                  that.$message.success('删除成功');
                  if (that.tableData.length <= 1 && that.pagination.current > 1) {
                    that.pagination.current --
                  }
                  that.getTableData()
                }
              }).catch( e =>{
                console.log(e);
              });
            }else{
              that.$API.delModelParamsAlarm({id: row.id}).then( res =>{
                if ( res.code === 0 ){
                  that.$message.success('删除成功');
                  that.expandhandler(that.expandedRowKeys[0], true)
                }
              }).catch( e =>{
                console.log(e);
              });
            }
          }
        },
      });
    },
    switchClick(item) {
      this.$set(item, 'enabled', item.enabled ? 1 : 0)
      let message = !!item.enabled  ? '启用成功！' : '禁用成功！'
      if (!this.add) {
        this.$API[this.isDevice ? 'editDeviceParamAlarm' : 'editModelParamsAlarm'](this.isDevice ? {enabled: item.enabled,id: item.deviceParamId} : item).then(res => {
          this.$message.success(message)
        }).catch(() => {
          this.$set(item, 'enabled', !item.enabled)
        })
      }else{
        this.$message.success(message)
      }
    },
    validFun(mark,id) {
      const findItem = id ? this.tableData.filter( item => item.id !== id).find( el => mark === el.paramMark) : this.tableData.find( el => mark === el.paramMark)
      return findItem
    },
    callback(res) {
      const {type,modal, ...data} = res
      if (modal === 'param') { //参数
        if(type === 'first-add') {
          data.innerData = []
          data.alarmAddParamList = []
          this.tableData.unshift(data)
          this.$emit('input', this.tableData)
        }else if (type === 'first-edit'){
          const $index = this.tableData.findIndex( item => item.id === data.id)
          const innerData = this.tableData[$index].innerData || []
          const alarmAddParamList = this.tableData[$index].alarmAddParamList || []
          this.$set(this.tableData, $index, {...data,innerData,alarmAddParamList})
          this.$emit('input', this.tableData)
        }else{
          this.getTableData(); 
        }
      }else{ //监控
        if(type === 'first-add') {
          this.expandedRowKeys = [data.paramId]
          this.tableData.forEach( item => {
            if (data.paramId === item.id) {
              item.innerData.unshift(data)
              item.alarmAddParamList.unshift(data)
            }
          })
          this.$emit('input', this.tableData)
        }else if (type === 'first-edit'){
          this.tableData.forEach( item => {
            if (data.paramId === item.id) { //monitorId
              const $index = item.innerData.findIndex( el => el.id === data.id)
              item.innerData.splice($index, 1, data)
              item.alarmAddParamList = item.innerData
            }
          })
          this.$emit('input', this.tableData)
        }else if (type === 'edit'){
          this.expandhandler(this.expandedRowKeys[0])
        }else{
          this.expandhandler(this.expandedRowKeys[0])
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
.data{
  /deep/.tableCon{
    .noExpand {
      .expand-icon{
        visibility: hidden;
      }
      & ~ .poros-table-expanded-row{
        display: none;
      }
    }
  }
  
}
</style>
