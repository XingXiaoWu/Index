<script setup lang="ts">
import { homeData } from '../const/index'
const productList = homeData

</script>

<template>

  <img src="../assets/imgs/ChatHead.jpeg" alt="头像" class="self-center h-[180px] self-center mt-50px">
  <div class="self-center mt-20px">这是阿星的首页，可能会用来放一些奇奇怪怪的东西</div>

  <GridComponent :proxyList="productList" />

</template>

<style scoped></style>
