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
      <p-form-model-item label="指令变量">
        <ul>
          <li class="flex" v-for="(item, index) in varList" :class="{mt10: index !== 0}">
            <p-input v-model="item.commandVarMark" placeholder="请输入变量标识" />
            <p-input v-model="item.commandVarValue" class="mr6 ml6" placeholder="请输入默认值" />
            <p-input v-model="item.remark" placeholder="请输入注释" />
            <p-icon class="ml6" type='delete' :style="{fontSize: '16px',cursor: 'pointer'}" @click="delVar(index)" v-show="hideDelBtn" />
          </li>
        </ul>
        <span class="viewDetail">
          <span @click="addVar"><p-icon type="plus"/>新增变量</span>
        </span>
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
      commandTemplateList: [],
      varList: [],
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
      return this.varList.length !== 1
    },
  },
  created() {
    this.getCommandTemplate()
    this.$watch('visible', (val) => {
      if (val) {
        this.model = {...this.options}
        this.varList = this.options.innerData && this.$deepCopy(this.options.innerData) || [{}]
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
        this.varList = res.data
      })
    },
    addVar() {
      this.varList.push({})
    },
    delVar(index) {
      this.varList.splice(index, 1)
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
            this.$emit('callback', {type, ...this.model,id: this.uuid(),innerData: this.varList})
            this.cancel()
            return
          }else if(type === 'first-edit'){//新增模型时编辑
            message = '修改成功'
            this.$message.success(message)
            this.$emit('callback', {type, ...this.model, innerData: this.varList})
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