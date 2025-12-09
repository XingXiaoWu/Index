<template>
    <div class="flex flex-col">
        <h2 class="flex-self-start">
            公益站
        </h2>
        <GridComponent :proxyList="aiDataPublicelfare" />
    </div>
</template>
<script lang="ts" setup>
import { aiDataPublicelfare } from '../../const/index'
</script>

<style scoped></style>