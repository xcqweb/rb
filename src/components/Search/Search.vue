<template>
  <div>
    <p-select v-model="selectType" @change="reset" v-if="isSelect" style="min-width:90px" :class="{noBoder: isSelect}">
      <p-select-option v-for="(item, index) in selectList" :value='item.key' :key='index'>{{item.name}}</p-select-option>
    </p-select>
    <p-range-picker v-if="extra" style="width: 160px;margin-right: 10px;" v-model="keyword"  @change="onSearch"/>
    <p-input-search v-if="!extra"  allow-clear v-model="keyword" :placeholder="`请输入${comLabel}`" style="width: 160px;margin-right: 10px;" @search="onSearch" />
    <p-button class="reset" @click="reset" icon="reload" />
  </div>
</template>

<script>
export default {
  name: 'Search',
  props: {
    value: [String, Number],
    selectList: {
      type: Array,
      default: function() {
        return []
      }
    }
  },
  data() {
    return {
      keyword: '',
      selectType: this.extra ? [] : '',
    }
  },
  computed: {
    isSelect() {
      return this.selectList.length
    },
    extra() {
      return this.selectType === 'time'
    },
    comLabel() {
      const temp = this.selectList.find(item => this.selectType === item.key)
      if (temp){
        return temp.name
      }
    }
  },
  watch: {
    value(val) {
      if (val) {
        this.keyword = val
      }
    },
    keyword(val) {
      this.$emit('input', this.keyword)
    }
  },
  mounted() {
    this.selectType = this.selectList[0] && this.selectList[0].key
  },
  methods: {
    reset() {
      this.$emit('reset')
      this.keyword = ''
      this.$emit('input', '')
    },
    onSearch() {
      this.$emit('search', {keyword: this.keyword, searchKey: this.selectType})
    }
  },
}
</script>

<style lang="less" scoped>
/deep/.poros-select{
  .poros-select-selection{
    background-color: @c-bg-2;
  }
}
/deep/.poros-select-focused{
  box-shadow: none;
  .poros-select-selection,.poros-select-selection:focus,.poros-select-selection:active{
    border-right: 1px solid #3c64e8 !important;
  }
}
/deep/.poros-select-open{
  .poros-select-selection,.poros-select-selection:focus,.poros-select-selection:active{
    border-right: 1px solid #3c64e8 !important;
  }
}
.reset{
  background-color: @c-bg-2;
  position: relative;
  top: -1px;
}
.noBoder{
  /deep/.poros-select-selection{
    border-right: none;
    border-radius: 2px 0 0 2px;
  }
}
</style>