<template>
    <div class="flex flex-col">
        <h2 class="flex-self-start">
            Docker工具
        </h2>
        <GridComponent :proxyList="develop.dockerOrigin" />
    </div>
</template>
<script lang="ts" setup>
import { develop } from '../../const/index'
</script>

<style scoped></style>