

<template>
  <div>
    <p-tree
      v-if="treeData && treeData.length"
      :treeData="treeData"
      :load-data="onLoadData"
      :expandedKeys.sync='expandedKeys'
      :loadedKeys='loadedKeys'
      :show-icon='showIcon'
      :show-line='showLine'
      :checkStrictly='checkStrictly'
      :checkable='checkable'
      :selectable='selectable'
      :multiple='multiple'
      @select='selectTree'
      @expand='expand'
      @load='load'
      class="tree-wrap"
    > 
    <template slot="switcherIcon">
      <span class="floder_add_des iconfont"></span>
    </template>
    <template slot="custom" slot-scope="item">
      <span :style="{margin:'2px 4px 0 0'}" class="iconfont iconwenjianjiawenjian"></span>
      <span class="tree-name">{{ item.name }}</span>
      <div class="tree-operator" v-if="showOperator">
        <p-dropdown :trigger="['hover']" >
          <i class="iconfont iconellipsis" @click.prevent.stop/>
          <p-menu slot="overlay">
            <p-menu-item @click="operatorTree(1, item)">新增节点</p-menu-item>
            <p-menu-item @click="operatorTree(2, item)" v-if="item.isRoot === '0'">重命名</p-menu-item>
            <p-menu-item @click="operatorTree(3, item)" v-if="item.isRoot === '0'">删除节点</p-menu-item>
            <p-menu-item @click="operatorTree(4, item)" v-if="item.isRoot === '0'">移动节点</p-menu-item>
          </p-menu>
        </p-dropdown>
      </div>
    </template>
  </p-tree>
  <gt-no-data v-if="!treeData || !treeData.length"/>
  <!-- 弹窗 -->
  <component
    :is="componentId"
    v-model="visible"
    :options="options"
    :title="title"
    @callback="callback"
    ref='modal'
  />
  <!-- 选择位置 -->
  </div>
</template>

<script>
import sortTree from '@/utils/sortTree'
import Operator from './modal/operator'
import d from './1.json'
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
    value: Array
  },
  data() {
    return {
      //modal
      visible: false,
      options: {},
      title: '',
      componentId: '',
      //tree
      treeData: this.tran(d),
      moveTargetNode: [], //要移入的节点
      loadedKeys: [],
      expandedKeys: [],
    }
  },
  methods: {
    tran(data) {
      return data.map( item => {
        return {
          isLeaf: item.leaf,
          key: item.code,
          expanded: false,
          scopedSlots: { title: 'custom' },
          ...item,
          children: item.children.map( item => {
            return {
              isLeaf: item.leaf,
              key: item.code,
              expanded: false,
              scopedSlots: { title: 'custom' },
              ...item,
            };
          })
        };
      });
    },
    onLoadData(treeNode) {
      return new Promise(resolve => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        const params = {
          code: treeNode.dataRef.code,
          dataSources: 0,
        };
        this.$API.getOrgList(params).then( ({data}) => {
          const reData = data.map( item => {
            return {
              isLeaf: item.leaf,
              key: item.code,
              expanded: false,
              scopedSlots: { title: 'custom' },
              ...item
            };
          });
          this.$set(treeNode.dataRef, 'children', reData)
          this.treeData = [...this.treeData];
          resolve();
        });
      });
    },
    //树节点新增-更新-删除操作
    /*
    type 0 新增 1 编辑 2 删除
    addUserCount >=0 时为新增用户 === 'del' 时为移除用户
    */
    treeOperator({name, parentCode, parentName, code, p_isLeaf}, type, addUserCount) {
      const that = this;
      function loop(trees) {
        for (const [index, tree] of trees.entries()) {
          //新增
          if (parentCode === tree.key && type === 0) {
            that.$set(tree, 'expanded', true)
            //如果父节点是叶子节点
            if (p_isLeaf) {
              that.$set(tree, 'isLeaf', false)
              if (Array.isArray(tree.children)) {
                tree.children.push({
                  parentCode,
                  parentCodeName: parentName,
                  name,
                  key: code,
                  code: code,
                  isLeaf: true,
                  leaf: true,
                  expanded: false,
                  relatedUserNum: 0,
                  isRoot: '0',
                  scopedSlots: { title: 'custom' },
                });
                break
              }else{
                that.$set(tree, 'children', [])
                that.$set(tree, 'children', [{
                  parentCode,
                  name,
                  parentCodeName: parentName,
                  key: code,
                  code: code,
                  isLeaf: true,
                  leaf: true,
                  expanded: false,
                  relatedUserNum: 0,
                  isRoot: '0',
                  icon: '',
                  scopedSlots: { title: 'custom' },
                }])
              }
              // queryChildrenNode
            }else{ //父节点不是叶子节点
              if (tree.children && tree.children.length) { //已展开
                  tree.children.push({
                    parentCode,
                    parentCodeName: parentName,
                    name,
                    key: code,
                    code: code,
                    isLeaf: true,
                    leaf: true,
                    expanded: false,
                    relatedUserNum: 0,
                    isRoot: '0',
                    scopedSlots: { title: 'custom' },
                  });
              }else{//未展开,查询子节点
                that.queryChildrenNode(parentCode);
              }
            }
            that.expandedKeys.push(parentCode);
            break
          }
          //编辑
          if (code === tree.key && type === 1) {
            //添加用户
            if (addUserCount !== 'del' && addUserCount >= 0) {
              that.$set(tree, 'relatedUserNum', addUserCount);
            }else if (addUserCount === 'del'){
              that.$set(tree, 'relatedUserNum', tree.relatedUserNum -1);
            }else{
              that.$set(tree, 'name', name);
            }
            break
          }
          //删除
          //无父节点
          if (!parentCode && code === tree.key && type === 2) {
            that.treeData.splice(index, 1)
          }
          //删除某个节点下的子节点
          if (parentCode === tree.key && type === 2) {
            const $index = tree.children.findIndex( el => el.code === code)
            tree.children.splice($index, 1)
            if (tree.children && !tree.children.length) {
              that.$set(tree, 'expanded', false)
              that.$set(tree, 'isLeaf', true)
            }
          }
          //搜索时删除
          if (that.searchKey && tree.key === code) {
            that.treeData.splice(index, 1)
          }
          if (tree.children && tree.children.length) {
            loop(tree.children);
          }
        }
      }
      loop(this.treeData);
    },
    selectTree(data, {node, node: {dataRef}}) {
      console.log(node, dataRef)
      this.$emit('input', dataRef)
      this.$emit('change', dataRef)
      this.choseNode = !node.selected ? dataRef : {}
    },
    expand(expandedKeys,{expanded, node}) {
      this.expandedKeys = expandedKeys;
    },
    load(loadedKeys) {
      this.loadedKeys = loadedKeys;
    },
    operatorTree(key, {dataRef}) {
      const handler = {
        1: 'addNode',
        2: 'editNode',
        3: 'removeNode',
        4: 'moveNode'
      }[key];
      this[handler](dataRef);
    },
    moveNode() {
      this.visible = true
      this.title = '移动节点'
      this.componentId = 'ModalSelectTree'
    },
    addNode(item) {
      this.visible = true
      this.title = '新增节点'
      this.componentId = 'Operator'
      this.options = {
        parentName: '',
        parentCode: '',
        name: '',
        code: '',
        isEdit: false,
        selectedItem: item
      }
      this.$set(this.options, 'parentName', item.name);
      this.$set(this.options, 'parentCode', item.code);
    },
    editNode(item) {
      this.visible = true
      this.title = '重命名'
      this.componentId = 'Operator'
      this.options.parentName = item.parentCodeName
      this.options.parentCode = item.parentCode
      this.options.name = item.name
      this.options.code = item.code
      this.options.isEdit = true
      this.options.selectedItem = item
    },
    removeNode(item) {
      this.remove(item, this.removeOrgHandler)
    },
    remove(item, handler) {
      this.$confirm({
        title: '确定要删除吗？',
        content: `确定要删除“${item.name}”吗？`,
        centered: true,
        onOk: () => {
          handler(item)
        }
      })
    },
    callback() {

    },
    //移动节点
    //确定移动节点回调
    moveNodeHandler() {
        const params = {
            locationId: this.choseNode[0].locationId,
            globalLocationId: this.moveTargetNode[0].locationId,
        };
        moveNode(params).then( (resp) => {
            const that = this;
            this.loading = false;
            function loopDel(target, moveTarget, loopData) {
                //删除
                for (const [index, node] of loopData.entries()) {
                    if (node.locationId === target[0].parentId) { //删除移动的节点 => 找到父节点进行删除操作
                        for (let i = 0; i < node.children.length; i++) {
                            if (node.children[i].locationId === target[0].locationId) {
                                if (node.children.length === 1) {
                                    delete node.loading;
                                    node.hasChild = false;
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
                    if (node.locationId === moveTarget[0].locationId) { //移入节点操作
                        if (!node.loading && node.locationType !== -1 && node.children.length === 0 && !node.hasChild) {//移入为加载的节点 非根节点 无子节点
                            that.queryNode(node).then( (res) => {
                                node.loading = false;
                                node.hasChild = true;
                                node.expand = true;
                                //判断是否有子节点 有加上展开箭头
                                const loop = (tree) => {
                                    for (let i = 0; tree && i < tree.length; i++) {
                                        if (tree[i].hasChild) {
                                            tree[i].loading = false;
                                            tree[i].children = [];
                                        }
                                        //选中移动的单元或节点
                                        if (target[0].locationId === tree[i].locationId) {
                                            tree[i].selected = true;
                                        }
                                    }
                                    return tree;
                                };
                                node.children.push(...loop(res.data));
                                node.children = sortTree(node.children, that); //排序
                            });
                        }else{ // 有子节点
                            if (node.children.length > 0) { //节点已展开
                                //深拷贝一份
                                const cloneObj = Object.assign({}, target[0]);
                                cloneObj.parentId = moveTarget[0].locationId;
                                cloneObj.level = moveTarget[0].level;
                                cloneObj.selected = true;
                                node.children.push(cloneObj);
                                node.children = sortTree(node.children, that);
                            }else if (node.hasChild) { //节点未展开
                                that.queryNode(node).then( (res) => {
                                    node.hasChild = true;
                                    //判断是否有子节点 有加上展开箭头
                                    const loop = (tree) => {
                                        for (let i = 0; tree && i < tree.length; i++) {
                                            if (tree[i].hasChild) {
                                                tree[i].loading = false;
                                                tree[i].children = [];
                                            }
                                            //选中移动的单元或节点
                                            if (target[0].locationId === tree[i].locationId) {
                                                tree[i].selected = true;
                                            }
                                        }
                                        return tree;
                                    };

                                    node.children.push(...loop(res.data));
                                    node.children = sortTree(node.children, that);
                                });
                            }
                            node.expand = true;
                        }
                        break;
                    }
                    //递归查找
                    if (node.children && node.children.length > 0) {
                        loopAdd(target, moveTarget, node.children);
                    }
                }
            }
            loopDel(this.choseNode, this.moveTargetNode, this.treeData);
            loopAdd(this.choseNode, this.moveTargetNode, this.treeData);
            // this.moveNodeModal = false;
            this.$Message.success('移动成功！');
            this.loading = false;
        }, error => {
            this.loading = false;
        });
    },
    //移动节点
    move() {
        // function loopDel(target, loopData){
        //     for (const node of loopData) {
        //         if (node.locationId === target.locationId) { //自身和单元节点不能移入 置灰
        //             node.disabled = true;
        //         }else{
        //             node.disabled = false;
        //         }
        //         if (node && Object.prototype.toString.call(node.children) !== '[object Null]' && node.children.length > 0) {
        //             loopDel(target, node.children);
        //         }
        //     }
        // }
        // loopDel(this.choseNode[0], this.targetTreeData);

        // this.getInitTreeData('target');
        // this.moveNodeModal = true;
    }
  },
}
</script>
<style lang="less" scoped>
  /deep/.tree-wrap{
    position: relative;
    .poros-tree-switcher_open,.poros-tree-switcher_close {
      .poros-select-switcher-icon{
        transform: none !important;
        font-size: 18px;
      }
    }
    & li{
      padding: 0;
      .poros-tree-node-content-wrapper{
        width: calc(100% - 10px);
        height: 28px;
        padding-left: 2px !important;
        &:hover .tree-operator{
          visibility: visible;
        }
        &:hover{
          background-color: #F2F3F4;
          .poros-tree-title{
            color: #1740DC;
          }
        }
      }
      .poros-tree-node-selected{
        &:hover{
          background-color: #1740DC;
          .poros-tree-title{
            color: #fff;
          }
        }
        background-color: #1740DC;
        .poros-tree-title{
          color: #fff;
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
        }
        .tree-num{
          margin-left: 3px;
        }
        .tree-operator{
          position: absolute;
          right: 6px;
          transform: translateY(2px);
          visibility: hidden;
        }
      }
    }
  }
</style>