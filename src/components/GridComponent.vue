<template>
    <n-grid :cols="4" x-gap="8" y-gap="8">
        <n-gi v-for="(item, i) in proxyList" :key="i">
            <n-card :title="item.title" :class="i % 2 ? 'bg-light-200' : 'bg-light-800'"
                class="hover:bg-light-blue-300 cursor-pointer" @click="() => goToUrl(item.link)">
                {{ item.text }}
            </n-card>
        </n-gi>
    </n-grid>
</template>

<script lang="ts" setup>

interface ProxyItem {
    icon: string
    title: string
    link: string
    text: string
}

interface Props {
    proxyList: ProxyItem[]
}

const { proxyList = [] } = defineProps<Props>()

const goToUrl = (url: string) => {
    window.open(url)
}
</script>