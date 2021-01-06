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
      <p-form-model-item label="属性标识" prop="attributeMark">
        <p-input v-model="model.attributeMark" placeholder="请输入属性标识" />
      </p-form-model-item>
      <p-form-model-item label="属性名称" prop="attributeName">
        <p-input v-model.trim="model.attributeName" placeholder="请输入组织名称" />
      </p-form-model-item>
      <p-form-model-item label="属性类型" prop="attributeType">
        <p-select v-model="model.attributeType">
            <p-select-option v-for="item in attrType" :key="item.value" :value="item.value">{{item.text}}</p-select-option>
          </p-select>
      </p-form-model-item>
      <p-form-model-item prop="range">
        <span slot="label" class="required-doc">枚举范围</span>
        <div class="flex" v-for="(item, index) in emunList" :class="{mt10: index !== 0}">
          <p-input class="mr6" v-model.trim="item.range" placeholder="请输入枚举值" />
          <p-input v-model.trim="item.rangeName" placeholder="请输入显示名称" />
          <p-icon class="ml6 mr6 f14" type="delete" @click="delEmun(index)" v-show="hideDelBtn" />
        </div>
        <span class="viewDetail">
          <span @click="addEmun" v-show="hideAddBtn"><p-icon type="plus"/>新增枚举</span>
          <span class="c-text mt6 ml10">(最多添加10个枚举项)</span>
        </span>
      </p-form-model-item>
      <p-form-model-item label="获取方式" prop="createOption">
        <p-select v-model="model.createOption">
            <p-select-option v-for="item in getType" :key="item.value" :value="item.value">{{item.text}}</p-select-option>
          </p-select>
      </p-form-model-item>
    </p-form-model>
  </p-modal>
</template>

<script>
import modalMixins from '@/mixins/modal'
import pattern from '@/utils/pattern'
import {getType,attrType} from '@/utils/baseData'
export default {
  mixins: [modalMixins],
  data() {
    return {
      getType,
      attrType,
      emunList: [{range: '',rangeName: ''}],
      model: {},
      rules: {
        attributeName: [
          {
            type: 'string',
            max: 25,
            message: '属性名称限制为25个字符'
          },
          {
            type: 'string',
            message: '属性名称仅支持中文、字母、数字或下划线“_”',
            pattern: pattern.name2Reg
          },
        ],
        attributeMark: [
          {
            required: true,
            message: '请输入属性标识'
          },
          {
            max: 20,
            message: '属性标识限制为20个字符'
          },
          {
            type: 'string',
            message: '属性标识仅支持数字、字母或下划线“_”',
            pattern: pattern.nameReg
          },
        ],
      }
    }
  },
  computed: {
    hideDelBtn() {
      return this.emunList.length !== 1
    },
    hideAddBtn() {
      return this.emunList.length < 10
    }
  },
  created() {
    this.$watch('visible', (val) => {
      if (val) {
        this.model = {attributeType: '0',createOption: '0', ...this.options}
        this.emunList = this.options.innerData && this.$deepCopy(this.options.innerData) || [{range: '',rangeName: ''}]
      }
    });
  },
  methods: {
    addEmun() {
      this.emunList.push({range: '',rangeName: ''})
    },
    delEmun(index) {
      this.emunList.splice(index,1)
    },
    cancel() {
      this.$refs.form.resetFields()
      this.loading = false
      this.visible = false
    },
    confirm() {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.loading = true
          let enumMap = {}
          this.emunList.forEach(item => {
            enumMap = {...enumMap,...item}
          })
          const data = Object.assign({enumMap}, this.model)
          let func
          let message
          const {type} = this.options
          if (type === 'add') {
            func = this.$API.addModelAttr
            message = '添加成功'
          } else if(type === 'edit') {
            func = this.$API.editModelAttr
            message = '修改成功'
          }else if(type === 'first-add'){//新增模型时添加
            message = '添加成功'
            this.$message.success(message)
            this.$emit('callback', {type, ...this.model,id: this.uuid(),innerData: this.emunList})
            this.cancel()
            return
          }else if(type === 'first-edit'){//新增模型时编辑
            message = '修改成功'
            this.$message.success(message)
            this.$emit('callback', {type, ...this.model, innerData: this.emunList})
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