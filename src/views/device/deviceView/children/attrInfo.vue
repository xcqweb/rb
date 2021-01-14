<template>
  <div class="attrInfo" :class="{'attrInfoComponsition': componsition}">
    <!-- 新增设备中使用 -->
    <template v-if="!overview">
      <Label v-for="item in list" :label='item.attributeName' :key="item.id" class="mt10">
        <p-input v-model="item.attributeText" v-if="item.attributeType === 0"/>
        <p-date-picker class="w100" v-model="item.attributeText" v-if="item.attributeType === 1"/>
        <p-select class="w100" v-model="item.attributeText" v-if="item.attributeType === 3" @focus='focusFun(item)'>
          <p-select-option v-for="list in item.listData" :value='list.enumValue' :key='list.enumValue'>{{list.enumValue}}</p-select-option>
        </p-select>
        <div class="flex w100" v-if="item.attributeType === 2">
          <p-input-number v-model="item.attributeText" class="f1 mr6"/>
          <span>{{item.unit || '-'}}</span>
        </div>
      </Label>
    </template>
    <!-- 设备概览中使用（带编辑） -->
    <template v-else>
      <Label v-for="(item,index) in list" :label='item.attributeName' :key="item.id" class="mt10">
        <Edit :ref="item.id" v-model="item.attributeText" normal v-if="item.attributeType === 0" @submit="save(index)">
          <p-input v-model="item.attributeText" @blur="hide(item.id)"/>
        </Edit>
        <Edit :ref="item.id" v-model="item.attributeText" normal :time="$formatDate" v-if="item.attributeType === 1" @submit="save(index)">
          <p-date-picker class="w100" v-model="item.attributeText"/>
        </Edit>
        <Edit :ref="item.id" v-model="item.attributeText" normal v-if="item.attributeType === 3" @submit="save(index)">
          <p-select class="w100" v-model="item.attributeText" @focus='focusFun(item)'>
            <p-select-option v-for="list in item.listData" :value='list.enumValue' :key='list.enumValue'>{{list.enumValue}}</p-select-option>
          </p-select>
        </Edit>
        <Edit :ref="item.id" v-model="item.attributeText" normal v-if="item.attributeType === 2" @submit="save(index)">
          <div class="flex w100">
            <p-input-number class="f1 mr6" v-model="item.attributeText" @blur="hide(item.id)"/>
            <span>{{item.unit || '-'}}</span>
          </div>
        </Edit>
      </Label>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    overview: Boolean, //设备概览中使用
    componsition: Boolean, //组合设备
    modelId: String,
    deviceId: String
  },
  watch: {
    modelId(id) { //新增设备
      if (id) {
        const params = {
          modelId: id,
          createOption: 0,
          size: 10000000
        }
        this.$API.getModelAttrList(params).then( res => {
          this.list = res.data.records
          this.list.forEach( item => {
            this.$set(item, 'attributeText', '')
            if (item.attributeType === 3) {
              this.$set(item, 'listData',[])
            }
          })
        })
      }
    },
    deviceId: {
      handler(id) { //设备详情 获取属性
        if (id) {
          this.$API.getDeviceAttrList({deviceId: id}).then( res => {
            this.list = res.data.records
            this.list.forEach( item => {
              if (item.attributeType === 3) {
                this.$set(item, 'listData',[])
              }
            })
          })
        }
      },
      immediate: true
    }
  },
  data() {
    return {
      list: []
    }
  },
  computed: {
    comList() {
      return this.list.map( el => {
        const {attributeText,id} = el
        return {
          modelAttributeId: id,
          attributeText
        }
      })
    }
  },
  methods: {
    //保存属性
    save(index) {
      this.$API.editDeviceAttr(this.list[index]).then( res => {
        this.$message.success('操作成功！')
      })
    },
    focusFun({modelAttributeId}) {
      const params = {
        modelAttributeId,
        size: 10000000,
        pageNo: 1,
      }
      this.$API.getModelAttrEmunList(params).then( res => {
        this.list.forEach( item => {
          if (item.attributeType === 3 && item.modelAttributeId === modelAttributeId) {
            this.$set(item, 'listData',res.data.records)
          }
        })
      })
    },
    hide(key) {
      this.$refs[key] && this.$refs[key][0] && this.$refs[key][0].cancel()
    },
  }
}
</script>

<style lang="less" scoped>
  .attrInfo{
    flex-wrap: no-wrap;
    padding-top: 20px;
    .w100{
      width: 100%;
    }
  }
  .attrInfoComponsition{
    padding-top: 0;
  }
</style>