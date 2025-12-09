<template>
    <div class="flex flex-col">
        <h2 class="flex-self-start">
            代理工具
        </h2>
        <GridComponent :productList="hackTools.proxy" />
    </div>
</template>
<script lang="ts" setup>
// const host = window.location.origin

import { hackTools } from '../../const/index'
</script>

<style scoped></style>