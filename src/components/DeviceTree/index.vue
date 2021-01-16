

<template>
  <div class="device-tree">
    <p-tree
      v-if="treeData && treeData.length"
      :treeData="treeData"
      :load-data="onLoadData"
      :expandedKeys.sync='expandedKeys'
      :defaultSelectedKeys='defaultSelectedKeys'
      :loadedKeys='loadedKeys'
      :show-icon='showIcon'
      :show-line='showLine'
      :checkStrictly='checkStrictly'
      :checkable='checkable'
      :selectable='selectable'
      :multiple='multiple'
      :replaceFields='replaceFields'
      @select='selectTree'
      @expand='expand'
      @load='load'
      class="tree-wrap"
    > 
    <template slot="switcherIcon">
      <span class="floder_add_des iconfont"></span>
    </template>
    <template slot="custom" slot-scope="item">
      <!-- <span :style="{margin:'2px 4px 0 0'}" class="iconfont iconwenjianjiawenjian"></span> -->
      <span class="tree-name">{{ item.locationName }}</span>
      <div class="tree-operator" v-if="showOperator">
        <p-dropdown :trigger="['hover']" >
          <i class="iconfont iconellipsis" style="padding:0 12px" @click.prevent.stop/>
          <p-menu slot="overlay">
            <p-menu-item @click="operatorTree(1, item)" v-if='item.level < MAXLEVEL'>新增节点</p-menu-item>
            <p-menu-item @click="operatorTree(2, item)" v-if="item.locationType === 0">重命名</p-menu-item>
            <p-menu-item @click="operatorTree(3, item)" v-if="item.locationType === 0">删除节点</p-menu-item>
            <p-menu-item @click="operatorTree(4, item)" v-if="item.locationType === 0">移动节点</p-menu-item>
          </p-menu>
        </p-dropdown>
      </div>
    </template>
  </p-tree>
  <gt-no-data v-if="!treeData || !treeData.length" borderColor='#fff'/>
  <!-- 弹窗 -->
  <component
    :is="componentId"
    v-model="visible"
    :options="options"
    :title="title"
    @callback="treeOperator"
    ref='modal'
  />
  <!-- 选择位置 -->
  </div>
</template>

<script>
import sortTree from '@/utils/sortTree'
import Operator from './modal/operator'
const MAXLEVEL = 7; //树最大级数
export default {
  name: 'DeviceTree',
  components: {Operator},
  props: {
    checkStrictly: Boolean, //checkable 状态下节点选择完全受控（父子节点选中状态不再关联）
    checkable: Boolean, //节点前添加 Checkbox 复选框
    selectable: {
      type: Boolean,
      default: true
    }, //支持点选多个节点（节点本身）
    multiple: Boolean, //是否可选中
    showIcon: Boolean,
    showLine: Boolean,
    showOperator: Boolean, //是否显示操作按钮
    value: Array,
    checkRoot: Boolean, //默认选中根节点
    replaceFields: {
      type: Object,
      default: function() {
        return {
          children:'children', 
          title:'locationName', 
          key:'id' 
        }
      }
    },
  },
  data() {
    return {
      MAXLEVEL,
      //modal
      visible: false,
      options: {},
      title: '',
      componentId: '',
      //tree
      treeData: [],
      moveTargetNode: [], //要移入的节点
      loadedKeys: [],
      expandedKeys: [],
      moveNode: []
    }
  },
  mounted() {
    this.initTree()
  },
  methods: {
    initTree() {
      this.treeData = []
      this.loadedKeys = []
      this.expandedKeys = []
      this.getLocation({}).then( ({data}) => {
        this.treeData = this.tran(data)
        if (this.checkRoot) {
          const {id, locationName,locationNamePath} = data[0]
          this.$emit('input', {id, locationName,locationNamePath,init: true})
          this.$emit('change', {id, locationName,locationNamePath,init: true})
          this.defaultSelectedKeys = [data[0].id]
        }
        this.expandedKeys = [data[0].id]
      }).catch( () => {/** */})
    },
    tran(data) {
      return data.map( item => {
        return {
          isLeaf: !item.hasChild,
          expanded: false,
          scopedSlots: { title: 'custom' },
          ...item,
        };
      });
    },
    getLocation(params) {
      return this.$API.queryChildLocation(params)
    },
    onLoadData(treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        const params = {
          parentId: treeNode.dataRef.id,
        };
        this.getLocation(params).then( ({data}) => {
          const reData = this.tran(data);
          this.$set(treeNode.dataRef, 'children', reData)
          this.treeData = [...this.treeData];
          resolve();
        });
      });
    },
    //树节点新增-更新-删除操作
    /*
    type 0 新增 1 编辑 2 删除 3 移动
    */
    treeOperator({locationName, parentId, parentName, id, p_isLeaf, node}, type) {
      const that = this;
      function loop(trees) {
        for (const [index, tree] of trees.entries()) {
          //新增
          if (parentId === tree.id && type === 0) {
            const addItem = {
              parentId,
              parentName,
              locationName,
              id,
              isLeaf: true,
              leaf: true,
              expanded: false,
              locationType: 0,
              scopedSlots: { title: 'custom' },
            }
            that.$set(tree, 'expanded', true)
            //如果父节点是叶子节点
            if (p_isLeaf) {
              that.$set(tree, 'isLeaf', false)
              if (Array.isArray(tree.children)) {
                tree.children.push(addItem);
                break
              }else{
                that.$set(tree, 'children', [])
                that.$set(tree, 'children', [addItem])
              }
            }else{ //父节点不是叶子节点
              if (tree.children && tree.children.length) { //已展开
                  tree.children.push(addItem);
              }else{//未展开,查询子节点
                that.getLocation(parentId);
              }
            }
            that.expandedKeys.push(parentId);
            break
          }
          //编辑
          if (id === tree.id && type === 1) {
            that.$set(tree, 'locationName', locationName);
            break
          }
          //删除
          //无父节点
          if (!parentId && id === tree.id && type === 2) {
            that.treeData.splice(index, 1)
          }
          //删除某个节点下的子节点
          if (parentId === tree.id && type === 2) {
            const $index = tree.children.findIndex( el => el.id === id)
            tree.children.splice($index, 1)
            if (tree.children && !tree.children.length) {
              that.$set(tree, 'expanded', false)
              that.$set(tree, 'hasChild', false)
              that.$set(tree, 'isLeaf', true)
            }
          }
          if (tree.children && tree.children.length) {
            loop(tree.children);
          }
        }
      }
      if (type === 3) { //移动
        this.$API.moveLocation({
          id: this.moveNode.id,
          newId: node.id
        }).then( res => {
          this.$message.success('操作成功！')
          this.moveHandler([this.moveNode], [node])
        })
      }else{
        loop(this.treeData);
      }
    },
    selectTree(data, node) {
      const {dataRef} = node.node
      const {id, locationName,locationNamePath} = dataRef
      this.$emit('input', node.selected ? {id, locationName,locationNamePath} : {})
      this.$emit('change', node.selected ? {id, locationName,locationNamePath} : {})
      this.choseNode = !node.selected ? dataRef : {}
    },
    expand(expandedKeys,{expanded, node}) {
      this.expandedKeys = expandedKeys;
    },
    load(loadedKeys) {
      this.loadedKeys = loadedKeys;
    },
    operatorTree(key, {dataRef}) {
      const handler = ['addNode','editNode','removeNode','moveNodeHandler'][key - 1];
      this[handler](dataRef);
    },
    moveNodeHandler(item) {
      this.visible = true
      this.title = '移动节点'
      this.componentId = 'ModalSelectTree'
      this.moveNode = item
    },
    addNode(item) {
      this.visible = true
      this.title = '新增节点'
      this.componentId = 'Operator'
      this.options = {
        parentName: '',
        parentId: '',
        name: '',
        id: '',
        isEdit: false,
        selectedItem: item
      }
      this.$set(this.options, 'parentName', item.locationName);
      this.$set(this.options, 'parentId', item.id);
    },
    editNode(item) {
      const paths = item.locationNamePath.split('/')
      this.visible = true
      this.title = '重命名'
      this.componentId = 'Operator'
      this.options.parentName = paths[paths.length - 2]
      this.options.parentId= item.parentId
      this.options.locationName = item.locationName
      this.options.id = item.id
      this.options.isEdit = true
      this.options.selectedItem = item
    },
    //删除节点
    removeNodeHandler(item) {
      this.$API.delLocation({id: item.id}).then( res => {
        this.treeOperator(item,2)
        this.$message.success('删除成功！')
      })
    },
    removeNode(item) {
      this.remove(item, this.removeNodeHandler)
    },
    remove(item, handler) {
      this.$confirm({
        title: '确定要删除吗？',
        content: `确定要删除“${item.locationName}”吗？`,
        centered: true,
        onOk: () => {
          handler(item)
        }
      })
    },
    //移动节点
    //确定移动节点回调
    moveHandler(target, moveTarget) {
      const that = this;
      function loopDel(target, moveTarget, loopData) {
          //删除
          for (const [index, node] of loopData.entries()) {
              if (node.id === target[0].parentId) { //删除移动的节点 => 找到父节点进行删除操作
                  for (let i = 0; i < node.children.length; i++) {
                      if (node.children[i].id === target[0].id) {
                          if (node.children.length === 1) {
                              delete node.loading;
                              node.isLeaf = true;
                              that.$set(node, 'children', []);
                          }
                          node.children.splice(i, 1);
                      }
                  }
                  break;
              }
              //递归查找
              if (node.children && node.children.length > 0) {
                  loopDel(target, moveTarget, node.children);
              }
          }
      }
      //转移节点
      function loopAdd(target, moveTarget, loopData){
          //移入
          for (const [index, node] of loopData.entries()) {
              if (node.id === moveTarget[0].id) { //移入节点操作
                  if (!node.loading && node.locationType !== 1 && (!node.children || (node.children && node.children.length === 0)) && !node.hasChild) {//移入为加载的节点 非根节点 无子节点
                      const cloneObj = Object.assign({}, target[0]);
                      cloneObj.parentId = moveTarget[0].id;
                      cloneObj.level = moveTarget[0].level;
                      node.isLeaf = false;
                      node.children = []
                      node.children.push(cloneObj);
                      node.children = sortTree(node.children, that); //排序
                      that.expandedKeys.push(node.id)
                  }else{ // 有子节点
                      if (node.children && node.children.length > 0) { //节点已展开
                          //深拷贝一份
                          const cloneObj = Object.assign({}, target[0]);
                          cloneObj.parentId = moveTarget[0].id;
                          cloneObj.level = moveTarget[0].level;
                          cloneObj.selected = true;
                          node.children.push(cloneObj);
                          node.children = sortTree(node.children, that);
                      }else if (node.hasChild) { //节点未展开
                          that.getLocation(node).then( (res) => {
                              node.isLeaf = false;
                              //判断是否有子节点 有加上展开箭头
                              node.children = []
                              node.children.push(...that.tran(res.data));
                              node.children = sortTree(node.children, that);
                          });
                      }
                      node.expanded = true;
                  }
                  break;
              }
              //递归查找
              if (node.children && node.children.length > 0) {
                  loopAdd(target, moveTarget, node.children);
              }
          }
      }
      loopDel(target, moveTarget, this.treeData);
      loopAdd(target, moveTarget, this.treeData);
    },
  },
}
</script>
<style lang="less" scoped>
  .device-tree{
    padding: 8px 6px;
  }
  /deep/.tree-wrap{
    position: relative;
    .poros-tree-switcher_open,.poros-tree-switcher_close {
      .poros-select-switcher-icon{
        transform: none !important;
        font-size: 18px;
      }
    }
    & li{
      ul{
        padding: 0 0 0 24px;
      }
      padding: 0;
      // 叶子节点图标
      .poros-tree-switcher-line-icon{
        &>svg{
          display: none;
        }
        &::after{
          font-family: "iconfont" !important;
          font-size: 16px;
          font-style: normal;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          content: '\e7b6';
          font-size: 16px;
          color: #000;
          font-weight: 100;
        }
      }
      .poros-tree-node-content-wrapper{
        width: calc(100% - 10px);
        height: 28px;
        padding-left: 2px !important;
        position: relative;
        left: -2px;
        &:hover .tree-operator{
          visibility: visible;
        }
        &:hover{
          background-color:transparent;
          .tree-name{
            color: #fff;
            background-color: #1740DC;
          }
        }
      }
      .poros-tree-node-selected{
        &:hover{
          .tree-name{
            color: #fff;
            background-color: #1740DC;
          }
        }
        .tree-name{
            color: #fff;
            background-color: #1740DC;
          }
        background-color: transparent;
        .poros-tree-title{
          .tree-operator{
            visibility: visible;
          }
        }
      }
      position: relative;
      .poros-tree-title{
        display: flex;
        .tree-name{
          display: inline-block;
          max-width: calc(100% - 86px);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-top: 2px;
          padding: 0 2px;
          border-radius: 2px;
        }
        .tree-num{
          margin-left: 3px;
        }
        .tree-operator{
          position: absolute;
          right: 6px;
          transform: translateY(2px);
          visibility: hidden;
          padding-right: 0;
        }
      }
    }
  }
</style>