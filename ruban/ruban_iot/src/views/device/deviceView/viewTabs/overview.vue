<template>
  <div>
    <page-title>基本信息</page-title>
    <div class="content">
      <Label :label="`${label}名称`">
        <Edit v-model="model.name"></Edit>
      </Label>
      <Label v-if="!isDevice" label='描述'>{{model.name}}</Label>
      <Label v-if="isDevice" label='设备标识'>{{model.name}}</Label>
      <Label v-if="isDevice" label='所属模型'>{{model.name}}</Label>
      <Label label='所属节点'></Label>
      <Label label='节点路径'></Label>
      <Label v-if="isDevice" label='网络'></Label>
      <Label v-if="isDevice" label='状态'></Label>
      <Label label='创建人'></Label>
      <Label label='创建时间'></Label>
    </div>
    <page-title class="mt20">{{isDevice ? '连接配置' : '绑定设备'}}</page-title>
    <!-- 设备 -->
    <template v-if="isDevice">
      <Link-config class="mt10" />
      <page-title class="mt20">属性信息</page-title>
      <Attr-info overview />
    </template>
    <!-- 设备组合 -->
    <template v-else>
      <Binding-device />
      <page-title class="mt20">属性信息</page-title>
      <Collapse-list>
        <tempalte slot-scope='{item}'>
          <Attr-info overview componsition :list='item' />
        </tempalte>
      </Collapse-list>
    </template>
  </div>
</template>

<script>
import PageTitle from '@/components/PageTitle/PageTitle.vue'
import BindingDevice from '../children/bindingDevice'
import AttrInfo from '../children/attrInfo'
import LinkConfig from '../children/linkConfig'
export default {
  components: { PageTitle, BindingDevice, AttrInfo, LinkConfig},
  props: {
    type: String,
    label: String,
    isDevice: Boolean
  },
  data() {
    return{
      model: {
        name: 'model'
      }
    }
  },
  methods: {}
}
</script>

<style lang="less" scoped>
  .content{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    padding: 12px 0 0 0;
    /deep/.label{
      width: 100%;
      line-height: 36px;
    }
  }
</style>