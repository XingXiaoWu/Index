<template>
  <div class="flex flex-col gap-4">
    <n-card title="大小写转换器">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <div class="font-bold">输入文本：</div>
          <n-input
            v-model:value="inputText"
            type="textarea"
            placeholder="请输入要转换的文本..."
            :rows="10"
          />
        </div>
        
        <n-divider />
        
        <div class="grid grid-cols-2 gap-4">
          <n-button @click="toUpperCase" type="primary">
            <template #icon>
              <span>ABC</span>
            </template>
            转换为大写
          </n-button>
          
          <n-button @click="toLowerCase" type="primary">
            <template #icon>
              <span>abc</span>
            </template>
            转换为小写
          </n-button>
          
          <n-button @click="toTitleCase">
            <template #icon>
              <span>Abc</span>
            </template>
            首字母大写
          </n-button>
          
          <n-button @click="toSentenceCase">
            <template #icon>
              <span>Abc</span>
            </template>
            句首大写
          </n-button>
          
          <n-button @click="toCamelCase">
            <template #icon>
              <span>aBC</span>
            </template>
            驼峰命名
          </n-button>
          
          <n-button @click="toPascalCase">
            <template #icon>
              <span>AbC</span>
            </template>
            帕斯卡命名
          </n-button>
          
          <n-button @click="toSnakeCase">
            <template #icon>
              <span>a_b_c</span>
            </template>
            蛇形命名
          </n-button>
          
          <n-button @click="toKebabCase">
            <template #icon>
              <span>a-b-c</span>
            </template>
            短横线命名
          </n-button>
          
          <n-button @click="toggleCase">
            <template #icon>
              <span>AbC</span>
            </template>
            大小写反转
          </n-button>
          
          <n-button @click="copyResult">
            <template #icon>
              <span>📋</span>
            </template>
            复制结果
          </n-button>
          
          <n-button @click="clearAll" type="error">
            清空
          </n-button>
        </div>
        
        <div v-if="outputText" class="flex flex-col gap-2">
          <n-divider />
          <div class="font-bold">转换结果：</div>
          <n-input
            v-model:value="outputText"
            type="textarea"
            :rows="10"
            readonly
          />
        </div>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'

const message = useMessage()

const inputText = ref<string>('')
const outputText = ref<string>('')

const toUpperCase = () => {
  if (!inputText.value) {
    message.error('请输入文本')
    return
  }
  outputText.value = inputText.value.toUpperCase()
  message.success('转换完成')
}

const toLowerCase = () => {
  if (!inputText.value) {
    message.error('请输入文本')
    return
  }
  outputText.value = inputText.value.toLowerCase()
  message.success('转换完成')
}

const toTitleCase = () => {
  if (!inputText.value) {
    message.error('请输入文本')
    return
  }
  outputText.value = inputText.value.replace(/\b\w/g, (char) => char.toUpperCase())
  message.success('转换完成')
}

const toSentenceCase = () => {
  if (!inputText.value) {
    message.error('请输入文本')
    return
  }
  outputText.value = inputText.value
    .toLowerCase()
    .replace(/(^\s*\w|[.!?]\s*\w)/g, (char) => char.toUpperCase())
  message.success('转换完成')
}

const toCamelCase = () => {
  if (!inputText.value) {
    message.error('请输入文本')
    return
  }
  outputText.value = inputText.value
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^[A-Z]/, (char) => char.toLowerCase())
  message.success('转换完成')
}

const toPascalCase = () => {
  if (!inputText.value) {
    message.error('请输入文本')
    return
  }
  outputText.value = inputText.value
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase())
    .replace(/^[a-z]/, (char) => char.toUpperCase())
  message.success('转换完成')
}

const toSnakeCase = () => {
  if (!inputText.value) {
    message.error('请输入文本')
    return
  }
  outputText.value = inputText.value
    .replace(/([A-Z])/g, '_$1')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
  message.success('转换完成')
}

const toKebabCase = () => {
  if (!inputText.value) {
    message.error('请输入文本')
    return
  }
  outputText.value = inputText.value
    .replace(/([A-Z])/g, '-$1')
    .replace(/[^a-zA-Z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase()
  message.success('转换完成')
}

const toggleCase = () => {
  if (!inputText.value) {
    message.error('请输入文本')
    return
  }
  outputText.value = inputText.value
    .split('')
    .map((char) => {
      if (char === char.toUpperCase()) {
        return char.toLowerCase()
      } else {
        return char.toUpperCase()
      }
    })
    .join('')
  message.success('转换完成')
}

const copyResult = () => {
  if (!outputText.value) {
    message.error('没有可复制的内容')
    return
  }
  navigator.clipboard.writeText(outputText.value)
  message.success('已复制到剪贴板')
}

const clearAll = () => {
  inputText.value = ''
  outputText.value = ''
  message.success('已清空')
}
</script>

<style scoped></style>