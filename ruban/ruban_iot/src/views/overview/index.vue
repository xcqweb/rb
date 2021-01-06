<template>
  <div class="allCenter flexColumn">
    <div class="allCenter_imgconent">
      <img src="@/assets/images/overview/overview.png" />
    </div>
    <p class="allCenter_font">欢迎来到{{system.name}}</p>
  </div>
</template>
<script>
export default {
  
}
</script>

<style lang="less" scoped>
  .allCenter{
    height: 100%;
    &_imgconent{
      width: 710px;
      height: 510px;
    }
    &_font{
      font-size: 18px;
      transform: translateY(-86px);
      letter-spacing: 1px;
      color: #29304B;
    }
  }
</style>