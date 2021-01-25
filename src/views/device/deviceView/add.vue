<template>
  <page :content='comTitle' @back='back'>
    <div class="flex">
      <Page-title>基本信息</Page-title>
    </div>
    <p-form-model
      class="mt20"
      ref="form"
      :model="model"
      :rules="rules"
      :label-col="{span: 2}"
      :wrapper-col="{span: 13}"
      label-align="left"
    >
      <p-form-model-item label="当前节点">
        <span class="c-text-4">{{locationNamePath}}</span>
      </p-form-model-item>
      <p-form-model-item :label="`${this.comLabel}名称`" prop='name'>
        <p-input v-model="model.name" class="w-medium"/>
      </p-form-model-item>
      <p-form-model-item label="所属模型" v-if="isDevice" prop='modelId'>
        <Infinity-select
          style="width:500px"
          :api='$API.getModelList'
          v-model="model.modelId"
          :extraData="{orderType: 1}"
          :dataKey="{value: 'id', label: 'modelName'}"
        />
      </p-form-model-item>
      <p-form-model-item label="描述" v-else prop='remark'>
        <p-textarea
          class="w-medium"
          autocomplete='off'
          v-model="model.remark"
          placeholder="请输入描述内容"
        />
      </p-form-model-item>
    </p-form-model>
    <Page-title>{{comPageTitle}}</Page-title>
    <component
      :is='componentId'
      :modelId='model.modelId.value'
      @callback='callback'
      ref="componentRef"
      :error.sync='error'
    ></component>
    <div slot="footer" class="tr">
      <p-button type="primary" @click="submit" :loading="loading">提交</p-button>
      <p-button @click="cancel">取消</p-button>
    </div>
  </page>
</template>

<script>
import AttrInfo from './children/attrInfo'
import BindingDevice from './children/bindingDevice'
const validateFun = (rule, value, callback) => {
  if (!value.value) {
    callback(new Error('请选择所属模型！'))
  }else{
    callback()
  }
}
export default {
  name: 'addDevice',
  components: {AttrInfo,BindingDevice},
  data() {
    return{
      loading: false,
      modelList: [],
      bindDada: [],
      model: {modelId: {}},
      error: false, //输入错误提示
    }
  },
  computed: {
    componentId() {
      return this.isDevice ? 'AttrInfo' : 'BindingDevice'
    },
    comTitle() {
      return `新增${this.comLabel}`
    },
    comType() {
      const {type} = this.$route.query
      return type
    },
    comPageTitle() {
      return this.isDevice ? '属性信息' : '绑定设备'
    },
    comLabel() {
      return this.isDevice ? '设备' : '组合'
    },
    isDevice() {
      return this.comType === 'device'
    },
    locationId() {
      return this.$route.query.locationId
    },
    locationNamePath() {
      return this.$route.query.locationNamePath
    },
    rules() {
      return {
        name: [
          {required: true, message: `请输入${this.comLabel}名称` },
          {pattern: this.reg.name2Reg,message:`${this.comLabel}名称仅支持中文、字母、数字和下划线`},
          {type: 'string', max: 25,message:`${this.comLabel}名称长度限制为25个字符`},
        ],
        modelId: [
          {required: true,validator:validateFun},
        ],
        remark: [
          {max: 50,message: '描述长度限制为50个字符',trigger: 'change' },
        ]
      }
    }
  },
  methods: {
    submit() {
      this.$refs.form.validate((valid) => {
        if(valid && !this.error) {
          let fun = this.isDevice ? this.$API.addDevice : this.$API.addComposition
          const {name,modelId,remark} = this.model
          let params = this.isDevice ? {
            deviceName: name,
            modelId: modelId.key,
            remark,
            locationId: this.locationId,
            deviceAttributeAddParamList: this.$refs.componentRef.comList
          } : {
            locationId: this.locationId,
            name,
            remark,
            deviceIdList: this.$refs.componentRef.checkedList
          }
          this.loading = true
          fun(params).then( res => {
            this.loading = false
            this.$message.success('操作成功！')
            this.back()
          }).catch( () => {
            this.loading = false
          })
        }
      })
    },
    cancel() {
      this.back()
    },
    back() {
      this.$router.go(-1)
    }
  },
}
</script>