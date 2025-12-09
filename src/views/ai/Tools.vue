<template>
    <div class="flex flex-col">
        <h2 class="flex-self-start mt-2">
            资料库
        </h2>
        <GridComponent class="mt-2" :productList="AITools.publicData" />
    </div>
</template>
<script lang="ts" setup>
import { AITools } from '../../const/index'
</script>

<style scoped></style>