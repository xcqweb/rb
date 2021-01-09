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
        <p-input v-model="model.attributeMark" placeholder="请输入属性标识" :disabled='isEdit' />
      </p-form-model-item>
      <p-form-model-item label="属性名称" prop="attributeName">
        <p-input v-model.trim="model.attributeName" placeholder="请输入属性名称" />
      </p-form-model-item>
      <p-form-model-item label="属性类型" prop="attributeType">
        <p-select v-model="model.attributeType" :disabled='isEdit'>
            <p-select-option v-for="item in attrType" :key="item.value" :value="item.value">{{item.text}}</p-select-option>
          </p-select>
      </p-form-model-item>
      <p-form-model-item v-show="isEmun">
        <span slot="label" class="required-doc">枚举范围</span>
        <p-form-model
            ref="paramsValidateForm"
            :model="paramsValidateForm"
          >
          <div class="flex" v-for="(item, index) in paramsValidateForm.emunList" v-if="isEmun">
            <p-form-model-item
            :prop="'emunList.' + index + '.enumKey'"
            :rules="[
              {
                message: '请输入枚举值',
                trigger: 'blur',
                required: true,
              },
              {
                message: '枚举值仅支持中文、字母、数字（整数和小数）或下划线“_”',
                pattern: pattern.name4Reg
              },
              {
                type: 'string',
                max: 25,
                message: '枚举值长度限制为25个字符'
              },
            ]"
            >
              <p-input class="mr6 w160" v-model.trim="item.enumKey" :disabled='moreEdit && item.id' placeholder="请输入枚举值" />
            </p-form-model-item>
            <p-form-model-item
            class="ml6"
            :prop="'emunList.' + index + '.enumValue'"
            :rules="[
              {
                message: '请输入显示名称',
                trigger: 'blur',
                required: true,
              },
              {
                message: '显示名称仅支持中文、字母、数字或下划线“_”',
                pattern: pattern.name2Reg
              },
              {
                type: 'string',
                max: 25,
                message: '显示名称长度限制为25个字符'
              },
            ]"
            >
              <p-input class="w160" v-model.trim="item.enumValue" :disabled='item.id && moreEdit' placeholder="请输入显示名称" />
            </p-form-model-item>
            <p-icon class="ml6 mr6 f14 icon" type="delete" @click="delEmun(index)" v-show="!(moreEdit && item.id)" />
          </div>
          <span class="viewDetail" :class="{noList: !paramsValidateForm.emunList.length}">
            <span @click="addEmun" v-show="hideAddBtn"><p-icon type="plus"/>新增枚举</span>
            <span class="c-text mt6 ml10">(最多添加10个枚举项)</span>
          </span>
        </p-form-model>
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
import {validateRepeat} from '@/utils/util'
export default {
  mixins: [modalMixins],
  data() {
    return {
      pattern,
      getType,
      attrType,
      paramsValidateForm: {
        emunList: [{enumKey: '',enumValue: ''}],
      },
      model: {},
      rules: {
        attributeName: [
          {
            type: 'string',
            max: 25,
            message: '属性名称长度限制为25个字符'
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
            message: '属性标识长度限制为20个字符'
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
    hideAddBtn() {
      return this.paramsValidateForm.emunList.length < 10
    },
    isEmun() {
      return this.model.attributeType === 3
    },
    isEdit() {
      const {type} = this.options
      return type === 'edit' || type === 'first-edit'
    },
    moreEdit() {
      const {type} = this.options
      return type === 'edit'
    }
  },
  created() {
    this.$watch('visible', (val) => {
      if (val) {
        this.model = {attributeType: 0,createOption: 0, ...this.options}
        this.paramsValidateForm.emunList = this.options.innerData && this.$deepCopy(this.options.innerData) || [{enumKey: '',enumValue: ''}]
        if (this.moreEdit && this.options.innerData && !this.options.innerData.length) {
          this.$API.getModelAttrEmunList({modelAttributeId:this.options.id}).then( res => {
            this.paramsValidateForm.emunList = res.data.records
          })
        }
      }
    });
  },
  methods: {
    addEmun() {
      this.paramsValidateForm.emunList.push({enumKey: '',enumValue: ''})
    },
    delEmun(index) {
      this.paramsValidateForm.emunList.splice(index,1)
    },
    cancel() {
      this.loading = false
      this.visible = false
      this.$refs.form.resetFields()
      this.$refs.paramsValidateForm.resetFields()
    },
    valid() {
      return (validateRepeat({
        list: this.paramsValidateForm.emunList,
        ref: this.$refs.paramsValidateForm.$el,
        tip: '枚举值重复!',
        key: 'enumKey',
        that: this,
        fix: 1,
      }) || validateRepeat({
        list: this.paramsValidateForm.emunList,
        ref: this.$refs.paramsValidateForm.$el,
        tip: '显示名称重复!',
        key: 'enumValue',
        that: this,
      }));
    },
    confirm() {
      this.$refs.form.validate(valid => {
        this.$refs.paramsValidateForm.validate( valid2 => {
          if (valid && valid2) {
            if (this.valid()) {
              return
            }
            this.loading = true
            const emunList = this.$deepCopy(this.paramsValidateForm.emunList)
            const enumMap = {}
            for(let item of emunList) {
              enumMap[item.enumKey] = item.enumValue
            }
            const data = Object.assign(this.isEmun ? {enumMap} : {}, this.model)
            delete data.type
            let func
            let message = '提交成功！'
            const {type} = this.options
            if (type === 'add') {
              func = this.$API.addModelAttr
            } else if(type === 'edit') {
              func = this.$API.editModelAttr
            }else if(type === 'first-add'){//新增模型时添加
              this.$message.success(message)
              this.$emit('callback', {type, ...this.model,id: this.uuid(),innerData: emunList,enumMap})
              this.cancel()
              return
            }else if(type === 'first-edit'){//新增模型时编辑
              this.$message.success(message)
              this.$emit('callback', {type, ...this.model, innerData: emunList,enumMap})
              this.cancel()
              return
            }
            func(data).then(res => {
              this.cancel()
              this.$message.success(message)
              this.$emit('callback',{type})
            }).catch(() => {
              this.loading = false
            })
          }
        })
      })
    },
  }
}
</script>

<style lang="less" scoped>
.flex{
  align-items: inherit;
  .icon{
    line-height: 32px;
  }
}
.noList{
  position: relative;
  top: 6px;
}
</style>