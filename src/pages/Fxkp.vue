<template>
    <div id="app">
      <h1>输入公司名称生成文字 logo</h1>
      <input v-model="companyName" type="text" placeholder="请输入公司名称">
      <button @click="generateLogo">生成 logo</button>
      <button @click="downloadLogo">下载 logo</button>
      <div id="logo" :style="{ backgroundColor: logoBgColor }">{{ logoText }}</div>
  
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
  
  const generateLogo = () => {
    if (companyName.value.length === 4) {
      logoText.value = `${companyName.value.slice(0, 2)}\n${companyName.value.slice(2)}`;
    } else {
      logoText.value = companyName.value;
    }
    const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
    logoBgColor.value = randomColor;
  };
  const downloadLogo = () => {
    
  }
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