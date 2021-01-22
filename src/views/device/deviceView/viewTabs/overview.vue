<template>
  <div>
    <page-title>基本信息</page-title>
    <div class="content">
      <Label :label="`${label}名称`">
        <Edit :ref="namekey" v-model="model[namekey]" :error="isError === namekey" normal @submit="save" @cancel='cancel'>
          <p-input v-model="model[namekey]" @change="validate(namekey)"></p-input>
        </Edit>
        <p class="poros-form-explain" v-show="isError === namekey">{{errorInfo}}</p>
      </Label>
      <Label v-if="!isDevice" label='描述'>
        <Edit ref="remark" v-model="model.remark" normal :error="isError === 'remark'" @submit="save" @cancel='cancel'>
          <p-input v-model="model.remark" @change="validate('remark')"></p-input>
        </Edit>
        <p class="poros-form-explain" v-show="isError ==='remark'">{{errorInfo}}</p>
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
      <Link-config class="mt10" :deviceId='comDeviceId'>
        <Label label='设备认证'><p-switch v-model="model.authEnabled" @change="save" /></Label>
        <Label label='设备密钥' v-show="!!model.authEnabled">{{model.token}}<Copy :value='model.token' /></Label>
      </Link-config>
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
import Schema from 'async-validator';
import {debounce} from 'lodash'
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
    label: String, //‘组合’或‘设备’
    isDevice: Boolean, //在设备中使用否则在组合中
    modelId: String, //模型id
    value: Array, //设备列表
    deviceName: String, //设备名称
    deviceMark: String, //设备标识
    modelMark: String, //模型标识
  },
  data() {
    return{
      netStatusClass,
      statusClass,
      deviceNetTypeList,
      deviceStatusTypeList,
      model: {},
      deviceList: [],
      ////校验
      isError: '',
      errorInfo: ''
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
    save: debounce(function() {
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
      }).catch( () => {
        this.cancel()
      })
    },600),
    cancel() {
      this.model = this.$deepCopy(dataCopy)
      this.isError = ''
    },
    // hide(key) {
    //   this.$refs[key] && this.$refs[key].cancel()
    // },
    //校验
    validate(key) {
        const rurleMap = {
          [this.namekey]: {
            [this.namekey]: [
              {required: true, message: `请输入${this.label}名称` },
              {pattern: this.reg.name2Reg,message:`${this.label}名称仅支持中文、字母、数字和下划线“_”`},
              {type: 'string', max: 25,message:`${this.label}名称长度限制为25个字符`},
            ]
          },
          remark: {
            remark: [
              {max: 50,message: '描述长度限制为50个字符'},
            ]
          }
        }
        const descriptor = rurleMap[key]
            
        const validator = new Schema(descriptor);
        validator.validate(this.model, (errors, fields) => {
        if (errors) {
          console.log(errors)
          this.isError = key
          this.errorInfo = errors[0].message
          return handleErrors(errors, fields);
        }else{
          this.isError = ''
        }
      });
    },
    init() {
      if (!this.comDeviceId) {
        return
      }
      //设备/组合 详情
      let fun = this.isDevice ? this.$API.getDeviceDetailById : this.$API.getCompositionDetailById
      fun({id: this.comDeviceId}).then( res => {
        const reData = res.data
        this.model = reData
        dataCopy = this.$deepCopy(this.model)
        this.$emit('update:modelId', reData.modelId)
        this.$emit('update:deviceName', reData.deviceName || reData.name)
        if (this.isDevice) {
          this.$emit('update:modelMark', reData.modelMark)
          this.$emit('update:deviceMark', reData.deviceMark)
        }
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
    /deep/.poros-form-explain{
      color: #f5222d;
      margin-top: 6px;
      transition: all 0.3s;
    }
  }
</style>