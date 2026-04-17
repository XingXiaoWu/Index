<template>
  <div class="flex flex-col gap-4">
    <n-card title="编码转换器">
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-2">
          <div class="font-bold">输入文本：</div>
          <n-input
            v-model:value="inputText"
            type="textarea"
            placeholder="请输入要转换的文本..."
            :rows="8"
          />
        </div>
        
        <n-divider />
        
        <div class="flex flex-col gap-4">
          <div class="font-bold text-lg">编码转换</div>
          
          <div class="grid grid-cols-3 gap-4">
            <n-button @click="toUnicode" type="primary">
              转换为 Unicode
            </n-button>
            
            <n-button @click="fromUnicode">
              Unicode 解码
            </n-button>
            
            <n-button @click="toUtf8">
              转换为 UTF-8 (Hex)
            </n-button>
            
            <n-button @click="fromUtf8">
              UTF-8 (Hex) 解码
            </n-button>
            
            <n-button @click="toBase64Encode">
              转换为 Base64
            </n-button>
            
            <n-button @click="fromBase64Encode">
              Base64 解码
            </n-button>
            
            <n-button @click="toUrlEncode">
              URL 编码
            </n-button>
            
            <n-button @click="fromUrlEncode">
              URL 解码
            </n-button>
            
            <n-button @click="toHtmlEncode">
              HTML 实体编码
            </n-button>
            
            <n-button @click="fromHtmlEncode">
              HTML 实体解码
            </n-button>
          </div>
          
          <n-divider />
          
          <div class="font-bold text-lg">字符信息</div>
          
          <div class="grid grid-cols-2 gap-4">
            <n-button @click="showCharCodes">
              查看字符编码
            </n-button>
            
            <n-button @click="copyResult">
              复制结果
            </n-button>
          </div>
        </div>
        
        <div v-if="outputText" class="flex flex-col gap-2">
          <n-divider />
          <div class="flex justify-between items-center">
            <span class="font-bold">转换结果：</span>
            <n-tag v-if="resultType" type="info">{{ resultType }}</n-tag>
          </div>
          <n-input
            v-model:value="outputText"
            type="textarea"
            :rows="8"
            readonly
          />
        </div>
        
        <div v-if="charInfo.length > 0" class="flex flex-col gap-2">
          <n-divider />
          <div class="font-bold">字符详细信息：</div>
          <n-data-table
            :columns="columns"
            :data="charInfo"
            :pagination="{ pageSize: 10 }"
            :max-height="400"
          />
        </div>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'
import type { DataTableColumns } from 'naive-ui'

const message = useMessage()

const inputText = ref<string>('')
const outputText = ref<string>('')
const resultType = ref<string>('')
const charInfo = ref<Array<any>>([])

interface CharInfoType {
  index: number
  char: string
  unicode: string
  decimal: number
  hex: string
  utf8: string
}

const columns: DataTableColumns<CharInfoType> = [
  { title: '索引', key: 'index', width: 60 },
  { title: '字符', key: 'char', width: 80 },
  { title: 'Unicode', key: 'unicode', width: 120 },
  { title: '十进制', key: 'decimal', width: 100 },
  { title: '十六进制', key: 'hex', width: 100 },
  { title: 'UTF-8', key: 'utf8' }
]

const toUnicode = () => {
  if (!inputText.value) {
    message.error('请输入文本')
    return
  }
  outputText.value = inputText.value
    .split('')
    .map(char => `\\u${char.charCodeAt(0).toString(16).padStart(4, '0')}`)
    .join('')
  resultType.value = 'Unicode 编码'
  message.success('转换完成')
}

const fromUnicode = () => {
  if (!inputText.value) {
    message.error('请输入文本')
    return
  }
  try {
    outputText.value = inputText.value.replace(/\\u[\dA-Fa-f]{4}/g, (match) => {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16))
    })
    resultType.value = 'Unicode 解码'
    message.success('转换完成')
  } catch (error) {
    message.error('解码失败，请检查输入格式')
  }
}

const toUtf8 = () => {
  if (!inputText.value) {
    message.error('请输入文本')
    return
  }
  const encoder = new TextEncoder()
  const utf8Bytes = encoder.encode(inputText.value)
  outputText.value = Array.from(utf8Bytes)
    .map(byte => byte.toString(16).padStart(2, '0'))
    .join(' ')
  resultType.value = 'UTF-8 (Hex)'
  message.success('转换完成')
}

const fromUtf8 = () => {
  if (!inputText.value) {
    message.error('请输入文本')
    return
  }
  try {
    const hexString = inputText.value.replace(/[^0-9A-Fa-f]/g, '')
    const bytes = new Uint8Array(
      hexString.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
    )
    const decoder = new TextDecoder('utf-8')
    outputText.value = decoder.decode(bytes)
    resultType.value = 'UTF-8 解码'
    message.success('转换完成')
  } catch (error) {
    message.error('解码失败，请检查输入格式')
  }
}

const toBase64Encode = () => {
  if (!inputText.value) {
    message.error('请输入文本')
    return
  }
  try {
    outputText.value = btoa(unescape(encodeURIComponent(inputText.value)))
    resultType.value = 'Base64 编码'
    message.success('转换完成')
  } catch (error) {
    message.error('编码失败')
  }
}

const fromBase64Encode = () => {
  if (!inputText.value) {
    message.error('请输入文本')
    return
  }
  try {
    outputText.value = decodeURIComponent(escape(atob(inputText.value)))
    resultType.value = 'Base64 解码'
    message.success('转换完成')
  } catch (error) {
    message.error('解码失败，请检查输入格式')
  }
}

const toUrlEncode = () => {
  if (!inputText.value) {
    message.error('请输入文本')
    return
  }
  outputText.value = encodeURIComponent(inputText.value)
  resultType.value = 'URL 编码'
  message.success('转换完成')
}

const fromUrlEncode = () => {
  if (!inputText.value) {
    message.error('请输入文本')
    return
  }
  try {
    outputText.value = decodeURIComponent(inputText.value)
    resultType.value = 'URL 解码'
    message.success('转换完成')
  } catch (error) {
    message.error('解码失败，请检查输入格式')
  }
}

const toHtmlEncode = () => {
  if (!inputText.value) {
    message.error('请输入文本')
    return
  }
  const htmlEntities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;'
  }
  outputText.value = inputText.value.replace(/[&<>"'\/]/g, s => htmlEntities[s])
  resultType.value = 'HTML 实体编码'
  message.success('转换完成')
}

const fromHtmlEncode = () => {
  if (!inputText.value) {
    message.error('请输入文本')
    return
  }
  const htmlEntities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&#x2F;': '/'
  }
  outputText.value = inputText.value.replace(/&[#\w]+;/g, s => htmlEntities[s] || s)
  resultType.value = 'HTML 实体解码'
  message.success('转换完成')
}

const showCharCodes = () => {
  if (!inputText.value) {
    message.error('请输入文本')
    return
  }
  
  charInfo.value = inputText.value.split('').map((char, index) => {
    const code = char.charCodeAt(0)
    const encoder = new TextEncoder()
    const utf8Bytes = encoder.encode(char)
    
    return {
      index: index + 1,
      char: char === '\n' ? '\\n' : char === '\t' ? '\\t' : char,
      unicode: `\\u${code.toString(16).padStart(4, '0')}`,
      decimal: code,
      hex: `0x${code.toString(16).toUpperCase()}`,
      utf8: Array.from(utf8Bytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join(' ')
    }
  })
  
  resultType.value = ''
  outputText.value = ''
  message.success('字符信息已生成')
}

const copyResult = () => {
  if (!outputText.value) {
    message.error('没有可复制的内容')
    return
  }
  navigator.clipboard.writeText(outputText.value)
  message.success('已复制到剪贴板')
}
</script>

<style scoped></style>