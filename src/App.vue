<script setup lang="ts">
import { ref } from 'vue';

const productList = [{
  icon:'',
  title:'123',
  text:'123456798'
},{
  icon:'',
  title:'123',
  text:'123456798'
},{
  icon:'',
  title:'123',
  text:'123456798'
},{
  icon:'',
  title:'123',
  text:'123456798'
}]

</script>

<template>
  <!--  -->
  <img src="./assets/imgs/ChatHead.jpeg" alt="头像" class="self-center h-[180px] self-center mt-50px">
  <div class="self-center mt-20px">这是阿星的首页，可能会用来放一些产品</div>

  <n-grid
    :cols="4"
    x-gap="8"
    y-gap="8"
  >
    <n-gi
      v-for="(item,i) in productList"
      :key="i"
      :class="i % 2 ? 'bg-green-400' : 'bg-green-800'"
    >
    <n-card :title="item.title">
    {{item.text}}
  </n-card>
    </n-gi>
  </n-grid>
</template>

<style scoped>
  
</style>
