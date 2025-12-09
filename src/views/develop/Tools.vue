<template>
    <div class="flex flex-col">
        <h2 class="flex-self-start">
            Docker工具
        </h2>
        <h3 class="flex-self-start mt-2">你知道的，很多东西下载很困难</h3>
        <GridComponent class="mt-2" :proxyList="develop.dockerOrigin" />
    </div>
</template>
<script lang="ts" setup>
import { develop } from '../../const/index'
</script>

<style scoped></style>