<template>
  <div class="flex flex-col gap-4">
    <n-card title="图片和Base64互转">
      <div class="flex flex-col gap-4">
        <!-- Base64输入区 -->
        <div class="flex flex-col gap-2">
          <div class="flex justify-between items-center">
            <span class="font-bold">Base64编码：</span>
            <n-button @click="copyBase64" size="small" :disabled="!base64Text">复制</n-button>
          </div>
          <n-input
            v-model:value="base64Text"
            type="textarea"
            placeholder="请粘贴Base64编码，或点击下方图片上传..."
            :rows="8"
          />
        </div>
        
        <n-divider />
        
        <!-- 转换按钮区 -->
        <div class="flex gap-4 justify-center">
          <n-button 
            @click="base64ToImage" 
            type="primary"
            :disabled="!base64Text"
            size="large"
          >
            Base64 → 图片
          </n-button>
          
          <n-button 
            @click="imageToBase64" 
            type="primary"
            :disabled="!selectedImage"
            size="large"
          >
            图片 → Base64
          </n-button>
        </div>
        
        <n-divider />
        
        <!-- 图片展示区 -->
        <div class="flex flex-col gap-2">
          <div class="font-bold">图片预览：</div>
          
          <div 
            class="border-2 border-dashed border-gray-300 rounded-lg p-8 flex flex-col items-center justify-center min-h-300px cursor-pointer hover:border-blue-400 transition-colors"
            @click="triggerFileInput"
          >
            <div v-if="!imagePreview" class="text-center text-gray-400">
              <div class="text-4xl mb-2">📷</div>
              <div>点击此处选择图片</div>
              <div class="text-sm mt-2">支持 JPG、PNG、GIF 等格式</div>
            </div>
            
            <div v-else class="flex flex-col items-center gap-4 w-full">
              <img 
                :src="imagePreview" 
                class="max-w-full max-h-400px object-contain border rounded" 
                alt="预览图片"
              />
              <div class="text-sm text-gray-600">
                点击可重新选择图片
              </div>
            </div>
          </div>
          
          <input
            ref="fileInputRef"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleFileSelect"
          />
          
          <div v-if="imagePreview" class="flex gap-2 justify-center">
            <n-button @click="downloadImage" :disabled="!imagePreview">
              下载图片
            </n-button>
            <n-button @click="clearImage" type="error">
              清除图片
            </n-button>
          </div>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useMessage } from 'naive-ui'

const message = useMessage()

const base64Text = ref<string>('')
const imagePreview = ref<string>('')
const selectedImage = ref<File | null>(null)
const fileInputRef = ref<HTMLInputElement | null>(null)

// 触发文件选择
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  
  if (!file) return
  
  if (!file.type.startsWith('image/')) {
    message.error('请选择图片文件')
    return
  }
  
  selectedImage.value = file
  
  const reader = new FileReader()
  reader.onload = (e) => {
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
  
  // 重置input的值，以便可以选择同一个文件
  if (target) {
    target.value = ''
  }
}

// 图片转Base64
const imageToBase64 = () => {
  if (!selectedImage.value) {
    message.error('请先选择图片')
    return
  }
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    base64Text.value = result
    message.success('图片已转换为Base64')
  }
  reader.readAsDataURL(selectedImage.value)
}

// Base64转图片
const base64ToImage = () => {
  if (!base64Text.value.trim()) {
    message.error('请输入Base64编码')
    return
  }
  
  try {
    let base64 = base64Text.value.trim()
    
    // 如果不是data URL格式，尝试添加前缀
    if (!base64.startsWith('data:')) {
      // 检查是否只是纯Base64数据
      if (/^[A-Za-z0-9+/=]+$/.test(base64.replace(/\s/g, ''))) {
        base64 = `data:image/png;base64,${base64}`
      } else {
        message.error('Base64格式不正确')
        return
      }
    }
    
    // 验证Base64是否有效
    const img = new Image()
    img.onload = () => {
      imagePreview.value = base64
      selectedImage.value = null // 清除文件引用
      message.success('Base64已转换为图片')
    }
    img.onerror = () => {
      message.error('Base64解码失败，请检查编码是否正确')
    }
    img.src = base64
  } catch (error) {
    message.error('Base64解码失败，请检查编码是否正确')
  }
}

// 复制Base64
const copyBase64 = () => {
  if (!base64Text.value) {
    message.error('没有可复制的内容')
    return
  }
  navigator.clipboard.writeText(base64Text.value)
  message.success('Base64已复制到剪贴板')
}

// 下载图片
const downloadImage = () => {
  if (!imagePreview.value) {
    message.error('没有可下载的图片')
    return
  }
  
  const link = document.createElement('a')
  link.href = imagePreview.value
  link.download = `image_${Date.now()}.png`
  link.click()
  message.success('图片已下载')
}

// 清除图片
const clearImage = () => {
  imagePreview.value = ''
  selectedImage.value = null
  message.success('已清除图片')
}
</script>

<style scoped></style>