<template>
    <div class="flex flex-col">
        <h2 class="flex-self-start">
            自己做的小工具
        </h2>
        <GridComponent :productList="myselfTools.proxy" />
    </div>
</template>
<script lang="ts" setup>
// const host = window.location.origin

import { myselfTools } from '../../const/index'
</script>

<style scoped></style>