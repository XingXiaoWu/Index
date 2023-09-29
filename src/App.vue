<script setup lang="ts">
import { useOsTheme, darkTheme, dateZhCN } from 'naive-ui'
import { computed } from 'vue';
const osThemeRef = useOsTheme()
const theme = computed(() => (osThemeRef.value === 'dark' ? darkTheme : null))
</script>

<template>
  <n-config-provider :theme="theme" :date-locale="dateZhCN" class="flex flex-col">
    <n-message-provider>
      <router-view> </router-view>
    </n-message-provider>
  </n-config-provider>
</template>

<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
