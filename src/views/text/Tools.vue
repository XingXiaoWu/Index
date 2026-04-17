<script lang="ts" setup>
const toolList = [
  {
    title: '两端文本比较',
    link: '/text-compare',
    text: '快速比对两段文本的差异，适合做内容核对和结果检查。',
    badge: 'Diff',
  },
  {
    title: '大小写转换器',
    link: '/text-case',
    text: '统一大小写格式，处理命名转换时会更顺手。',
    badge: 'Case',
  },
  {
    title: '编码转换器',
    link: '/text-encode',
    text: '做 Unicode、GBK、UTF-8 等文本编码转换。',
    badge: 'Encode',
  },
]
</script>

<template>
  <div class="tool-hub">
    <section class="tool-hub__hero">
      <p class="tool-hub__eyebrow">Text</p>
      <h1>阿星的文本工具</h1>
    </section>

    <GridComponent :productList="toolList" :minWidth="250" />
  </div>
</template>

<style scoped>
.tool-hub {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding-bottom: 18px;
}

.tool-hub__hero {
  display: flex;
  min-height: 180px;
  flex-direction: column;
  justify-content: flex-end;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(15, 23, 34, 0.12);
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(242, 245, 248, 0.96)),
    linear-gradient(135deg, rgba(100, 132, 45, 0.15), transparent 46%);
  padding: clamp(20px, 4vw, 28px);
  box-shadow: 12px 12px 0 rgba(15, 23, 34, 0.08);
}

.tool-hub__hero::after {
  position: absolute;
  top: 0;
  right: 0;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, rgba(100, 132, 45, 0.16), transparent 70%);
  clip-path: polygon(100% 0, 0 0, 100% 100%);
  content: '';
}

.tool-hub__eyebrow {
  color: #64842d;
  font-family: 'Fira Code', monospace;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

.tool-hub__hero h1 {
  margin-top: 8px;
  color: #0f1722;
  font-size: clamp(1.8rem, 3.6vw, 2.8rem);
  line-height: 1.06;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}
</style>
