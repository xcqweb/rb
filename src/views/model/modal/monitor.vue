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
      :rules="comRules"
      :label-col="{span: 4}"
      :wrapper-col="{span: 20}"
      label-align="left"
    >
      <p-form-model-item prop="alarmLevelId">
        <span slot="label" class="required-doc">报警等级</span>
        <p-select v-model="model.alarmLevelId">
            <p-select-option v-for="item in alarmLevelList" :value='item.value' :key='item.value'>{{item.text}}</p-select-option>
          </p-select>
      </p-form-model-item>
      <div class="flex_monitor">
        <p-form-model-item class="judge">
          <span slot="label" class="required-doc">报警阈值</span>
          <p-select v-model="model.limit" @change='changeLimit' class="w160">
            <p-select-option v-for="item in formualList" :value='item.value' :key='item.value'>{{item.text}}</p-select-option>
          </p-select>
        </p-form-model-item>
        <p-form-model-item prop="firstVal">
            <p-input class="f1 mr6 ml6 w160" @blur="blurFun('firstVal')" v-model="model.firstVal" placeholder="请输入阈值" />
        </p-form-model-item>
        <p-form-model-item prop="secondVal" v-if="isBetween">
            <p-input class="f1 w160" @blur="blurFun('secondVal')" v-model="model.secondVal" placeholder="请输入阈值" />
        </p-form-model-item>
      </div>
      <p-form-model-item label="报警信息" prop="remark">
        <p-input v-model.trim="model.remark" placeholder="请输入报警信息" />
      </p-form-model-item>
    </p-form-model>
  </p-modal>
</template>

<script>
import modalMixins from '@/mixins/modal'
import pattern from '@/utils/pattern'
import {mapState} from 'vuex'
import {formualList,formualMap} from '@/utils/baseData'
export default {
  mixins: [modalMixins],
  data() {
    return {formualList,model: {}}
  },
  computed: {
    ...mapState({
      alarmLevelList: state => state.dic.alarmLevelList
    }),
    comRules() {
      return {
        remark: {type: 'string',max: 50,message: '报警信息长度限制为50个字符'},
        firstVal: this.extraType ? [
          {required: true,message: '请输入阈值'},
          {type: 'string',max: 25,message: '输入长度限制为25个字符'},
          {message: '输入字符仅支持字母、数字（整数和小数）或下划线“_”',pattern: pattern.nameReg},
          {
            validator: (rule, value, callback) => {
              if (!isNaN(value) && value.length > 9) {
                callback(new Error('输入长度限制为9个字符！'))
              }else{
                callback()
              }
            },
          },
          ] : [
            {required: true,message: '请输入阈值'},
            {type: 'string',max: 9,message: '输入长度限制为9个字符'},
            {message: '输入字符仅支持数字（整数和小数）',pattern: pattern.numReg}
          ],
        secondVal: !this.extraType && [
          {required: true,message: '请输入阈值'},
          {type: 'string',max: 9,message: '输入长度限制为9个字符'},
          {message: '输入字符仅支持数字（整数和小数）',pattern: pattern.numReg},
          {
            validator: (rule, value, callback) => {
              const {firstVal,secondVal} = this.model
              if (+firstVal >= +secondVal) {
                callback(new Error('左边阈值须小于右边阈值！'))
              }else{
                callback()
              }
            },
          },
        ],
      }
    },
    isBetween() {
      const {limit} = this.model 
      return  limit === '<>' || limit === '><'
    },
    extraType() {
      const {limit} = this.model 
      return  limit === '==' || limit === '!='
    },
    moreEdit() {
      const {type} = this.options
      return type === 'edit'
    },
    formula() {
      const {limit,paramMark,firstVal,secondVal} = this.model
      if (limit === '<>') {
        return `${paramMark}<${firstVal}||${paramMark}>${secondVal}`
      }else if(limit === '><'){
        return `${paramMark}>${firstVal}&&${paramMark}<${secondVal}`
      }else{
        return `${paramMark}${limit}${firstVal}`
      }
    },
    formulaView() {
      const {limit,firstVal,secondVal} = this.model
      if (this.isBetween) {
        return `${formualMap[limit]} ${firstVal} ~ ${secondVal}`
      }else{
        return `${formualMap[limit]}${firstVal}`
      }
    }
  },
  created() {
    this.$watch('visible', (val) => {
      if (val) {
        this.model = {alarmLevelId: '1',limit: '==',firstVal: '',secondVal: '', ...this.options}
        const {firstVal,secondVal} = this.model
        this.model.firstVal = firstVal ? (firstVal + '').trim() : ''
        this.model.secondVal = secondVal ? (secondVal + '').trim() : ''
      }
    });
  },
  methods: {
    blurFun(key) {
      if (!isNaN(this.model[key])) {
        this.model[key] = Number(this.model[key]) + ''
      }
    },
    changeLimit() {
      this.model.firstVal = ''
      this.model.secondVal = ''
      this.$refs.form.resetFields()
    },
    cancel() {
      this.loading = false
      this.visible = false
      this.$refs.form.resetFields()
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const {formulaView,formula} = this
          const data = Object.assign(this.model,{formulaView,formula,enabled:0});
          delete data.type
          let func;
          let message = '提交成功！'
          const {type} = this.options;
          if (type === 'add') {
            func = this.$API.addModelParamsAlarm
          } else if(type === 'edit') {
            func = this.$API.editModelParamsAlarm
          } else if(type === 'first-add'){//新增模型时添加
            this.$message.success(message)
            this.$emit('callback', {type,...data, id: this.uuid()})
            this.cancel()
            return
          }else if(type === 'first-edit'){//新增模型时编辑
            this.$message.success(message)
            this.$emit('callback', {type,...data})
            this.cancel()
            return
          }
          func(data).then(res => {
            this.cancel()
            this.$message.success(message)
            this.$emit('callback', {type, ...this.model})
          }).catch(() => {
            this.loading = false
          })
        }
      })
    },
  }
}
</script>

<style lang="less" scoped>
/deep/.judge{
  .poros-col{
    width: 98px;
  }
}
.flex_monitor{
  display: flex;
}
.poros-form{
  /deep/.poros-form-explain{
    width: 160px;
    padding-left: 6px;
  }
}
</style>