<template>
  <div>
    <page-title>基本信息</page-title>
    <div class="content">
      <Label :label="`${label}名称`">
        <Edit v-model="model[namekey]" @submit="save" @cancel='cancel'></Edit>
      </Label>
      <Label v-if="!isDevice" label='描述'>
        <Edit v-model="model.remark" normal @submit="save" @cancel='cancel'>
          <p-input v-model="model.remark"></p-input>
        </Edit>
      </Label>
      <Label v-if="isDevice" label='设备标识'>{{model.deviceMark}}</Label>
      <Label v-if="isDevice" label='所属模型'>{{model.modelName}}</Label>
      <Label label='所属节点'>{{model.locationName}}</Label>
      <Label label='节点路径'>{{model.locationPathName}}</Label>
      <Label v-if="isDevice" label='网络'>
        <span :class="netStatusClass[model.netStatus]"></span>
        {{deviceNetTypeList[model.netStatus]}}
        </Label>
      <Label v-if="isDevice" label='状态'>
        <span :class="statusClass[model.status]">{{deviceStatusTypeList[model.status]}}</span>
      </Label>
      <Label label='创建人'>{{model.createBy}}</Label>
      <Label label='创建时间'>{{$formatDate(model.createTime)}}</Label>
    </div>
    <page-title class="mt20">{{isDevice ? '连接配置' : '绑定设备'}}</page-title>
    <!-- 设备 -->
    <template v-if="isDevice">
      <Link-config class="mt10" :deviceId='comDeviceId' v-model="model.authEnabled" @change='save' />
      <page-title class="mt20">属性信息</page-title>
      <Attr-info overview :deviceId='comDeviceId' />
    </template>
    <!-- 设备组合 -->
    <template v-else>
      <Binding-device :deviceId='comDeviceId' overview v-model="deviceList" />
      <page-title class="mt20">属性信息</page-title>
      <Collapse-list :deviceList='deviceList'>
        <tempalte slot-scope='{item}'>
          <Attr-info overview componsition :deviceId='item.deviceId' />
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
import {
  netStatusClass,
  statusClass,
  deviceNetTypeList,
  deviceStatusTypeList,
} from '@/utils/baseData'
let dataCopy = {}
export default {
  components: { PageTitle, BindingDevice, AttrInfo, LinkConfig },
  props: {
    type: String,
    label: String,
    isDevice: Boolean, //在设备中使用否则在组合中
    modelId: String,
    value: Array, //设备列表
    deviceName: String
  },
  data() {
    return{
      netStatusClass,
      statusClass,
      deviceNetTypeList,
      deviceStatusTypeList,
      model: {},
      deviceList: []
    }
  },
  watch: {
    deviceList: {
      handler(val) {
        this.$emit('input', val)
      },
    }
  },
  computed: {
    comDeviceId() {
      return this.$route.query.id
    },
    namekey() {
      return this.isDevice ? 'deviceName' : 'name'
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    //编辑保存设备信息
    save() {
      const params = this.isDevice ? {
        id: this.comDeviceId,
        modelId: this.model.modelId,
        deviceName: this.model.deviceName,
        authEnabled: this.model.authEnabled ? 1 : 0
      } : {
        id: this.comDeviceId,
        name: this.model.name,
        remark: this.model.remark,
      }
      let fun = this.isDevice ? this.$API.editDevice : this.$API.editComposition
      fun(params).then(res => {
        this.$message.success('操作成功！')
      })
    },
    cancel() {
      this.model = this.$deepCopy(dataCopy)
    },
    init() {
      if (!this.comDeviceId) {
        return
      }
      //设备详情
      let fun = this.isDevice ? this.$API.getDeviceDetailById : this.$API.getCompositionDetailById
      fun({id: this.comDeviceId}).then( res => {
        const reData = res.data
        this.model = reData
        dataCopy = this.$deepCopy(this.model)
        this.$emit('update:modelId', reData.modelId)
        this.$emit('update:deviceName', reData.deviceName || reData.name)
      })
    }
  }
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