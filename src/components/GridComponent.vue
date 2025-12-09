<template>
    <n-grid :cols="4" x-gap="8" y-gap="8" class="grid-container">
        <n-gi v-for="(item, i) in productList" :key="i">
            <n-card :title="item.title" :class="i % 2 ? 'bg-light-200' : 'bg-light-800'"
                class="hover:bg-light-blue-300 cursor-pointer card-item" @click="() => goToUrl(item.link)">
                {{ item.text }}
            </n-card>
        </n-gi>
    </n-grid>
</template>

<script lang="ts" setup>

interface ProductItem {
    icon: string
    title: string
    link: string
    text: string
}

interface Props {
    productList: ProductItem[]
}

const { productList = [] } = defineProps<Props>()

const goToUrl = (url: string) => {
    window.open(url)
}
</script>

<style scoped>
.grid-container {
    align-items: stretch;
}

.card-item {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.card-item :deep(.n-card__content) {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
</style>