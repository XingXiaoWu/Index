<template>
    <div class="ciphertext-container">
        <h1>RSA2 加密工具</h1>
        
        <div class="input-section">
            <div class="text-area-group">
                <label for="original-text">原文：</label>
                <textarea 
                    id="original-text"
                    v-model="originalText" 
                    placeholder="请输入要加密的原文..."
                    class="text-area"
                ></textarea>
            </div>
            
            <div class="text-area-group">
                <label for="cipher-text">密文：</label>
                <textarea 
                    id="cipher-text"
                    v-model="cipherText" 
                    placeholder="加密后的密文将显示在这里..."
                    class="text-area"
                    readonly
                ></textarea>
            </div>
        </div>
        
        <div class="button-section">
            <button @click="encrypt" class="btn btn-encrypt">加密</button>
            <button @click="decrypt" class="btn btn-decrypt">解密</button>
            <button @click="swap" class="btn btn-swap">交换</button>
            <button @click="clear" class="btn btn-clear">清空</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// RSA2 密钥配置 - 请填入您的密钥
const RSA_PUBLIC_KEY = '' // 公钥
const RSA_PRIVATE_KEY = '' // 私钥

// 响应式数据
const originalText = ref('')
const cipherText = ref('')

// 加密函数
const encrypt = () => {
    if (!originalText.value.trim()) {
        alert('请输入要加密的原文')
        return
    }
    
    if (!RSA_PUBLIC_KEY) {
        alert('请先配置RSA公钥')
        return
    }
    
    try {
        // 这里实现RSA2加密逻辑
        // 示例：使用公钥加密原文
        console.log('使用公钥加密:', originalText.value)
        // cipherText.value = RSAEncrypt(originalText.value, RSA_PUBLIC_KEY)
        cipherText.value = '加密后的密文示例'
    } catch (error) {
        console.error('加密失败:', error)
        alert('加密失败，请检查密钥配置')
    }
}

// 解密函数
const decrypt = () => {
    if (!cipherText.value.trim()) {
        alert('请输入要解密的密文')
        return
    }
    
    if (!RSA_PRIVATE_KEY) {
        alert('请先配置RSA私钥')
        return
    }
    
    try {
        // 这里实现RSA2解密逻辑
        // 示例：使用私钥解密密文
        console.log('使用私钥解密:', cipherText.value)
        // originalText.value = RSADecrypt(cipherText.value, RSA_PRIVATE_KEY)
        originalText.value = '解密后的原文示例'
    } catch (error) {
        console.error('解密失败:', error)
        alert('解密失败，请检查密钥配置')
    }
}

// 交换函数
const swap = () => {
    const temp = originalText.value
    originalText.value = cipherText.value
    cipherText.value = temp
}

// 清空函数
const clear = () => {
    originalText.value = ''
    cipherText.value = ''
}
</script>

<style scoped>
.ciphertext-container {
    max-width: 800px;
    margin: 0 auto;
    /* padding: 20px; */
    font-family: 'Microsoft YaHei', sans-serif;
}

h1 {
    text-align: center;
    color: #333;
    margin-bottom: 30px;
}

.input-section {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
}

.text-area-group {
    flex: 1;
    display: flex;
    flex-direction: column;
}

label {
    font-weight: bold;
    margin-bottom: 8px;
    color: #555;
}

.text-area {
    width: 100%;
    height: 200px;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 14px;
    font-family: 'Courier New', monospace;
    resize: vertical;
    transition: border-color 0.3s;
}

.text-area:focus {
    outline: none;
    border-color: #4CAF50;
}

.text-area[readonly] {
    background-color: #f9f9f9;
    color: #666;
}

.button-section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    max-width: 400px;
    margin: 0 auto;
}

.btn {
    padding: 12px 24px;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    transition: all 0.3s;
    min-width: 100px;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.btn-encrypt {
    background-color: #4CAF50;
    color: white;
}

.btn-encrypt:hover {
    background-color: #45a049;
}

.btn-decrypt {
    background-color: #2196F3;
    color: white;
}

.btn-decrypt:hover {
    background-color: #1976D2;
}

.btn-swap {
    background-color: #FF9800;
    color: white;
}

.btn-swap:hover {
    background-color: #F57C00;
}

.btn-clear {
    background-color: #f44336;
    color: white;
}

.btn-clear:hover {
    background-color: #d32f2f;
}

@media (max-width: 768px) {
    .input-section {
        flex-direction: column;
    }
    
    .button-section {
        grid-template-columns: 1fr 1fr;
        max-width: 100%;
        gap: 10px;
    }
    
    .btn {
        padding: 10px 16px;
        font-size: 14px;
    }
}
</style>