<template>
    <div class="flex flex-col">
        <h2 class="flex-self-start">
            公益站
        </h2>
        <GridComponent :productList="AITools.publicelfare" />
    </div>
</template>
<script lang="ts" setup>
import { AITools } from '../../const/index'
</script>

<style scoped></style>