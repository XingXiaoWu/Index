<template>
  <div class="flex flex-col">
    <h2 class="flex-self-start mb-4">
      阿星的图片工具
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
    title: '图片和Base64互转',
    link: host + '/#/image-base64',
    text: '将图片转换为Base64编码或将Base64解码为图片'
  },
  {
    icon: '',
    title: '图片转ICO',
    link: host + '/#/image-to-ico',
    text: '将图片转换为ICO图标格式'
  },
  {
    icon: '',
    title: '图片和PDF互转',
    link: host + '/#/image-pdf',
    text: '图片转PDF或PDF转图片'
  },
  {
    icon: '',
    title: '图片尺寸调整',
    link: host + '/#/image-resize',
    text: '调整图片的宽度和高度'
  },
  {
    icon: '',
    title: '图片压缩',
    link: host + '/#/image-compress',
    text: '压缩图片文件大小，保持质量'
  }
]

const goToUrl = (url: string) => {
  window.open(url, '_self')
}
</script>

<style scoped></style>