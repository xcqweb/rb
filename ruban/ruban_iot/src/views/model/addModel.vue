<template>
  <page @back='back' content='新增模型'>
    <page-title>基本信息</page-title>
    <p-form
      class="mt20 ml20"
      :form="form" 
      label-align="left" 
      :label-col="{ span: 2 }" 
      :wrapper-col="{ span: 11 }"
    >
      <p-form-item label="模型名称">
        <p-input
          style="width:500px"
          autocomplete='off'
          v-decorator="[
            'modelName',
            { rules: [
              { required: true, message: '请输入模型名称' },
              {pattern:reg.name2Reg,message:'模型名称仅支持中文、字母、数字和下划线“_”'},
              {type: 'string', max: 25,message:'模型名称长度限制为25个字符'},
            ] },
          ]"
          placeholder="请输入模型名称"
        />
      </p-form-item>
      <p-form-item label="上报频率">
        <div class="flex">
          <p-input-number
            style="width:160px"
            :min='1'
            :max='999999999'
            class="mr6"
            autocomplete='off'
            v-decorator="[
            'rate',
             {rules: [
              {type: 'number',required: true, message: '请输入上报频率',trigger: 'change' },
            ]}]"
            placeholder="请输入上报频率"
          />
          <p-select v-model="rateUnit" style="width:160px">
            <p-select-option v-for="item in rateType" :key="item.value" :value="item.value">{{item.text}}</p-select-option>
          </p-select>
          <p class="ml6"> / 次</p>
        </div>
      </p-form-item>
      <p-form-item label="异常判断">
        <p-select v-decorator="['ruleType']" style="width:500px">
          <p-select-option v-for="item in judgeType" :key="item.value" :value="item.value">{{item.text}}</p-select-option>
        </p-select>
      </p-form-item>
      <p-form-item label="判断机制">
        <div class="flex">
          <span>连续</span>
          <p-input-number
            style="width:160px"
            :min='1'
            :max='999999999'
            class="mr6 ml6"
            autocomplete='off'
            v-decorator="['ruleNum',
             {rules: [
              { required: true, message: '请输入判断机制' },
            ]}]"
            placeholder="请输入判断机制"
          />
          <p-select v-model="ruleUnit" style="width:160px">
            <p-select-option v-for="item in rateType" :key="item.value" :value="item.value">{{item.text}}</p-select-option>
          </p-select>
          <p class="ml6">未上报数据</p>
        </div>
      </p-form-item>
      <p-form-item label="描述">
        <p-textarea 
          style="width:500px"
          autocomplete='off'
          v-decorator="[
          'remark',
          {rules: [
            {max: 50,message: '描述长度限制为50个字符',trigger: 'change' },
          ]}
          ]"
          placeholder="请输入描述内容"
        />
      </p-form-item>
    </p-form>
    <page-title>模型定义</page-title>
    <p-tabs>
      <p-tab-pane key="attr" tab="属性">
        <Attr v-model="model.attrData" addBtn add />
      </p-tab-pane>
      <p-tab-pane key="data" tab="数据">
        <Data v-model="model.paramData" addBtn add />
      </p-tab-pane>
      <p-tab-pane key="command" tab="指令">
        <Command v-model="model.commandData" addBtn add />
      </p-tab-pane>
    </p-tabs>
    <div slot="footer" class="tr">
      <p-button type="primary" @click="submit" :loading="loading">提交</p-button>
      <p-button @click="cancel">取消</p-button>
    </div>
  </page>
</template>

<script>

import Data from './tabs/data.vue'
import Attr from './tabs/attr.vue'
import Command from './tabs/command.vue'
import {rateType,judgeType} from '@/utils/baseData'
export default {
  components: {
    Data,
    Attr,
    Command
  },
  data() {
    return {
      model: {
        attrData: [],
        paramData: [],
        commandData: [],
      },
      form: this.$form.createForm(this),
      loading: false,
      rateUnit: '1',
      ruleUnit: '1',
      rateType,
      judgeType
    }
  },
  mounted() {
    window.addEventListener('beforeunload', this.refreshHandler, false);
    this.form.setFieldsValue({ruleType: '0',rate: 1,ruleNum: 5})
  },
  beforeDestroy() {
    window.removeEventListener('beforeunload', this.refreshHandler, false);
  },
  methods: {
    //刷新提示
    refreshHandler(e) {
      e.returnValue = '确定要离开页面？';
      return;
    },
    submit() {
      console.log(this.model)
      return
      this.form.validateFields((err,values) => {
        if(!err) {
          console.log(err,values)
          const params = {
            rateUnit: this.rateUnit,
            ruleUnit: this.rateUnit,
            ...values
          }
          this.loading = true
          this.$API.addModel(params).then( res => {
            this.$message.success('新增成功！')
            this.loading = false
          }).catch( () => {
            this.loading = false
          })
        }
      })
    },
    cancel() {
      this.$router.go(-1)
    },
    back(){
      this.$router.go(-1)
    }
  }
}
</script>