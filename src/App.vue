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

<script setup lang="ts">
import { useOsTheme, darkTheme, lightTheme, dateZhCN } from 'naive-ui'
import { computed } from 'vue';
const osThemeRef = useOsTheme()
const theme = computed(() => (osThemeRef.value === 'dark' ? darkTheme : lightTheme))
</script>
