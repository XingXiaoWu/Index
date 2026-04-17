<script lang="ts" setup>
const toolList = [
  {
    title: '图片和 Base64 互转',
    link: '/image-base64',
    text: '将图片转换为 Base64 编码，或把 Base64 直接还原成图片。',
    badge: 'Convert',
  },
  {
    title: '图片压缩',
    link: '/image-compress',
    text: '压缩图片体积，尽量在质量和大小之间拿到更平衡的结果。',
    badge: 'Optimize',
  },
]
</script>

<template>
  <div class="tool-hub">
    <section class="tool-hub__hero">
      <p class="tool-hub__eyebrow">Image</p>
      <h1>阿星的图片工具</h1>
    </section>

    <GridComponent :productList="toolList" :minWidth="260" />
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
    linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(240, 244, 247, 0.96)),
    linear-gradient(135deg, rgba(27, 92, 142, 0.14), transparent 46%);
  padding: clamp(20px, 4vw, 28px);
  box-shadow: 12px 12px 0 rgba(15, 23, 34, 0.08);
}

.tool-hub__hero::after {
  position: absolute;
  top: 0;
  right: 0;
  width: 70px;
  height: 70px;
  background: linear-gradient(135deg, rgba(27, 92, 142, 0.16), transparent 70%);
  clip-path: polygon(100% 0, 0 0, 100% 100%);
  content: '';
}

.tool-hub__eyebrow {
  color: #1b5c8e;
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
