<script setup lang="ts">
import { useOsTheme, darkTheme, dateZhCN } from 'naive-ui'
import { computed } from 'vue';
const osThemeRef = useOsTheme()
const theme = computed(() => (osThemeRef.value === 'dark' ? darkTheme : null))
</script>

<template>
  <n-config-provider :theme="theme" :date-locale="dateZhCN" class="flex flex-col h-full">
    <n-message-provider>
      <n-layout has-sider>
        <n-layout>
          <n-layout-content content-style="padding: 24px;">
            <router-view> </router-view>
          </n-layout-content>
        </n-layout>
      </n-layout>
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
  width: 100vw;
  height: 100vh;
}
</style>
