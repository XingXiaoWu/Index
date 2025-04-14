<template>
  <div class="pdf-converter">

    <n-upload :default-upload="false" directory-dnd action="" @change="handleFileChange">
      <n-upload-dragger>
        <div style="margin-bottom: 12px">
          <n-icon size="48" :depth="3">
            <ArchiveIcon />
          </n-icon>
        </div>
        <n-text style="font-size: 16px">
          点击或者拖动文件到该区域来上传
        </n-text>
        <n-p depth="3" style="margin: 8px 0 0 0">
          请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
        </n-p>
      </n-upload-dragger>
    </n-upload>

    <n-button :disabled="!pdfFile" :loading="isConverting" type="primary" @click="convertAndDownload"
      style="margin-left: 16px">
      <template #icon>
        <n-icon><download-icon /></n-icon>
      </template>
      转换并下载
    </n-button>
  </div>
</template>
<script lang="ts" setup>
// const host = window.location.origin
import { ArchiveOutline as ArchiveIcon, Download as DownloadIcon } from '@vicons/ionicons5'
import { onMounted, ref } from 'vue'
import { NButton, NUpload, NIcon, useMessage, type UploadOnChange } from 'naive-ui'
import * as pdfjsLib from 'pdfjs-dist'
import JSZip from 'jszip'

onMounted(() => {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '../../node_modules/pdfjs-dist/build/pdf.worker.min.mjs';
})

const message = useMessage()
const pdfFile = ref<File | null>(null)
const isConverting = ref<boolean>(false)

const handleFileChange: UploadOnChange = (options) => {
  // 判断是不是删除
  if (options.file.status === 'removed') {
    isConverting.value = false
    pdfFile.value = null
    return
  }
  if (options.file.type !== 'application/pdf') {
    message.error('请上传PDF文件！')
    return
  }
  pdfFile.value = options.file.file
}

const convertAndDownload = async () => {
  try {
    // 开始转换
    isConverting.value = true
    const zip = new JSZip()

    if (!pdfFile.value) return

    // 加载 PDF 文件
    const arrayBuffer = await pdfFile.value.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise

    // 获取总页数
    const totalPages = pdf.numPages

    // 遍历每一页进行转换
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: 2.0 }) // 设置清晰度

      // 创建 canvas
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width

      // 将 PDF 页面渲染到 canvas
      await page.render({
        canvasContext: context!,
        viewport: viewport
      }).promise

      // 将 canvas 转换为 PNG
      const imageData = canvas.toDataURL('image/png')
      const base64Data = imageData.replace(/^data:image\/png;base64,/, '')

      // 添加到 zip
      zip.file(`page-${pageNum}.png`, base64Data, { base64: true })
    }

    // 生成并下载 zip 文件
    const content = await zip.generateAsync({ type: 'blob' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(content)
    link.download = 'pdf-images.zip'
    link.click()
    URL.revokeObjectURL(link.href)

    message.success('转换完成！')
  } catch (error) {
    message.error('转换过程中出现错误：' + (error as Error).message)
  } finally {
    isConverting.value = false
  }
}
</script>

<style scoped></style>