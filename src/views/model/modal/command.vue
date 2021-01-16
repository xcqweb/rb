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
        <p-input v-model="model.commandMark" :disabled='moreEdit' placeholder="请输入指令标识" />
      </p-form-model-item>
      <p-form-model-item label="指令名称" prop="commandName">
        <p-input v-model.trim="model.commandName" placeholder="请输入指令名称" />
      </p-form-model-item>
      <p-form-model-item label="指令模板" prop="commandTemplateId">
        <p-select v-model="model.commandTemplateId" labelInValue @change="getCommandAttrList">
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
          <li class="flex" v-for="(item, index) in paramsValidateForm.varList">
            <p-form-model-item
            :prop="'varList.' + index + '.commandVarMark'"
            :rules="[
              {
                message: '请输入变量标识',
                trigger: 'blur',
                required: true,
              },
              {
                message: '变量标识仅支持字母、数字或下划线“_”',
                pattern: pattern.nameReg
              },
              {
                type: 'string',
                max: 20,
                message: '变量标识长度限制为20个字符'
              },
            ]"
            >
              <p-input v-model="item.commandVarMark" :disabled='item.extendType === 1' placeholder="请输入变量标识" />
            </p-form-model-item>
            <p-form-model-item
            class="mr6"
            :prop="'varList.' + index + '.commandVarValue'"
            :rules="[
              {
                type: 'string',
                max: 25,
                message: '默认值长度限制为25个字符'
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
                message: '注释长度限制为50个字符'
              },
            ]"
            >
              <p-input v-model="item.remark" :disabled='item.extendType === 1' :placeholder="item.extendType !== 1 && '请输入注释'" />
            </p-form-model-item>
            <p-icon class="ml6 icon" type='delete' :style="{fontSize: '16px',cursor: 'pointer', visibility: item.extendType !== 1 ? 'visible' : 'hidden'}" @click="delVar(index)" />
          </li>
        </ul>
        <span class="viewDetail" :class="{noList: !paramsValidateForm.varList.length}">
          <span @click="addVar"><p-icon type="plus"/>添加变量</span>
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
          {required: true,message: '请输入指令名称'},
          {type: 'string',max: 25,message: '指令名称长度限制为25个字符'},
          {type: 'string',message: '指令名称仅支持中文、字母、数字或下划线“_”',pattern: pattern.name2Reg},
        ],
        commandMark: [
          {required: true,message: '请输入指令标识'},
          {max: 20, message: '指令标识长度限制为20个字符'},
          {type: 'string',message: '指令标识仅支持数字、字母或下划线“_”',pattern: pattern.nameReg},
        ],
        remark: {max: 50, message: '描述长度限制为50个字符'}
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
    this.getCommandTemplate()
    this.$watch('visible', (val) => {
      if (val) {
        this.model = {...this.options}
        this.paramsValidateForm.varList.push(...(this.options.innerData && this.$deepCopy(this.options.innerData) || [{commandVarMark: '',commandVarValue: '',remark: ''}]))
        const {id,commandTemplateId} = this.options
        this.model.commandTemplateId = {key:this.model.commandTemplateId}
        if (this.moreEdit && !this.options.innerData.length) {
          this.$API.getModelCommandVarList({modelCommandId: id}).then( res => {
            this.paramsValidateForm.varList.push(...res.data.records.map( item => {
              return {
                ...item,
                modelCommandId: id
              }
            }))
          })
        }
      }
    });
  },
  methods: {
    getCommandTemplate() {
      this.$API.getModelCommandTemplateSelect().then( res => {
        const reData = res.data
        const key = reData[0] && reData[0].id
        const label = reData[0] && reData[0].commandName
        this.model.commandTemplateId = {key}
        this.getCommandAttrList({key,label})
        this.commandTemplateList.push(...reData)
      })
    },
    getCommandAttrList({key,label}) {
      if (!key) {
        return
      }
      this.model.commandTemplateName = label
      this.$refs.paramsValidateForm && this.$refs.paramsValidateForm.resetFields()
      this.$API.getModelCommandAttrList({id: key}).then( res => {
        this.paramsValidateForm.varList = [this.moreEdit ? {modelCommandId: this.options.id} : {}]
        this.paramsValidateForm.varList.unshift(...res.data.map( item => {
          return {...item, extendType: 1,/*0 自定义变量 1 模板继承变量*/modelCommandId: this.options.id}
        }))
      })
    },
    addVar() {
      this.paramsValidateForm.varList.push(this.moreEdit ? {modelCommandId: this.options.id} : {})
    },
    delVar(index) {
      this.paramsValidateForm.varList.splice(index, 1)
      if (!this.paramsValidateForm.varList.length) {
        this.paramsValidateForm.varList = [this.moreEdit ? {modelCommandId: this.options.id} : {}]
      }
      this.$refs.paramsValidateForm.validate()
    },
    cancel() {
      this.loading = false
      this.visible = false
      this.$refs.form.resetFields()
      this.$refs.paramsValidateForm.resetFields()
      this.paramsValidateForm.varList = []
    },
    confirm() {
      this.$refs.form.validate(valid => {
        this.$refs.paramsValidateForm.validate( valid2 => {
          if (valid && valid2) {
            this.loading = true
            const modelCommandVarAddParamList = this.$deepCopy(this.paramsValidateForm.varList)
            this.model.commandTemplateId = this.model.commandTemplateId.key
            const data = Object.assign({modelCommandVarAddParamList}, this.model)
            delete data.type
            let func
            let message = '提交成功！'
            const {type} = this.options
            if (type === 'add') {
              func = this.$API.addModelCommand
            } else if(type === 'edit') {
              func = this.$API.editModelCommand
            }else if(type === 'first-add'){//新增模型时添加
              this.$message.success(message)
              this.$emit('callback', {type, ...data,id: this.uuid(),innerData: modelCommandVarAddParamList})
              this.cancel()
              return
            }else if(type === 'first-edit'){//新增模型时编辑
              this.$message.success(message)
              this.$emit('callback', {type, ...data, innerData: modelCommandVarAddParamList})
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