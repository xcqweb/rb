<template>
  <div>
    <div class="c_searchArea" :class="{fd:!addBtn}">
      <p-button @click="attrHandler" type="primary" v-if="addBtn">新增属性</p-button>
      <Search @search="onSearch" :selectList='selectList' v-model="keyword" @reset="reset" v-if="search"/>
    </div>
    <div class="tableCon">
      <p-table
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
        rowKey="id"
      >
        <template slot="operation" slot-scope="record, index">
          <span class="operateBtn" @click="attrHandler(record, 'edit')">编辑</span>
          <span class="operateBtn" @click="delClick(record, index)">删除</span>
        </template>
        <p-table
            v-if="isShowExpand"
            slot="expandedRowRender"
            slot-scope="record"
            :columns="innerColumns"
            :data-source="record.innerData"
            :pagination="false"
            :loading='innerLoading'
            row-key="id"
            style="margin:10px 0;"
            class="innerTable"
          >
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
      ref='modal'
    />
  </div>
</template>

<script>
import modelMixins from './modelMixins'
import AttrModal from '../modal/attr'
import {attrType,getType,attrTypeList,getTypeList} from '@/utils/baseData'
export default {
  mixins: [modelMixins],
  components: {AttrModal},
  data() {
    return {
      filtersList1: this.filter ? attrType : [],
      filtersList2: this.filter ? getType : [],
      selectList: [
        {name:'属性名称',key: 'attributeName'},
        {name:'属性标识',key: 'attributeMark'},
      ],
      innerColumns: [
        {dataIndex: 'enumKey',title: '枚举值',ellipsis: true},
        {dataIndex: 'enumValue',title: '显示名称',ellipsis: true},
      ],
    };
  },
  computed: {
    columns(){
      let { filteredInfo1 } = this;
      return [
        {title: '属性标识',dataIndex: 'attributeMark',ellipsis: true},
        {title: '属性名称',dataIndex: 'attributeName',ellipsis: true},
        {
          title: '属性类型',
          ellipsis: true,
          filterMultiple: false,
          dataIndex: 'attributeType',
          filteredValue: filteredInfo1.attributeType || null,
          filters: this.$arrayItemToString(this.filtersList1),
          width: 120,
          customRender: (data) => {
            const temp = isNaN(data) ? data.split('@@@') : data
            const isArray = Array.isArray(temp)
            console.log(temp)
            return isArray ? `${attrTypeList[temp[0]]}/单位：${temp[1] || '-'}` : attrTypeList[temp]
          }
        },
        {
          title: '获取方式',
          ellipsis: true,
          dataIndex: 'createOption',
          filterMultiple: false,
          filteredValue: filteredInfo1.createOption || null,
          filters: this.$arrayItemToString(this.filtersList2),
          width: 120,
          customRender: data => getTypeList[data]
        },
        {title: '操作',align: 'right',width: 120,scopedSlots: { customRender: 'operation' }},
      ]
    } 
  },
  methods: {
    customExpandIcon(props) {
      const isEmun = props.record.attributeType === 3
      if (!this.isShowExpand) {
        return null
      }
      if (props.expanded) {
        return <a class='expand-icon' style={{marginRight:'10px'}} onClick={() => {
          props.onExpand(props.record)
        }}><span class={isEmun ? 'iconfont iconic_jiantou' : ''}></span></a>
      }  
      return <a class='expand-icon' style={{marginRight:isEmun ? '10px' : '26px'}} onClick={() => {
        props.onExpand(props.record)
      }}><span class={isEmun ? 'iconfont iconjiantouxiangzuoshangyitiao' : ''}></span></a>
    },
    expandhandler(modelAttributeId) {
      if (!modelAttributeId) {
        return
      }
      const params = {
        ...this.paramsInner,
        modelAttributeId
      }
      this.innerLoading = true
      this.$API.getModelAttrEmunList(params).then( res => {
        this.tableData.forEach( item => {
          if (item.id === modelAttributeId) {
            this.$set(item, 'innerData',res.data.records)
          }
        })
        this.innerLoading = false
      }).catch( () => {
        this.innerLoading = false
      })
    },
    getTableData({searchKey = this.selectList[0].key,keyword} = {}){
      const param = {
        modelId: this.modelId,
        searchKey,
        keyword,
        limit: this.pagination.pageSize,
        pageNo: this.pagination.current,
        attributeType: this.filteredInfo1.attributeType && this.filteredInfo1.attributeType[0],
        createOption: this.filteredInfo1.createOption && this.filteredInfo1.createOption[0],
      }
      this.loading = true;
      this.$API.getModelAttrList(param).then( res =>{
        if ( res.code === 0 ){
          this.tableData = res.data.records || [];
          this.tableData.forEach( item => {
            if (item.attributeType === 3) {
              this.$set(item, 'innerData', [])
            }
            if (item.attributeType === 2) {
              this.$set(item, 'attributeType', `${item.attributeType}@@@${item.unit}`)
            }
          })
          this.pagination.total = res.data.total;
          this.expandhandler(this.expandedRowKeys[0])
        }
        this.loading = false;
      }).catch( e =>{
        this.loading = false;
        console.log(e);
      });
    },
    attrHandler(item,type){
      this.visible = true
      this.componentId = 'AttrModal'
      this.options = {}
      this.options.modelId = this.$route.query.id
      if (type === 'edit') {
        this.title = '编辑属性'
        if (this.add) {
          this.options = {...item, type: 'first-edit'}
        }else{
          this.options = {...item, type: 'edit'}
        }
      }else{
        this.title = '新增属性'
        if (this.add) {
          this.options.type = 'first-add'
        }else{
          this.options.type = 'add'
        }
      }
    },
    delClick({id,attributeName,attributeMark}, index){
      const that = this;
      this.$confirm({
        centered: true,
        title: '确定要删除吗？',
        icon: h => <p-icon class="exclamation" type="exclamation-circle" />,
        content: (h, params) => {
          const str = `确定删除属性"${attributeName ? `${attributeName}(${attributeMark})` : `${attributeMark}`}"吗？`;
          return h('div', str);
        },
        onOk() {
          if (that.add) {
            that.tableData.splice(index, 1)
            that.expandedRowKeys = that.expandedRowKeys.filter( item => item !== id)
            that.$message.success('删除成功');
          }else{
          that.$API.delModelAttr({id}).then( res =>{
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
          }
        },
      });
    },
    callback(res) {
      const {type, ...data} = res
      if(type === 'first-add') {
        if (data.attributeType === 3) {
          this.expandedRowKeys = [data.id]
        }
        this.tableData.push(data)
        this.$emit('input', this.tableData)
      }else if (type === 'first-edit'){
        const $index = this.tableData.findIndex( item => item.id === data.id)
        this.$set(this.tableData, $index, {...data})
        this.$emit('input', this.tableData)
      }else{
        this.getTableData();
      }
    }
  }
};
</script>

<style lang="less" scoped>
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
</style>
