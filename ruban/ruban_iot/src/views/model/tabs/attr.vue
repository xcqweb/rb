<template>
  <div>
    <div class="c_searchArea" :class="{fd:!addBtn}">
      <p-button @click="attrHandler" type="primary" v-if="addBtn">新增属性</p-button>
      <Search @search="onSearch" :selectList='selectList' v-model="keyword" @reset="reset" v-if="search"/>
    </div>
    <div class="tableCon">
      <p-table
        rowKey="id"
        @change="tableChange"
        @expand="expand"
        :loading="loading"
        :pagination="pagination"
        :expandIcon="customExpandIcon"
        :expandIconAsCell="false"
        :expandIconColumnIndex="0"
        :indentSize="30"
        :expandedRowKeys='expandedRowKeys'
        :columns="columns"
        :customRow='customRow'
        :data-source="tableData">
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
            :loading='record.loading'
            :row-key="id"
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
      filtersList1: attrType,
      filtersList2: getType,
      selectList: [
        {name:'属性名称',key: 'attributeName'},
        {name:'属性标识',key: 'attributeMark'},
      ],
      innerColumns: [
        {
          dataIndex: 'range',
          title: '枚举值',
          ellipsis: true
        },
        {
          dataIndex: 'rangeName',
          title: '显示名称',
          ellipsis: true,
        },
      ],
    };
  },
  computed: {
    columns(){
      let { filteredInfo1 } = this;
      return [
        {
          title: '属性名称',
          dataIndex: 'attributeName',
          ellipsis: true,
        },
        {
          title: '属性标识',
          dataIndex: 'attributeMark',
          ellipsis: true,
        },
        {
          title: '属性类型',
          ellipsis: true,
          dataIndex: 'attributeType',
          filterMultiple: false,
          filteredValue: filteredInfo1.attributeType || null,
          filters: this.filter && this.filtersList1,
          width: 120,
          customRender: function(data) {
            return attrTypeList[data]
          }
        },
        {
          title: '获取方式',
          ellipsis: true,
          dataIndex: 'createOption',
          filterMultiple: false,
          filteredValue: filteredInfo1.createOption || null,
          filters: this.filter && this.filtersList2,
          width: 120,
          customRender: function(data) {
            return getTypeList[data]
          }
        },
        {
          title: '操作',
          align: 'right',
          width: 120,
          scopedSlots: { customRender: 'operation' },
        },
      ]
    } 
  },
  methods: {
    customRow(record, index) {
      const isExpand = !record.innerData || !record.innerData.length
      return{
        attrs: {class: isExpand ? 'noExpand' : ''}
      }
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
          this.pagination.total = res.data.total;
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
      if (type) {
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
    delClick({id,attributeName}, index){
      const that = this;
      this.$confirm({
        centered: true,
        title: '确定要删除吗？',
        icon: h => <p-icon class="exclamation" type="exclamation-circle" />,
        content: (h, params) => {
          const str = `确定删除该角色"${attributeName}"吗？`;
          return h('div', {
          }, str);
        },
        onOk() {
          if (that.add) {
            that.tableData.splice(index, 1)
            that.expandedRowKeys = that.expandedRowKeys.filter( item => item !== id)
          }else{
          that.$API.delModelAttr({id}).then( res =>{
            if ( res.code === 0 ){
              that.$message.success('删除成功');
              that.getTableData();
            }
          }).catch( e =>{
            console.log(e);
          });
          }
        },
      });
    },
    tableChange(pagination, filters, sorter){
      this.filteredInfo1 = filters
      this.getTableData(); 
    },
    callback(res) {
      const {type, ...data} = res
      if(type === 'first-add') {
        this.tableData.push(data)
        this.$emit('input', this.tableData)
      }else if (type === 'first-edit'){
        const $index = this.tableData.findIndex( item => item.id === data.id)
        this.$set(this.tableData, $index, {...data})
        this.$emit('input', this.tableData)
      }else if(type === 'add'){

      }else{

      }
    }
  }
};
</script>

<style lang="less">
.model{
  .routePageTitle{
    font-size: @f-big;
    line-height: 1;
    padding: 13px 20px;
    line-height:22px;
    border-bottom: 1px solid @c-bg-1;
  }
}
</style>
