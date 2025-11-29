<template>
  <div class="flex flex-col">
    <h2 class="flex-self-start mb-4">
      阿星的文本处理工具
    </h2>
    <n-grid :cols="4" x-gap="8" y-gap="8">
      <n-gi v-for="(item, i) in toolList" :key="i">
        <n-card :title="item.title" :class="i % 2 ? 'bg-light-200' : 'bg-light-800'"
          class="hover:bg-light-blue-300 cursor-pointer" @click="() => goToUrl(item.link)">
          {{ item.text }}
        </n-card>
      </n-gi>
    </n-grid>
  </div>
</template>

<script lang="ts" setup>
const host = window.location.origin

const toolList = [
  {
    icon: '',
    title: '两端文本比较',
    link: host + '/#/text-compare',
    text: '比较两段文本的差异，高亮显示不同之处'
  },
  {
    icon: '',
    title: '大小写转换器',
    link: host + '/#/text-case',
    text: '转换文本的大小写格式'
  },
  {
    icon: '',
    title: '编码转换器',
    link: host + '/#/text-encode',
    text: 'Unicode、GBK、UTF-8编码互转'
  }
]

const goToUrl = (url: string) => {
  window.open(url, '_self')
}
</script>

<style scoped></style>