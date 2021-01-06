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
      <p-form-model-item prop="alarmLevel">
        <span slot="label" class="required-doc">报警等级</span>
        <p-select v-model="model.alarmLevel">
            <p-select-option v-for="item in alarmLevel" :value='item.value' :key='item.value'>{{item.text}}</p-select-option>
          </p-select>
      </p-form-model-item>
      <p-form-model-item prop="limit">
        <span slot="label" class="required-doc">报警阈值</span>
        <div class="flex">
          <p-select v-model="model.limit" style="width:120px;">
            <p-select-option v-for="item in formualList" :value='item.value' :key='item.value'>{{item.text}}</p-select-option>
          </p-select>
          <p-input class="f1 mr6 ml6" v-model.trim="model.firstVal" placeholder="请输入阈值" />
          <p-input class="f1" v-show="isBetween" v-model.trim="model.secondVal" placeholder="请输入阈值" />
        </div>
      </p-form-model-item>
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
      }
    }
  },
  computed: {
    isBetween() {
      const {limit} = this.model 
      return  limit === '<>' || limit === '><'
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
      this.loading = false
      this.visible = false
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          const data = Object.assign({}, this.model);
          let func;
          let message;
          const {type} = this.options;
          if (type === 'add') {
            // func = addOrg
            message = '添加成功'
          } else if(type === 'edit') {
            // func = modOrg
            message = '修改成功'
          } else if(type === 'first-add'){//新增模型时添加
            message = '添加成功'
            this.$message.success(message)
            this.$emit('callback', {type, ...this.model, id: this.uuid()})
            this.cancel()
            return
          }else if(type === 'first-edit'){//新增模型时编辑
            message = '修改成功'
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