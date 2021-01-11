<template>
  <div>
    <page-title>基本信息</page-title>
    <div class="content">
      <Label label='模型名称'>
        <Edit v-model="model.modelName" @submit="save" @cancel='cancel'></Edit>
      </Label>
      <Label label='模型标识'>
        {{model.mark}}
      </Label>
      <!-- <Label label='上报频率'>
        <Edit normal v-model="model.rate" @change="save">
          <p-input-number v-model="model.rate" :max='999999999' :min='1' class="f1" />
          <p-select class="mr6 ml6" v-model="model.rateUnit" style="width:80px;">
            <p-select-option v-for="item in rateType" :key="item.value" :value="item.value">{{item.text}}</p-select-option>
          </p-select>
        </Edit>
      </Label> -->
      <Label label='异常判断'>
        <Edit normal v-model="model.ruleType" :emunList='judgeTypeList' @submit="save" @cancel='cancel'>
          <p-select class='mr6' v-model="model.ruleType" style="width:120px">
            <p-select-option v-for="item in judgeType" :key="item.value" :value="item.value">{{item.text}}</p-select-option>
          </p-select>
          <p-input-number v-model="model.ruleNum" :max='999999999' :min='1' class="f1" />
          <p-select class="mr6 ml6" v-model="model.ruleUnit" style="width:80px;">
            <p-select-option v-for="item in rateType" :key="item.value" :value="item.value">{{item.text}}</p-select-option>
          </p-select>
        </Edit>
      </Label>
      <Label label='描述'>
        <Edit v-model="model.remark" @submit="save" @cancel='cancel'></Edit>
      </Label>
      <Label label='创建人'>{{model.createBy}}</Label>
      <Label label='创建时间'>{{$formatDate(model.createTime)}}</Label>
    </div>
  </div>
</template>

<script>
import PageTitle from '../../../components/PageTitle/PageTitle.vue'
import {rateType,judgeType,judgeTypeList} from '@/utils/baseData'
let dataCopy = {}
export default {
  components: { PageTitle },
  props: {
    modelId: String,
    registerDeviceNum: Number
  },
  data() {
    return{
      rateType,
      judgeType,
      judgeTypeList,
      model: {}
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.$API.getModelById({id: this.modelId}).then(res => {
        this.model = res.data
        dataCopy = this.$deepCopy(this.model)
        this.$emit('update:registerDeviceNum', res.data.registerDeviceNum)
        this.$emit('update:modelName', res.data.modelName)
      }).catch(() => {
        // 
      })
    },
    save() {
      const params = {id: this.modelId, ...this.model}
      this.$API.editModel(params).then(res => {
        this.$message.success('提交成功！')
        dataCopy = this.$deepCopy(this.model)
      }).catch(() => {
        // 
      })
    },
    cancel() {
      this.model = this.$deepCopy(dataCopy)
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
  }
</style>