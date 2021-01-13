<template>
  <div class="attrInfo" :class="{'attrInfoComponsition': componsition}">
    <!-- 新增设备中使用 -->
    <template v-if="!overview">
      <Label v-for="item in list" :label='item.attributeName' :key="item.id" class="mt10">
        <p-input v-model="item.attributeText" v-if="item.attributeType === 0"/>
        <p-date-picker class="w100" v-model="item.attributeText" v-if="item.attributeType === 1"/>
        <p-select class="w100" v-model="item.attributeText" v-if="item.attributeType === 3" @focus='focusFun(item)'>
          <p-select-option v-for="list in item.listData" :value='list.enumKey' :key='list.enumKey'>{{list.enumValue}}</p-select-option>
        </p-select>
        <div class="flex w100" v-if="item.attributeType === 2">
          <p-input-number v-model="item.attributeText" class="f1 mr6"/>
          <span>年</span>
        </div>
      </Label>
    </template>
    <!-- 设备概览中使用（带编辑） -->
    <template v-else>
      <Label v-for="item in list" :label='item.attributeName' :key="item.id" class="mt10">
        <Edit v-model="item.attributeText" normal v-if="item.attributeType === 0">
          <p-input v-model="item.attributeText"/>
        </Edit>
        <Edit v-model="item.attributeText" normal :time="$formatDate" v-if="item.attributeType === 1">
          <p-date-picker class="w100" v-model="item.attributeText"/>
        </Edit>
        <Edit v-model="item.attributeText" normal v-if="item.attributeType === 3">
          <p-select class="w100" v-model="item.attributeText" @focus='focusFun(item)'>
            <p-select-option v-for="list in item.listData" :value='list.enumKey' :key='list.enumKey'>{{list.enumValue}}</p-select-option>
          </p-select>
        </Edit>
        <Edit v-model="item.attributeText" normal v-if="item.attributeType === 2">
          <div class="flex w100">
            <p-input-number v-model="item.attributeText" class="f1 mr6"/>
            <span>年</span>
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
      handler(id) { //设备详情
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
    focusFun({id}) {
      const params = {
        modelAttributeId: id,
        size: 10000000
      }
      this.$API.getModelAttrEmunList(params).then( res => {
        this.list.forEach( item => {
          if (item.attributeType === 3 && item.id === id) {
            this.$set(item, 'listData',res.data.records)
          }
        })
      })
    }
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