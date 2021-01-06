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
      <p-form-model-item label="指令标识" prop="commandMark">
        <p-input v-model="model.commandMark" placeholder="请输入指令标识" />
      </p-form-model-item>
      <p-form-model-item label="指令名称" prop="commandName">
        <p-input v-model.trim="model.commandName" placeholder="请输入指令名称" />
      </p-form-model-item>
      <p-form-model-item label="指令模板" prop="commandTemplateId">
        <p-select v-model="model.commandTemplateId" @change="getCommandAttrList">
            <p-select-option v-for="item in commandTemplateList" :value='item.id' :key='item.id'>{{item.commandName}}</p-select-option>
          </p-select>
      </p-form-model-item>
      <p-form-model-item label="描述" prop="remark">
        <p-input v-model.trim="model.remark" placeholder="请输入描述内容" />
      </p-form-model-item>
      <p-form-model-item>
        <span slot="label" class="required-doc">指令变量</span>
        <p-form-model
            ref="paramsValidateForm"
            :model="paramsValidateForm"
          >
        <ul>
          <li class="flex" v-for="(item, index) in paramsValidateForm.varList" :class="{mt10: index !== 0}">
            <p-form-model-item
            :prop="'varList.' + index + '.commandVarMark'"
            :rules="[
              {
                message: '请输入变量标识',
                trigger: 'blur',
                required: true,
              },
              {
                message: '变量标识仅支持中文、字母、数字（整数）或下划线“_”',
                pattern: pattern.name2Reg
              },
              {
                type: 'string',
                max: 20,
                message: '变量标识限制为20个字符'
              },
            ]"
            >
              <p-input v-model="item.commandVarMark" :disabled='item.isDefault' placeholder="请输入变量标识" />
            </p-form-model-item>
            <p-form-model-item
            class="mr6"
            :prop="'varList.' + index + '.commandVarValue'"
            :rules="[
              {
                type: 'string',
                max: 25,
                message: '默认值限制为25个字符'
              },
            ]"
            >
              <p-input v-model="item.commandVarValue" class="mr6 ml6" placeholder="请输入默认值" />
            </p-form-model-item>
            <p-form-model-item
            class="ml6"
            :prop="'varList.' + index + '.remark'"
            :rules="[
              {
                type: 'string',
                max: 50,
                message: '注释限制为50个字符'
              },
            ]"
            >
              <p-input v-model="item.remark" :disabled='item.isDefault' :placeholder="!item.isDefault && '请输入注释'" />
            </p-form-model-item>
            <p-icon class="ml6 icon" type='delete' :style="{fontSize: '16px',cursor: 'pointer', visibility: (hideDelBtn && !item.isDefault) ? 'visible' : 'hidden'}" @click="delVar(index)" />
          </li>
        </ul>
        <span class="viewDetail">
          <span @click="addVar"><p-icon type="plus"/>新增变量</span>
        </span>
        </p-form-model>
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
      pattern,
      paramsValidateForm: {
        varList: []
      },
      commandTemplateList: [],
      model: {},
      rules: {
        commandName: [
          {
            required: true,
            message: '请输入指令名称'
          },
          {
            type: 'string',
            max: 25,
            message: '指令名称限制为25个字符'
          },
          {
            type: 'string',
            message: '指令名称仅支持中文、字母、数字或下划线“_”',
            pattern: pattern.name2Reg
          },
        ],
        commandMark: [
          {
            required: true,
            message: '请输入指令标识'
          },
          {
            max: 20,
            message: '指令标识限制为20个字符'
          },
          {
            type: 'string',
            message: '指令标识仅支持数字、字母或下划线“_”',
            pattern: pattern.nameReg
          },
        ],
      }
    }
  },
  computed: {
    hideDelBtn() {
      return this.paramsValidateForm.varList.length !== 1
    },
  },
  created() {
    this.getCommandTemplate()
    this.$watch('visible', (val) => {
      if (val) {
        this.model = {...this.options}
        this.paramsValidateForm.varList = this.options.innerData && this.$deepCopy(this.options.innerData) || [{}]
      }
    });
  },
  methods: {
    getCommandTemplate() {
      this.$API.getModelCommandTemplateSelect().then( res => {
        this.commandTemplateList = res.data
      })
    },
    getCommandAttrList(id) {
      this.$API.getModelCommandAttrList({id}).then( res => {
        this.paramsValidateForm.varList = res.data.map( item => {
          return {...item, isDefault: true}
        })
      })
    },
    addVar() {
      this.paramsValidateForm.varList.push({})
    },
    delVar(index) {
      this.paramsValidateForm.varList.splice(index, 1)
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
          const data = Object.assign({}, this.model)
          let func
          let message
          const {type} = this.options
          if (type === 'add') {
            func = this.$API.addModelCommand
            message = '添加成功'
          } else if(type === 'edit') {
            func = this.$API.editModelCommand
            message = '修改成功'
          }else if(type === 'first-add'){//新增模型时添加
            message = '添加成功'
            this.$message.success(message)
            this.$emit('callback', {type, ...this.model,id: this.uuid(),innerData: this.paramsValidateForm.varList})
            this.cancel()
            return
          }else if(type === 'first-edit'){//新增模型时编辑
            message = '修改成功'
            this.$message.success(message)
            this.$emit('callback', {type, ...this.model, innerData: this.paramsValidateForm.varList})
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
.flex{
  align-items: inherit;
  .icon{
    line-height: 32px;
  }
}
</style>