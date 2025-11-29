<template>
  <div class="flex flex-col gap-4">
    <n-card title="两端文本比较">
      <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center">
          <div class="flex gap-2 items-center">
            <n-button @click="compareTexts" type="primary">比较差异</n-button>
            <n-button @click="clearTexts">清空</n-button>
          </div>
          
          <div class="flex gap-4 items-center">
            <n-checkbox v-model:checked="ignoreCase">忽略大小写</n-checkbox>
            <n-checkbox v-model:checked="ignoreWhitespace">忽略空格</n-checkbox>
            <n-radio-group v-model:value="layoutMode">
              <n-radio-button value="vertical">纵向对比</n-radio-button>
              <n-radio-button value="horizontal">横向对比</n-radio-button>
            </n-radio-group>
          </div>
        </div>
        
        <div v-if="hasCompared" class="grid grid-cols-3 gap-4">
          <n-statistic label="相同字符数" :value="sameChars" />
          <n-statistic label="不同字符数" :value="diffChars" />
          <n-statistic label="相似度" :value="similarity + '%'" />
        </div>
        
        <n-divider />
        
        <div :class="layoutMode === 'vertical' ? 'grid grid-cols-2 gap-4' : 'flex flex-col gap-4'">
          <div class="flex flex-col gap-2">
            <div class="font-bold">文本 A：</div>
            <div class="flex border rounded bg-white" style="height: 400px;">
              <!-- 行号区域 -->
              <div
                ref="lineNumbersA"
                class="flex-shrink-0 bg-gray-100 border-r text-right text-gray-500 font-mono text-sm select-none overflow-hidden"
                style="width: 50px; height: 400px; padding: 8px 8px 8px 4px; line-height: 1.5;"
              >
                <div v-for="n in lineCountA" :key="n" style="height: 21px;">{{ n }}</div>
              </div>
              <!-- 文本编辑区域 -->
              <div
                ref="textAContainer"
                class="flex-1 overflow-auto"
                style="padding: 8px;"
                @scroll="handleScrollA"
              >
                <div
                  ref="textAContent"
                  contenteditable="true"
                  class="outline-none min-h-full whitespace-pre-wrap font-mono text-sm"
                  style="line-height: 1.5;"
                  @input="handleTextAInput"
                  @paste="handlePaste"
                  v-html="displayTextA"
                ></div>
              </div>
            </div>
          </div>
          
          <div class="flex flex-col gap-2">
            <div class="font-bold">文本 B：</div>
            <div class="flex border rounded bg-white" style="height: 400px;">
              <!-- 行号区域 -->
              <div
                ref="lineNumbersB"
                class="flex-shrink-0 bg-gray-100 border-r text-right text-gray-500 font-mono text-sm select-none overflow-hidden"
                style="width: 50px; height: 400px; padding: 8px 8px 8px 4px; line-height: 1.5;"
              >
                <div v-for="n in lineCountB" :key="n" style="height: 21px;">{{ n }}</div>
              </div>
              <!-- 文本编辑区域 -->
              <div
                ref="textBContainer"
                class="flex-1 overflow-auto"
                style="padding: 8px;"
                @scroll="handleScrollB"
              >
                <div
                  ref="textBContent"
                  contenteditable="true"
                  class="outline-none min-h-full whitespace-pre-wrap font-mono text-sm"
                  style="line-height: 1.5;"
                  @input="handleTextBInput"
                  @paste="handlePaste"
                  v-html="displayTextB"
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <n-alert type="info" v-if="hasCompared">
          <span class="bg-red-200 px-1">红色</span> 表示不同的字符
        </n-alert>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, nextTick } from 'vue'
import { useMessage } from 'naive-ui'

const message = useMessage()

const textA = ref<string>('')
const textB = ref<string>('')
const ignoreCase = ref<boolean>(false)
const ignoreWhitespace = ref<boolean>(false)
const layoutMode = ref<'vertical' | 'horizontal'>('vertical')
const hasCompared = ref<boolean>(false)
const highlightedA = ref<string>('')
const highlightedB = ref<string>('')
const sameChars = ref<number>(0)
const diffChars = ref<number>(0)
const similarity = ref<number>(0)
const lineCountA = ref<number>(1)
const lineCountB = ref<number>(1)

const textAContainer = ref<HTMLElement | null>(null)
const textBContainer = ref<HTMLElement | null>(null)
const textAContent = ref<HTMLElement | null>(null)
const textBContent = ref<HTMLElement | null>(null)
const lineNumbersA = ref<HTMLElement | null>(null)
const lineNumbersB = ref<HTMLElement | null>(null)

// 计算属性：显示的文本内容
const displayTextA = computed(() => {
  if (hasCompared.value && highlightedA.value) {
    return highlightedA.value
  }
  return escapeHtml(textA.value) || '<span style="color: #999;">请输入第一段文本...</span>'
})

const displayTextB = computed(() => {
  if (hasCompared.value && highlightedB.value) {
    return highlightedB.value
  }
  return escapeHtml(textB.value) || '<span style="color: #999;">请输入第二段文本...</span>'
})

let isScrollingA = false
let isScrollingB = false

// 处理滚动联动
const handleScrollA = () => {
  if (isScrollingB || !textAContainer.value || !textBContainer.value) return
  isScrollingA = true
  textBContainer.value.scrollTop = textAContainer.value.scrollTop
  textBContainer.value.scrollLeft = textAContainer.value.scrollLeft
  
  // 同步行号滚动
  if (lineNumbersA.value) {
    lineNumbersA.value.scrollTop = textAContainer.value.scrollTop
  }
  if (lineNumbersB.value) {
    lineNumbersB.value.scrollTop = textBContainer.value.scrollTop
  }
  
  setTimeout(() => { isScrollingA = false }, 50)
}

const handleScrollB = () => {
  if (isScrollingA || !textAContainer.value || !textBContainer.value) return
  isScrollingB = true
  textAContainer.value.scrollTop = textBContainer.value.scrollTop
  textAContainer.value.scrollLeft = textBContainer.value.scrollLeft
  
  // 同步行号滚动
  if (lineNumbersA.value) {
    lineNumbersA.value.scrollTop = textAContainer.value.scrollTop
  }
  if (lineNumbersB.value) {
    lineNumbersB.value.scrollTop = textBContainer.value.scrollTop
  }
  
  setTimeout(() => { isScrollingB = false }, 50)
}

// 处理文本输入
const handleTextAInput = (e: Event) => {
  const target = e.target as HTMLElement
  textA.value = target.innerText || ''
  // 更新行数
  lineCountA.value = Math.max(1, (textA.value.match(/\n/g) || []).length + 1)
  // 修改文本后清除比较状态
  if (hasCompared.value) {
    hasCompared.value = false
    highlightedA.value = ''
    highlightedB.value = ''
  }
}

const handleTextBInput = (e: Event) => {
  const target = e.target as HTMLElement
  textB.value = target.innerText || ''
  // 更新行数
  lineCountB.value = Math.max(1, (textB.value.match(/\n/g) || []).length + 1)
  // 修改文本后清除比较状态
  if (hasCompared.value) {
    hasCompared.value = false
    highlightedA.value = ''
    highlightedB.value = ''
  }
}

// 处理粘贴事件，只保留纯文本
const handlePaste = (e: ClipboardEvent) => {
  e.preventDefault()
  const text = e.clipboardData?.getData('text/plain')
  if (text) {
    document.execCommand('insertText', false, text)
  }
}

const clearTexts = () => {
  textA.value = ''
  textB.value = ''
  hasCompared.value = false
  highlightedA.value = ''
  highlightedB.value = ''
  sameChars.value = 0
  diffChars.value = 0
  similarity.value = 0
  lineCountA.value = 1
  lineCountB.value = 1
  
  if (textAContent.value) textAContent.value.innerText = ''
  if (textBContent.value) textBContent.value.innerText = ''
}

const processText = (text: string): string => {
  let processed = text
  if (ignoreCase.value) {
    processed = processed.toLowerCase()
  }
  if (ignoreWhitespace.value) {
    processed = processed.replace(/\s+/g, '')
  }
  return processed
}

const compareTexts = async () => {
  if (!textA.value && !textB.value) {
    message.error('请输入要比较的文本')
    return
  }
  
  const processedA = processText(textA.value)
  const processedB = processText(textB.value)
  
  // 使用最长公共子序列算法进行比较
  const result = lcs(processedA, processedB)
  
  // 保存光标位置
  const selectionA = saveSelection(textAContent.value)
  const selectionB = saveSelection(textBContent.value)
  
  highlightedA.value = highlightDifferences(textA.value, processedA, result.aIndices)
  highlightedB.value = highlightDifferences(textB.value, processedB, result.bIndices)
  
  sameChars.value = result.commonLength
  diffChars.value = Math.max(processedA.length, processedB.length) - result.commonLength
  
  const total = sameChars.value + diffChars.value
  similarity.value = total === 0 ? 0 : Math.round((sameChars.value / total) * 100)
  
  hasCompared.value = true
  
  // 恢复光标位置
  await nextTick()
  restoreSelection(textAContent.value, selectionA)
  restoreSelection(textBContent.value, selectionB)
  
  message.success('比较完成')
}

// 保存光标位置
const saveSelection = (element: HTMLElement | null) => {
  if (!element) return null
  const selection = window.getSelection()
  if (!selection || selection.rangeCount === 0) return null
  
  const range = selection.getRangeAt(0)
  return {
    start: range.startOffset,
    end: range.endOffset
  }
}

// 恢复光标位置
const restoreSelection = (element: HTMLElement | null, selection: any) => {
  if (!element || !selection) return
  
  const range = document.createRange()
  const sel = window.getSelection()
  
  try {
    const textNode = element.firstChild
    if (textNode) {
      range.setStart(textNode, Math.min(selection.start, textNode.textContent?.length || 0))
      range.setEnd(textNode, Math.min(selection.end, textNode.textContent?.length || 0))
      sel?.removeAllRanges()
      sel?.addRange(range)
    }
  } catch (e) {
    // 忽略错误
  }
}

// 最长公共子序列算法
const lcs = (a: string, b: string) => {
  const m = a.length
  const n = b.length
  const dp: number[][] = Array(m + 1).fill(0).map(() => Array(n + 1).fill(0))
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1])
      }
    }
  }
  
  // 回溯找出相同的字符位置
  const aIndices = new Set<number>()
  const bIndices = new Set<number>()
  let i = m, j = n
  
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      aIndices.add(i - 1)
      bIndices.add(j - 1)
      i--
      j--
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--
    } else {
      j--
    }
  }
  
  return {
    commonLength: dp[m][n],
    aIndices,
    bIndices
  }
}

const highlightDifferences = (
  original: string,
  processed: string,
  commonIndices: Set<number>
): string => {
  let result = ''
  let processedIndex = 0
  
  for (let i = 0; i < original.length; i++) {
    const char = original[i]
    
    // 如果忽略空格且当前是空格，跳过处理索引的增加
    if (ignoreWhitespace.value && /\s/.test(char)) {
      result += escapeHtml(char)
      continue
    }
    
    const isCommon = commonIndices.has(processedIndex)
    
    if (char === '\n') {
      result += '\n'
    } else if (!isCommon) {
      result += `<span style="background-color: #fecaca; color: #991b1b;">${escapeHtml(char)}</span>`
    } else {
      result += escapeHtml(char)
    }
    
    processedIndex++
  }
  
  return result
}

const escapeHtml = (text: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
    ' ': '&nbsp;'
  }
  return text.replace(/[&<>"' ]/g, m => map[m])
}

// 监听布局模式变化
watch(layoutMode, () => {
  message.info(`已切换为${layoutMode.value === 'vertical' ? '纵向' : '横向'}对比模式`)
})
</script>

<style scoped>
[contenteditable]:empty:before {
  content: attr(placeholder);
  color: #999;
}
</style>