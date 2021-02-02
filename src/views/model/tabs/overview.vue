<template>
  <p-spin :spinning='loading'>
    <page-title>基本信息</page-title>
    <div class="content">
      <Label label='模型名称'>
        <Edit ref="modelName" normal v-model="model.modelName" :error="isError ==='modelName'" @submit="save" @cancel='cancel'>
          <p-input class="edit_input" v-focus @change="validate('modelName')" v-model="model.modelName" placeholder="请输入" />
        </Edit>
        <p class="poros-form-explain" v-show="isError ==='modelName'">{{errorInfo}}</p>
      </Label>
      <Label label='模型标识'>
        {{model.mark}}
      </Label>
      <Label label='异常判断'>
        <Edit ref='ruleNum' normal v-model="model.ruleType" :error="isError ==='ruleNum'" :emunList='judgeTypeList' @submit="save" @cancel='cancel'>
          <p-select class='mr6' v-model="model.ruleType" style="width:120px">
            <p-select-option v-for="item in judgeType" :key="item.value" :value="item.value">{{item.text}}</p-select-option>
          </p-select>
          <p-input @change="validate('ruleNum')" v-focus v-model="model.ruleNum" class="f1" />
          <p-select class="mr6 ml6" v-model="model.ruleUnit" style="width:80px;">
            <p-select-option v-for="item in rateType" :key="item.value" :value="item.value">{{item.text}}</p-select-option>
          </p-select>
        </Edit>
        <p class="poros-form-explain" v-show="isError ==='ruleNum'">{{errorInfo}}</p>
      </Label>
      <Label label='描述'>
        <Edit ref='remark' normal @change="validate('remark')" :error="isError ==='remark'" v-model="model.remark" @submit="save" @cancel='cancel'>
          <p-input class="edit_input" v-focus @change="validate('remark')" v-model="model.remark" placeholder="请输入描述内容" />
        </Edit>
        <p class="poros-form-explain" v-show="isError ==='remark'">{{errorInfo}}</p>
      </Label>
      <Label label='创建人'>{{model.createBy}}</Label>
      <Label label='创建时间'>{{$formatDate(model.createTime)}}</Label>
    </div>
  </p-spin>
</template>

<script>
import {rateType,judgeType,judgeTypeList} from '@/utils/baseData'
import Schema from 'async-validator';
let dataCopy = {}
export default {
  props: {
    modelId: String,
    registerDeviceNum: Number,
    loading: Boolean
  },
  data() {
    return{
      rateType,
      judgeType,
      judgeTypeList,
      model: {},
      isError: '',
      errorInfo: '',
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$emit('update:loading', true)
      this.$API.getModelById({id: this.modelId}).then(res => {
        this.model = res.data
        dataCopy = this.$deepCopy(this.model)
        this.$emit('update:loading', false)
        this.$emit('update:registerDeviceNum', res.data.registerDeviceNum)
      }).catch(() => {
        this.$emit('update:loading', false)
      })
    },
    save() {
      if (this.isError) {
        return
      }
      const params = {id: this.modelId, ...this.model}
      this.$API.editModel(params).then(res => {
        this.$message.success('提交成功！')
        dataCopy = this.$deepCopy(this.model)
      }).catch(() => {
        this.cancel()
      })
    },
    cancel() {
      this.model = this.$deepCopy(dataCopy)
    },
    //校验
    validate(key) {
        const rurleMap = {
          modelName: {
            modelName: [
              {required: true, message: '请输入模型名称' },
              {pattern: this.reg.name2Reg,message:'模型名称仅支持中文、字母、数字和下划线“_”'},
              {type: 'string', max: 25,message:'模型名称长度限制为25个字符'},
            ]
          },
          ruleNum: {
            ruleNum: [
              { required: true, message: '请输入判断机制' },
              { type: 'string', max: 9, message: '判断机制长度限制为9个字符' },
              { type: 'string', pattern: this.reg.num2Reg, message: '仅支持输入数字（整数）' },
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
    }
  }
}
</script>

<style lang="less" scoped>
  .content{
    display: flex;
    flex-wrap: wrap;
    padding-top: 12px;
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