<template>
  <p-modal
    v-model="visible"
    :width="640"
    :confirm-loading="loading"
    :mask-closable="false"
    :title="title"
    centered
    @cancel="cancel"
    @ok="confirm"
  >
    <p-form-model
      ref="form"
      :model="model"
      :rules="rules"
      :label-col="{span: 4}"
      :wrapper-col="{span: 20}"
      label-align="left"
    >
      <p-form-model-item label="参数标识" prop="paramMark">
        <p-input v-model="model.paramMark" :disabled='moreEdit' placeholder="请输入参数标识" />
      </p-form-model-item>
      <p-form-model-item label="参数名称" prop="paramName">
        <p-input v-model.trim="model.paramName" placeholder="请输入参数名称" />
      </p-form-model-item>
      <p-form-model-item label="参数类型" prop="paramType" placeholder="请选择参数类型">
        <p-select v-model="model.paramType">
            <p-select-option v-for="item in paramType" :key="item.value" :value="item.value">{{item.text}}</p-select-option>
          </p-select>
      </p-form-model-item>
      <p-form-model-item label="精度" prop="paramPrecision">
        <p-input-number style="width:100%" :min='0' v-model.trim="model.paramPrecision" placeholder="请输入计算精度" />
      </p-form-model-item>
      <p-form-model-item label="单位" prop="unit">
        <p-input v-model.trim="model.unit" placeholder="请输入单位" />
      </p-form-model-item>
      <p-form-model-item prop="checkedList">
        <span slot="label" class="required-doc">用途</span>
        <p-checkbox-group v-model="model.checkedList" :options="plainOptions" />
      </p-form-model-item>
    </p-form-model>
  </p-modal>
</template>

<script>
import modalMixins from '@/mixins/modal'
import pattern from '@/utils/pattern'
import {paramType, useOption} from '@/utils/baseData'
export default {
  mixins: [modalMixins],
  props: {
    validFun: Function
  },
  data() {
    return {
      paramType,
      plainOptions: useOption.slice(0,2),
      model: {checkedList: []},
      rules: {
        paramName: [
          {type: 'string',max: 25,message: '参数名称长度限制为25个字符'},
          {type: 'string',message: '参数名称仅支持中文、字母、数字或下划线“_”',pattern: pattern.name2Reg},
        ],
        paramMark: [
          {required: true,message: '请输入参数标识'},
          {max: 20,message: '参数标识长度限制为20个字符'},
          {type: 'string',message: '参数标识仅支持数字、字母或下划线“_”',pattern: pattern.nameReg},
        ],
        paramPrecision: [{ type: 'number', max: 999999999, message: '计算精度长度限制为9个字符' }],
        unit: [{type: 'string',max: 25,message: '单位长度限制为25个字符'}],
        checkedList: [{
          validator: (rule, value, callback) => {
            if (Array.isArray(value) && !value.length) {
              callback(new Error('请勾选用途！'))
            }else{
              callback()
            }
          },
        }],
      }
    }
  },
  computed: {
    moreEdit() {
      const {type} = this.options
      return type === 'edit'
    },
    isAdd() {
      const {type} = this.options
      return type === 'first-add' || type === 'add'
    }
  },
  created() {
    this.$watch('visible', (val) => {
      if (val) {
        this.model = {paramType: 3,used: 2,...this.options}
        const {used} = this.model
        const obj = {0: ['存储'],1: ['显示'],2: ['存储','显示']}
        this.$set(this.model, 'checkedList', used === null ? [] : obj[used])
      }
    });
  },
  methods: {
    cancel() {
      this.visible = false
      this.loading = false
      this.$refs.form.resetFields()
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          if (this.model.checkedList.length > 1) {
            this.model.used = 2
          }else{
            if (this.model.checkedList[0] === '存储') {
              this.model.used = 0
            }else{
              this.model.used = 1
            }
          }
          if (!this.model.paramName && this.isAdd) {
            this.model.paramName = this.model.paramMark
          }
          const data = Object.assign({createOption: 0}, this.model)
          delete data.type
          let func
          let message = '提交成功！'
          const {type} = this.options
          this.$message.destroy()
          if (type === 'add') {
            func = this.$API.addModelParams
          } else if(type === 'edit') {
            func = this.$API.editModelParams
          } else if(type === 'first-add'){//新增模型时添加
            if (this.validFun(this.model.paramMark)) {
              this.$message.error('参数标识不能重复！')
              return
            }
            this.$message.success(message)
            this.$emit('callback', {type,modal: 'param', ...data,id: this.uuid()})
            this.cancel()
            return
          }else if(type === 'first-edit'){//新增模型时编辑
            if (this.validFun(this.model.paramMark,this.model.id)) {
              this.$message.error('参数标识不能重复！')
              return
            }
            this.$message.success(message)
            this.$emit('callback', {type,modal: 'param', ...data})
            this.cancel()
            return
          }
          this.loading = true
          func(data).then(res => {
            this.cancel()
            this.$message.success(message)
            this.$emit('callback',{type,modal: 'param'})
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
  }
}
</script>