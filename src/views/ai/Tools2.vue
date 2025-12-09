<template>
    <div class="flex flex-col">
        <h2 class="flex-self-start">
            公益站
        </h2>
        <GridComponent class="mt-2" :productList="AITools.publicelfare" />

        <h2 class="flex-self-start mt-2">
            补充站
        </h2>
        <GridComponent class="mt-2" :productList="AITools.supplement" />
    </div>
</template>
<script lang="ts" setup>
import { AITools } from '../../const/index'
</script>

<style scoped></style>