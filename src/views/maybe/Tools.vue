<template>
    <div class="flex flex-col">
        <h2 class="flex-self-start">
            稀奇古怪的小工具
        </h2>
        <GridComponent :productList="maybeTools.proxy" />
    </div>
</template>
<script lang="ts" setup>
// const host = window.location.origin

import { maybeTools } from '../../const/index'
</script>

<style scoped></style>