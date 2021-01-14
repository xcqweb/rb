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
  data() {
    return {
      paramType,
      plainOptions: useOption.slice(0,2),
      model: {checkedList: []},
      rules: {
        paramName: [
          {
            type: 'string',
            max: 25,
            message: '参数名称长度限制为25个字符'
          },
          {
            type: 'string',
            message: '参数名称仅支持中文、字母、数字或下划线“_”',
            pattern: pattern.name2Reg
          },
        ],
        paramMark: [
          {
            required: true,
            message: '请输入参数标识'
          },
          {
            max: 20,
            message: '参数标识长度限制为20个字符'
          },
          {
            type: 'string',
            message: '参数标识仅支持数字、字母或下划线“_”',
            pattern: pattern.nameReg
          },
        ],
        paramPrecision: [
          { type: 'number', max: 999999999, message: '计算精度长度限制为9个字符' },
        ],
        unit: [
          {
            type: 'string',
            max: 25,
            message: '单位长度限制为25个字符'
          },
        ],
        checkedList: [
          {
            validator: (rule, value, callback) => {
              if (Array.isArray(value) && !value.length) {
                callback(new Error('请勾选用途！'))
              }else{
                callback()
              }
            },
          },
        ],
      }
    }
  },
  computed: {
    moreEdit() {
      const {type} = this.options
      return type === 'edit'
    }
  },
  created() {
    this.$watch('visible', (val) => {
      if (val) {
        console.log(this.options)
        this.model = {paramType: 3,used: 2,...this.options}
        const {used} = this.model
        const obj = {
          0: ['存储'],
          1: ['显示'],
          2: ['存储','显示'],
        }
        this.$set(this.model, 'checkedList', obj[used])
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
          this.loading = true
          if (this.model.checkedList.length > 1) {
            this.model.used = 2
          }else{
            if (this.model.checkedList[0] === '存储') {
              this.model.used = 0
            }else{
              this.model.used = 1
            }
          }
          if (!this.model.paramName) {
            this.model.paramName = this.model.paramMark
          }
          const data = Object.assign({}, this.model)
          delete data.type
          let func
          let message = '提交成功！'
          const {type} = this.options
          if (type === 'add') {
            func = this.$API.addModelParams
          } else if(type === 'edit') {
            func = this.$API.editModelParams
          } else if(type === 'first-add'){//新增模型时添加
            this.$message.success(message)
            this.$emit('callback', {type,modal: 'param', ...data,id: this.uuid()})
            this.cancel()
            return
          }else if(type === 'first-edit'){//新增模型时编辑
            this.$message.success(message)
            this.$emit('callback', {type,modal: 'param', ...data})
            this.cancel()
            return
          }
          this.cancel()
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

<style lang="less">
.platform-menu {
  &-icon {
    &-selected,
    &-wrap {
      .anticon,
      .iconfont {
        font-size: 24px;
        vertical-align: middle;
      }
    }

    &-selected,
    &-choose {
      width: 30px;
      height: 30px;
      line-height: 30px;
      text-align: center;
      cursor: pointer;
    }

    &-choose {
      color: @c-bg-4;
      border: 1px dashed @c-bg-4;
      display: flex;
      align-items: center;
      justify-content: center;
      // background-color: @c-bg-2;
    }

    &-wrap {
      display: flex;
      flex-wrap: wrap;
      width: 300px;
      box-shadow: 0px 2px 4px 0px rgba(4, 12, 44, 0.25);
      background-color: @c-white;

      .icon-item {
        position: relative;
        width: 60px;
        height: 50px;
        line-height: 50px;
        text-align: center;
        cursor: pointer;

        &:hover {
          background-color: @c-bg-3;
        }

        &::before,
        &:not(:nth-child(5n))::after {
          content: "";
          position: absolute;
          background-color: @c-bg-1;
        }

        &::before {
          left: 0;
          bottom: 0;
          width: 100%;
          height: 1px;
        }

        &:not(:nth-child(5n)) {
          &::after {
            right: 0;
            bottom: 0;
            width: 1px;
            height: 100%;
          }
        }
      }
    }
  }
}
</style>