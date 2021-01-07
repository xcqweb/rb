<template>
  <page :content='comTitle' @back='back'>
    <div class="flex">
      <Page-title>基本信息</Page-title>
      <p class="ml20">sss</p>
    </div>
    <p-form
      class="mt20"
      :form="form" 
      label-align="left" 
      :label-col="{ span: 2 }" 
      :wrapper-col="{ span: 11 }"
    >
      <p-form-item :label="`${this.comLabel}名称`">
        <p-input
          autocomplete='off'
          v-decorator="[
            'ModelName',
            { rules: [
              { required: true, message: `请输入${this.comLabel}名称` },
              {pattern:reg.name2Reg,message:`${this.comLabel}名称仅支持中文、字母、数字和下划线`},
              {type: 'string', max: 25,message:`${this.comLabel}名称长度限制为25个字符`},
            ] },
          ]"
          :placeholder="`请输入${this.comLabel}名称`"
        />
      </p-form-item>
      <p-form-item label="所属模型" v-if="isDevice">
        <p-select 
          v-decorator="[
          'descript',
          {rules: [
            {required:true,message: '请选择所属模型',trigger: 'change' },
          ]}
          ]"
          placeholder="请选择所属模型"
        >
          <p-select-option v-for="item in modelList" :key="item.value" :value="item.value">{{item.text}}</p-select-option>
        </p-select>

      </p-form-item>
      <p-form-item label="描述" v-else>
        <p-textarea 
          autocomplete='off'
          v-decorator="[
          'descript',
          {rules: [
            {max: 50,message: '描述长度限制为50个字符',trigger: 'change' },
          ]}
          ]"
          placeholder="请输入描述内容"
        />
      </p-form-item>
    </p-form>
    <Page-title>{{comPageTitle}}</Page-title>
    <component
      :is='componentId'
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
export default {
  components: {AttrInfo,BindingDevice},
  data() {
    return{
      form: this.$form.createForm(this),
      loading: false,
      modelList: []
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
    }
  },
  methods: {
    submit() {
      this.form.validateFields((err,values) => {
        if(!err) {
          console.log(err,values)
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

<style lang="less" scoped>
  
</style>