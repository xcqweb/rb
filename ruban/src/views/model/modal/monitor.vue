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
      <p-form-model-item prop="alarmLevel">
        <span slot="label" class="required-doc">报警等级</span>
        <p-select v-model="model.alarmLevel">
            <p-select-option v-for="item in alarmLevel" :value='item.value' :key='item.value'>{{item.text}}</p-select-option>
          </p-select>
      </p-form-model-item>
      <div class="flex">
        <p-form-model-item label='报警阈值' class="judge">
          <p-select v-model="model.limit" style="width:120px;">
            <p-select-option v-for="item in formualList" :value='item.value' :key='item.value'>{{item.text}}</p-select-option>
          </p-select>
        </p-form-model-item>
        <p-form-model-item prop="firstVal" class="ml20">
            <p-input-number v-show="!extraType" class="f1 mr6 ml6" v-model.trim="model.firstVal" placeholder="请输入阈值" />
            <p-input v-show="extraType" class="f1 mr6 ml6" v-model.trim="model.firstVal" placeholder="请输入阈值" />
        </p-form-model-item>
        <p-form-model-item prop="secondVal" v-if="isBetween">
            <p-input-number class="f1" v-model.trim="model.secondVal" placeholder="请输入阈值" />
        </p-form-model-item>
      </div>
      <p-form-model-item label="报警信息" prop="alarmInfo">
        <p-input v-model.trim="model.alarmInfo" placeholder="请输入报警信息" />
      </p-form-model-item>
    </p-form-model>
  </p-modal>
</template>

<script>
import modalMixins from '@/mixins/modal'
import pattern from '@/utils/pattern'
import {formualList,alarmLevel} from '@/utils/baseData'
export default {
  mixins: [modalMixins],
  data() {
    return {
      formualList,
      alarmLevel,
      model: {
        alarmLevel: this.options.alarmLevel || '0',
        limit: this.options.limit || '==',
        firstVal: this.options.firstVal || '',
        secondVal: this.options.secondVal || '',
        alarmInfo: this.options.alarmInfo || '',
        id: this.options.id || '',
        paramId: this.options.paramId || '',
      },
      rules: {
        alarmInfo: [
          {
            type: 'string',
            max: 50,
            message: '报警信息限制为50个字符'
          },
        ],
        firstVal: [
          {
            required: true,
            message: '请输入阈值'
          },
        ],
        secondVal: [
          {
            required: this.isBetween,
            message: '请输入阈值'
          },
        ],
      }
    }
  },
  computed: {
    comRules() {
    return {
        alarmInfo: [
          {
            type: 'string',
            max: 50,
            message: '报警信息长度限制为50个字符'
          },
        ],
        firstVal: [
          {
            required: true,
            message: '请输入阈值'
          },
          {
            type: 'string',
            max: 25,
            message: '输入长度限制为25个字符'
          },
          {
            message: '输入字符仅支持中文、字母、数字（整数和小数）或下划线“_”',
            pattern: pattern.name4Reg
          },
        ],
        secondVal: !this.extraType && [
          {
            required: true,
            message: '请输入阈值'
          },
          {
            type: 'string',
            max: 25,
            message: '输入长度限制为25个字符'
          },
          {
            message: '输入字符仅支持中文、字母、数字（整数和小数）或下划线“_”',
            pattern: pattern.name4Reg
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
    }
  },
  created() {
    this.$watch('visible', (val) => {
      if (val) {
        this.model = {alarmLevel: '0',limit: '==', ...this.options}
      }
    });
  },
  methods: {
    cancel() {
      this.$refs.form.resetFields()
      this.$refs.paramsValidateForm.resetFields()
      this.loading = false
      this.visible = false
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const data = Object.assign({}, this.model);
          let func;
          let message = '操作成功！'
          const {type} = this.options;
          if (type === 'add') {
            // func = addOrg
          } else if(type === 'edit') {
            // func = modOrg
          } else if(type === 'first-add'){//新增模型时添加
            this.$message.success(message)
            this.$emit('callback', {type, ...this.model, id: this.uuid()})
            this.cancel()
            return
          }else if(type === 'first-edit'){//新增模型时编辑
            this.$message.success(message)
            this.$emit('callback', {type, ...this.model})
            this.cancel()
            return
          }
          func(data).then(res => {
            this.cancel()
            this.$message.success(message)
            this.$emit('callback')
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
</style>