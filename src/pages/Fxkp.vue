<template>
  <div id="app">
    <h1>输入公司名称生成文字 logo</h1>
    <input v-model="companyName" type="text" placeholder="请输入公司名称">
    <button @click="generateLogo">生成 logo</button>
    <button @click="downloadLogo">下载 logo</button>
    <div id="logo" ref="logoRef" :style="{ backgroundColor: logoBgColor }">{{ logoText }}</div>

    <h1>输入地址生成二维码</h1>
    <input v-model="companyName2" type="text" placeholder="请输入公司名称">
    <br />
    <textarea v-model="address" placeholder="请输入地址" cols="22" rows="5"></textarea>
    <br />
    <button @click="generateQRCode">生成二维码</button>
    <div id="qrcode" v-html="qrcodeHtml"></div>
    <div id="companyNameDisplay">{{ companyName2 }}</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
// 假设 qrcode.min.js 已经安装并导入
import QRCode from 'qrcode-generator';

const companyName = ref('');
const logoText = ref('');
const logoBgColor = ref('');
const companyName2 = ref('');
const address = ref('');
const qrcodeHtml = ref('');
const logoRef = ref('');

// onMounted(() => {
//   logoRef.value = document.getElementById('logo');
// });

const generateLogo = () => {
  if (companyName.value.length === 4) {
    logoText.value = `${companyName.value.slice(0, 2)}\n${companyName.value.slice(2)}`;
  } else {
    logoText.value = companyName.value;
  }
  const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
  logoBgColor.value = randomColor;
};

const downloadLogo = async () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const text = logoText.value;
  const color = logoRef.value.style.backgroundColor;

  canvas.width = 2048;
  canvas.height = 2048;

  // 设置字体样式，与页面上的 logo 字体大小一致
  ctx.font = '748px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 绘制带圆角的背景
  const radius = 200;
  const x = 0;
  const y = 0;
  const width = 2048;
  const height = 2048;

  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();

  // 设置文字颜色
  ctx.fillStyle = 'white';

  // 计算文字位置
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  // 绘制文字
  if (text.includes('\n')) {
    const lines = text.split('\n');
    const lineHeight = 748;
    const totalHeight = lines.length * lineHeight;
    const startY = centerY - totalHeight / 2 + lineHeight / 2;
    lines.forEach((line, index) => {
      ctx.fillText(line, centerX, startY + index * lineHeight);
    });
  } else {
    ctx.fillText(text, centerX, centerY);
  }

  // 创建下载链接
  const link = document.createElement('a');
  link.href = canvas.toDataURL('image/png');
  link.download = companyName.value + 'logo.png';
  link.click();
};

const generateQRCode = () => {
  qrcodeHtml.value = '';
  if (address.value) {
    const qr = QRCode(0, 'L');
    qr.addData(address.value);
    qr.make();
    qrcodeHtml.value = qr.createImgTag(4);
  }
};
</script>

<style scoped>
body {
  font-family: Arial, sans-serif;
  text-align: center;
  padding-top: 50px;
}

#logo {
  font-size: 48px;
  font-weight: bold;
  margin-top: 20px;
  padding: 10px;
  border-radius: 20px;
  color: white;
  white-space: pre-line;
  width: 200px;
  height: 200px;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
}

#qrcode {
  margin-top: 20px;
}
</style>