<template>
  <div class="attrInfo" :class="{'attrInfoComponsition': componsition}">
    <template v-if="!overview">
      <Label v-for="item in list" :label='item.label' :key="item.type" class="mt10">
        <p-input v-model="item.value" v-if="item.type === 1"/>
        <p-date-picker class="w100" v-model="item.value" v-if="item.type === 2"/>
        <p-select class="w100" v-model="item.value" v-if="item.type === 3">
          <p-select-option value='1'>启用</p-select-option>
        </p-select>
        <div class="flex w100" v-if="item.type === 4">
          <p-input-number v-model="item.value" class="f1 mr6"/>
          <span>年</span>
        </div>
      </Label>
    </template>
    <!-- 设备概览中使用 -->
    <template v-else>
      <Label v-for="item in list" :label='item.label' :key="item.type" class="mt10">
        <Edit v-model="item.value" normal v-if="item.type === 1">
          <p-input v-model="item.value"/>
        </Edit>
        <Edit v-model="item.value" normal :time="$formatDate" v-if="item.type === 2">
          <p-date-picker class="w100" v-model="item.value"/>
        </Edit>
        <Edit v-model="item.value" normal v-if="item.type === 3">
          <p-select class="w100" v-model="item.value">
            <p-select-option value='1'>启用</p-select-option>
          </p-select>
        </Edit>
        <Edit v-model="item.value" normal v-if="item.type === 4">
          <div class="flex w100">
            <p-input-number v-model="item.value" class="f1 mr6"/>
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
  },
  data() {
    return {
      list: [
        {label: '设备型号',value: '',type: 1},
        {label: '出厂日期',value: '',type: 2},
        {label: '资产状态',value: '',type: 3},
        {label: '使用年限',value: '',type: 4},
      ]
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