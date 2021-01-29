<template>
  <div class="attrInfo" :class="{'attrInfoComponsition': componsition}">
    <!-- 新增设备中使用 -->
    <template v-if="!overview">
      <Label v-for="item in list" :label="`${item.attributeName}(${item.attributeMark})` || `(${item.attributeMark})`" :key="item.id" class="mt10">
        <!-- 手动上报属性禁止编辑 -->
        <template v-if="item.createOption === 0">
          <!-- 文本 -->
          <p-input v-model="item.attributeText" @change="validate(item.id)" v-if="item.attributeType === 0"/>
          <!-- 日期 -->
          <p-date-picker class="w100" v-model="item.attributeText" v-if="item.attributeType === 1"/>
          <!-- 枚举 -->
          <p-select class="w100" v-model="item.attributeText" v-if="item.attributeType === 3" @focus='focusFun(item)'>
            <p-select-option v-for="list in item.listData" :value='list.enumValue' :key='list.enumValue'>{{list.enumValue}}</p-select-option>
          </p-select>
          <!--数值  -->
          <div class="flex w100" v-if="item.attributeType === 2">
            <p-input @change="validate(item.id)" v-model="item.attributeText" class="f1 mr6"/>
            <span>{{item.unit}}</span>
          </div>
          <p class="poros-form-explain" v-show="item.error === item.id">{{item.errorInfo}}</p>
        </template>
        <span v-else>{{item.attributeType === 1 ? $formatDate(item.attributeText) : item.attributeText}} <span v-if="item.attributeType === 2">{{item.unit}}</span></span>
      </Label>
    </template>
    <!-- 设备概览中使用（带编辑） -->
    <template v-else>
      <template v-if="list.length">
        <Label v-for="(item,index) in list" :label='`${item.attributeName}(${item.attributeMark})` || `(${item.attributeMark})`' :key="item.id" class="mt10">
          <!-- 手动上报属性禁止编辑 -->
          <template v-if="item.createOption === 0">
            <Edit
              v-model="item.attributeText"
              :ref="item.id"
              :time="item.attributeType === 1 && $formatDate"
              :fix="item.unit"
              normal
              :error='item.error === item.id'
              @submit="save(index)"
              @cancel='cancel'
            >
              <!-- 文本 -->
              <p-input v-model="item.attributeText" @change="validate(item.id)" v-if="item.attributeType === 0"/>
              <!-- 日期 -->
              <p-date-picker class="w100" v-model="item.attributeText" v-if="item.attributeType === 1"/>
              <!-- 枚举 -->
              <p-select class="w100" v-model="item.attributeText" @focus='focusFun(item)' v-if="item.attributeType === 3">
                <p-select-option v-for="list in item.listData" :value='list.enumValue' :key='list.enumValue'>{{list.enumValue}}</p-select-option>
              </p-select>
              <!-- 数值 -->
              <div class="flex w100" v-if="item.attributeType === 2">
                <p-input class="f1 mr6" @change="validate(item.id)" v-model="item.attributeText"/>
                <span>{{item.unit}}</span>
              </div>
            </Edit>
            <p class="poros-form-explain" v-show="item.error === item.id">{{item.errorInfo}}</p>
          </template>
          <span v-else>{{item.attributeType === 1 ? $formatDate(item.attributeText) : item.attributeText}} <span v-if="item.attributeType === 2">{{item.unit}}</span></span>
        </Label>
      </template>
      <Gt-no-data borderColor='transparent' emptyText='未找到与关键字相符的结果' v-if='!list.length && !loading' />
      <p-spin v-if="loading" />
    </template>
  </div>
</template>

<script>
import Schema from 'async-validator';
let copyData = []; //备份编辑数据 取消保存时恢复
export default {
  props: {
    overview: Boolean, //设备概览中使用
    componsition: Boolean, //组合设备
    modelId: String,
    deviceId: String,
    error: Boolean, //错误校验
  },
  data() {
    return {
      loading: false
    }
  },
  watch: {
    modelId(id) { //新增设备获取属性
      if (id) {
        const params = {modelId: id,createOption: 0,size: 10000000}
        this.$API.getModelAttrList(params).then( res => {
          this.list = res.data.records
          this.list.forEach( item => {
            this.$set(item, 'attributeText', '')
            if (item.attributeType === 3) {
              this.$set(item, 'listData',[])
            }
          })
          copyData = this.$deepCopy(this.list)
        })
      }
    },
    deviceId: {
      handler(id) { //设备详情 获取属性
        if (id) {
          this.loading = true
          this.$API.getDeviceAttrList({deviceId: id}).then( res => {
            this.list = res.data.records
            this.list.forEach( item => {
              if (item.attributeType === 3) {
                this.$set(item, 'listData',[])
              }
            })
            copyData = this.$deepCopy(this.list)
            this.loading = false
          }).catch( () => {
            this.loading = false
          })
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      list: [],
      ////校验
      model: {}
    }
  },
  computed: {
    comList() {
      return this.list.map( el => {
        const {attributeText,id} = el
        return {modelAttributeId: id,attributeText}
      })
    },
    filterList() {
      return this.list.filter( el => el.attributeType === 0 || el.attributeType === 2)
    },
    //数值和文本框校验
    comRules() {
      const ruleMap = {}
      this.list.forEach( el => {
        const {id,attributeType,attributeText} = el
        if (attributeType === 0 || attributeType === 2) {
          const rule = {
            0: [
                {pattern: this.reg.name2Reg,message:`输入字符仅支持中文、字母、数字和下划线“_”`},
                {type: 'string', max: 25,message:`输入字符长度限制为25个字符`},
              ],
            2: [
                {type: 'string',max: 9,message: '输入长度限制为9个字符'},
                {message: '输入字符仅支持数字（整数和小数）',pattern: this.reg.numReg},
              ]
          }
          ruleMap[id] = rule[attributeType]
          //将属性id作为属性值唯一的key
          this.model[id] = attributeText
        }
      })
      return ruleMap
    }
  },
  methods: {
    //保存属性
    save(index) {
      this.$API.editDeviceAttr(this.list[index]).then( res => {
        copyData = this.$deepCopy(this.list)
        this.$message.success('操作成功！')
      }).catch( () => {
        this.cancel()
      })
    },
    //获取枚举属性下拉项目
    focusFun({modelAttributeId}) {
      const params = {modelAttributeId,size: 10000000,pageNo: 1}
      this.$API.getModelAttrEmunList(params).then( res => {
        this.list.forEach( item => {
          if (item.attributeType === 3 && item.modelAttributeId === modelAttributeId) {
            this.$set(item, 'listData',res.data.records)
          }
          if (item.attributeType === 0 && item.attributeType === 2) {
            this.$set(item, 'error', '')
            this.$set(item, 'errorInfo', '')
          }
        })
      })
    },
    hide(key) {
      this.$refs[key] && this.$refs[key][0] && this.$refs[key][0].cancel()
    },
    cancel() {
      this.list = this.$deepCopy(copyData)
    },
    //校验错误信息
    setError(errors = []) {
      const errorIds = errors.map( el => el.field)
      this.filterList.forEach( el => {
        if (!errors.length) {
          this.$set(el, 'error', '')
          this.$set(el, 'errorInfo', '')
        }else{
          errors.forEach(item => {
            if (el.id === item.field) {
              this.$set(el, 'error', item.field)
              this.$set(el, 'errorInfo', item.message)
            }
            if (!errorIds.includes(el.id)) {
              this.$set(el, 'error', '')
              this.$set(el, 'errorInfo', '')
            }
          })
        }
      })
    },
    //校验
    validate(key) {
        const validator = new Schema(this.comRules);
        validator.validate(this.model, (errors, fields) => {
        if (errors) {
          console.log(errors)
          this.setError(errors)
          this.$emit('update:error', true)
          return handleErrors(errors, fields);
        }else{
          this.setError()
          this.$emit('update:error', false)
        }
      });
    },
  }
}
</script>

<style lang="less" scoped>
  .attrInfo{
    text-align: center;
    flex-wrap: no-wrap;
    padding-top: 12px;
    .w100{
      width: 100%;
    }
  }
  .attrInfoComponsition{
    padding-top: 0;
  }
  .poros-form-explain{
    color: #f5222d;
    margin-top: 6px;
    transition: all 0.3s;
  }
</style>