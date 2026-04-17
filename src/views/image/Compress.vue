<template>
  <div class="flex flex-col gap-4">
    <n-card title="图片压缩">
      <div class="flex flex-col gap-4">
        <n-upload
          :max="1"
          accept="image/*"
          :default-upload="false"
          @change="handleImageUpload"
        >
          <n-button>选择图片</n-button>
        </n-upload>
        
        <div v-if="imagePreview" class="flex flex-col gap-2">
          <div class="font-bold">原图预览：</div>
          <div class="text-sm text-gray-600">
            原始大小: {{ formatFileSize(originalSize) }} | 
            尺寸: {{ originalWidth }} x {{ originalHeight }}px
          </div>
          <img :src="imagePreview" class="max-w-400px max-h-400px border" />
        </div>
        
        <div v-if="imagePreview" class="flex flex-col gap-4">
          <n-divider />
          
          <div class="flex flex-col gap-2">
            <div class="font-bold">输出格式：</div>
            <n-radio-group v-model:value="outputFormat">
              <n-space>
                <n-radio value="jpeg">JPEG (体积小)</n-radio>
                <n-radio value="png">PNG (保留透明)</n-radio>
                <n-radio value="webp">WebP (最优压缩)</n-radio>
              </n-space>
            </n-radio-group>
          </div>
          
          <div class="flex flex-col gap-2">
            <div class="flex justify-between">
              <span class="font-bold">压缩质量: {{ quality }}%</span>
              <span class="text-sm text-gray-600">质量越低，文件越小</span>
            </div>
            <n-slider
              v-model:value="quality"
              :min="1"
              :max="100"
              :step="1"
              :marks="{ 25: '25%', 50: '50%', 75: '75%', 100: '100%' }"
            />
          </div>
          
          <div class="flex gap-2">
            <n-button @click="quality = 90">高质量 (90%)</n-button>
            <n-button @click="quality = 75">中等 (75%)</n-button>
            <n-button @click="quality = 50">低质量 (50%)</n-button>
          </div>
          
          <n-button 
            @click="compressImage" 
            type="primary"
            :loading="isProcessing"
          >
            压缩图片
          </n-button>
          
          <div v-if="compressedImage" class="flex flex-col gap-2">
            <n-divider />
            <div class="font-bold">压缩后预览：</div>
            <div class="text-sm text-gray-600">
              压缩后大小: {{ formatFileSize(compressedSize) }} | 
              压缩率: {{ compressionRatio }}%
            </div>
            <n-alert 
              v-if="compressionRatio > 0" 
              type="success"
              :title="`成功减小 ${compressionRatio}%`"
            >
              从 {{ formatFileSize(originalSize) }} 压缩到 {{ formatFileSize(compressedSize) }}
            </n-alert>
            <n-alert 
              v-else-if="compressionRatio < 0" 
              type="warning"
              title="压缩后文件变大了"
            >
              建议使用原图或降低质量参数
            </n-alert>
            <img :src="compressedImage" class="max-w-400px max-h-400px border" />
            <n-button @click="downloadImage">下载压缩图片</n-button>
          </div>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useMessage } from 'naive-ui'
import type { UploadFileInfo } from 'naive-ui'

const message = useMessage()

const imagePreview = ref<string>('')
const originalWidth = ref<number>(0)
const originalHeight = ref<number>(0)
const originalSize = ref<number>(0)
const quality = ref<number>(80)
const outputFormat = ref<string>('jpeg')
const isProcessing = ref<boolean>(false)
const compressedImage = ref<string>('')
const compressedSize = ref<number>(0)
const originalImage = ref<HTMLImageElement | null>(null)

const compressionRatio = computed(() => {
  if (!originalSize.value || !compressedSize.value) return 0
  return Math.round(((originalSize.value - compressedSize.value) / originalSize.value) * 100)
})

const handleImageUpload = (options: { file: UploadFileInfo }) => {
  const file = options.file.file
  if (!file) return
  
  originalSize.value = file.size
  
  const reader = new FileReader()
  reader.onload = (e) => {
    const img = new Image()
    img.onload = () => {
      originalWidth.value = img.width
      originalHeight.value = img.height
      originalImage.value = img
    }
    img.src = e.target?.result as string
    imagePreview.value = e.target?.result as string
  }
  reader.readAsDataURL(file)
  
  // 重置结果
  compressedImage.value = ''
  compressedSize.value = 0
}

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

const compressImage = () => {
  if (!originalImage.value) {
    message.error('请先选择图片')
    return
  }
  
  isProcessing.value = true
  
  try {
    const canvas = document.createElement('canvas')
    canvas.width = originalImage.value.width
    canvas.height = originalImage.value.height
    
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      message.error('浏览器不支持Canvas')
      return
    }
    
    // 如果是JPEG格式，先填充白色背景（避免透明PNG转JPEG时变黑）
    if (outputFormat.value === 'jpeg') {
      ctx.fillStyle = '#FFFFFF'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
    
    ctx.drawImage(originalImage.value, 0, 0)
    
    // 根据选择的格式转换
    const mimeType = `image/${outputFormat.value}`
    const compressedDataUrl = canvas.toDataURL(mimeType, quality.value / 100)
    compressedImage.value = compressedDataUrl
    
    // 计算压缩后的大小（Base64转字节）
    const base64str = compressedDataUrl.split(',')[1]
    const binary = atob(base64str)
    compressedSize.value = binary.length
    
    message.success('压缩完成')
  } catch (error) {
    message.error('压缩失败')
    console.error(error)
  } finally {
    isProcessing.value = false
  }
}

const downloadImage = () => {
  if (!compressedImage.value) return
  
  const extensions: Record<string, string> = {
    'jpeg': 'jpg',
    'png': 'png',
    'webp': 'webp'
  }
  
  const link = document.createElement('a')
  link.href = compressedImage.value
  link.download = `compressed_${Date.now()}.${extensions[outputFormat.value]}`
  link.click()
  message.success('已下载')
}
</script>

<style scoped></style>