<template>
  <p-modal
    v-model="visible"
    :width="490"
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
      <p-form-model-item label="父亲节点" prop="parentNode">
        <p-input :value="model.parentNode" disabled />
      </p-form-model-item>
      <p-form-model-item label="节点名称" prop="nodeName">
        <p-input v-model.trim="model.nodeName" placeholder="请输入节点名称" />
      </p-form-model-item>
    </p-form-model>
  </p-modal>
</template>

<script>
import modalMixins from '@/mixins/modal'
import pattern from '@/utils/pattern'

export default {
  mixins: [modalMixins],
  data() {
    return {
      emunList: [{range: '',rangeName: ''}],
      model: {
        parentName: this.options.parentName || '',
        nodeName: this.options.name || '',
      },
      rules: {
        nodeName: [
          {
            required: true,
            message: '请输入节点名称'
          },
          {
            type: 'string',
            max: 25,
            message: '节点名称长度限制为25个字符'
          },
          {
            type: 'string',
            message: '节点名称仅支持中文、字母、数字或下划线',
            pattern: pattern.name2Reg
          },
        ],
      }
    }
  },
  created() {
    this.$watch('visible', (val) => {
      if (val) {
        this.model = {
          parentName: this.options.parentName || '',
          nodeSign: this.options.name || '',
        }
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
          const data = Object.assign({}, this.model)
          data.parentCode = this.options.parentCode
          let func
          let message
          if (!this.options.isEdit) {
            func = addOrg
            message = '添加成功'
          } else {
            func = modOrg
            message = '修改成功'
          }
          func(data).then(res => {
            this.cancel()
            this.$message.success(message)
            this.$emit('callback', {...data, p_isLeaf: this.options.selectedItem.isLeaf}, this.options.isEdit ? 1 : 0)
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