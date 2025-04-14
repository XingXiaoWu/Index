<template>
  <div class="flex flex-col">
    <h2 class="flex-self-start">
      代理工具
    </h2>
    <n-grid :cols="4" x-gap="8" y-gap="8">
      <n-gi v-for="(item, i) in proxyList" :key="i">
        <n-card :title="item.title" :class="i % 2 ? 'bg-light-200' : 'bg-light-800'"
          class="hover:bg-light-blue-300 cursor-pointer" @click="() => goToUrl(item.link)">
          {{ item.text }}
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>
<script lang="ts" setup>
// const host = window.location.origin

const proxyList = [
  {
    icon: '',
    title: 'free-proxy-list',
    link: 'https://github.com/proxifly/free-proxy-list',
    text: '免费代理'
  }
]

const goToUrl = (url: string) => {
  window.open(url)
}
</script>

<style scoped></style>