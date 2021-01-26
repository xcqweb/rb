<template>
  <page @back='back' content='新增模型' backText="返回列表">
    <page-title>基本信息</page-title>
    <p-form
      class="mt20"
      :form="form" 
      label-align="left" 
      :label-col="{ span: 3 }" 
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
      <p-form-item label="异常判断">
        <p-select v-decorator="['ruleType']" style="width:500px">
          <p-select-option v-for="item in judgeType" :key="item.value" :value="item.value">{{item.text}}</p-select-option>
        </p-select>
      </p-form-item>
      <p-form-item label="判断机制">
        <div class="flex">
          <span class="c-ligth-4">连续</span>
          <p-input
            style="width:160px"
            class="mr6 ml6"
            autocomplete='off'
            v-decorator="['ruleNum',
             {rules: [
              { required: true, message: '请输入判断机制' },
              { type: 'string', max: 9, message: '判断机制长度限制为9个字符' },
              { type: 'string', pattern: reg.num2Reg, message: '仅支持输入数字（大于0整数）' },
            ]}]"
            placeholder="请输入判断机制"
          />
          <p-select v-model="ruleUnit" style="width:160px">
            <p-select-option v-for="item in rateType" :key="item.value" :value="item.value">{{item.text}}</p-select-option>
          </p-select>
          <p class="ml6 c-ligth-4">未上报数据</p>
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
    <p-tabs class="mt20">
      <p-tab-pane v-for="item in tabList" :key="item.key" :tab="item.tab">
        <component
          v-model="model[item.dataKey]"
          :is="item.key"
          add
          addBtn
        ></component>
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
  name: 'addModel',
  components: {
    Data,
    Attr,
    Command
  },
  data() {
    return {
      tabList: [
        {tab: '属性',key: 'Attr', dataKey: 'modelAttributeAddParamList'},
        {tab: '数据',key: 'Data', dataKey: 'modelParamAddParamList'},
        {tab: '指令',key: 'Command', dataKey: 'modelCommandAddParamList'},
      ],
      model: {modelAttributeAddParamList: [], modelParamAddParamList: [], modelCommandAddParamList: []},
      form: this.$form.createForm(this),
      loading: false,
      ruleUnit: 1,
      rateType,
      judgeType
    }
  },
  mounted() {
    window.addEventListener('beforeunload', this.refreshHandler, false);
    this.form.setFieldsValue({ruleType: 1,ruleNum: '5'})
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
      this.form.validateFields((err,values) => {
        if(!err) {
          const params = {modelAddParam: {ruleUnit: this.ruleUnit,...values},...this.model}
          this.loading = true
          this.$API.addModel(params).then( res => {
            this.$message.success('提交成功！')
            this.cancel()
            this.loading = false
          }).catch( () => {
            this.loading = false
          })
        }
      })
    },
    cancel() {
      this.$router.go(-1)
      this.model = {attrData: [],paramData: [],commandData: []}
      this.form.resetFields()
    },
    back(){
      this.cancel()
    }
  }
}
</script>

<style lang="less" scoped>
  .gt-page-content .poros-tabs{
    min-height: auto;
  }
</style>