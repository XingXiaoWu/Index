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
                    class="text-area"></textarea>
            </div>

            <div class="text-area-group">
                <div class="label-with-buttons">
                    <label for="cipher-text">密文：</label>
                    <!-- <div class="action-buttons">
                        <button @click="copyCipherText"
                            class="action-btn copy-btn" title="复制密文">
                            <span>📋</span>
                        </button>
                        <button @click="pasteCipherText"
                            class="action-btn paste-btn" title="粘贴密文">
                            <span>📄</span>
                        </button>
                    </div> -->
                </div>
                <textarea
                    id="cipher-text"
                    v-model="cipherText"
                    placeholder="请输入要解密的密文或加密后的密文将显示在这里..."
                    class="text-area"></textarea>
            </div>
        </div>

        <div class="button-section">
            <button @click="encrypt"
                class="btn btn-encrypt">加密</button>
            <button @click="decrypt"
                class="btn btn-decrypt">粘贴并解密</button>
            <button @click="copyCipherText" class="btn btn-swap">复制密文</button>
            <button @click="clear" class="btn btn-clear">清空</button>
        </div>
        
        <!-- Toast 提示 -->
        <div v-if="showToast" class="toast" :class="`toast-${toastType}`">
            {{ toastMessage }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import JSEncrypt from 'jsencrypt'
// @ts-ignore
import ClipboardJS from 'clipboard'

// RSA2 密钥配置 - 请填入您的密钥
const RSA_PUBLIC_KEY = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAw+TMvFLGzjy8oz49If5Ek6qXf3EpnB/D6YutkhKpj9RDCCDrnZw8IBxnoRkIGpytWwbAWKJsep3bxMnQSh8/PE6W5KPNGPOFWWhxxC1RU1aXXFu3J473NZz1DLjhtC2fguvPxcGBpXVFbGumIcSBYu0+4e3LJ3tnGVZxBsU2eszEHvUDyLvUy8HVy2AA5L/+k7qVPIDsUBdeRs0h2cV+Y3eUw7Kf1bxIr1nyvFrsTQhvB3JOk5I1OATA12aozFfILtfyeWl3bDKfHD8nc2BSz+LvN55GIqV0sySrE6aNws/pjHIkhsEGZBUCsiQqw++gY1G7w4fsxHEgXgSRM8ik7QIDAQAB`
const RSA_PRIVATE_KEY = `MIIEowIBAAKCAQEAw+TMvFLGzjy8oz49If5Ek6qXf3EpnB/D6YutkhKpj9RDCCDrnZw8IBxnoRkIGpytWwbAWKJsep3bxMnQSh8/PE6W5KPNGPOFWWhxxC1RU1aXXFu3J473NZz1DLjhtC2fguvPxcGBpXVFbGumIcSBYu0+4e3LJ3tnGVZxBsU2eszEHvUDyLvUy8HVy2AA5L/+k7qVPIDsUBdeRs0h2cV+Y3eUw7Kf1bxIr1nyvFrsTQhvB3JOk5I1OATA12aozFfILtfyeWl3bDKfHD8nc2BSz+LvN55GIqV0sySrE6aNws/pjHIkhsEGZBUCsiQqw++gY1G7w4fsxHEgXgSRM8ik7QIDAQABAoIBAA6z8lLzN+U8WqCPrWkgVheAPxaLZjxdMlLp5IPuydJtXn+dGu94OGy6PQ6dcUXaux82fULZzrW6+fGwqmUZ0yD3ZBdynOmnGNE6XTREfigOEIEX3YIcVqfWk++Zw8+xJJm1ZyGYZx7wU57c4I9ZxKf/FxBq4kE1ylSfmo76comaXxhMIe/pia8PplKoDIjqDI8D6JouUGcjBOvS6FddOqLT3wAVE6xiks1R6wxvf75r74JeDD8qyt2oUjDBTB/Twwn9SJWvyib6TTIL82xZN3ihMMXLqaUqvo2qQpr5lniUr5zEUI9WmUEy/6oxxA7nusVEKopUNVuuDLzndXwfp7ECgYEA4bJc2koDmIjAgyzqNPEdc42+DcjbDwyJ1SB/FTfgBj1mR1pRH3G4mqHyBje0ZAUy7SSinUUrCWPQMo2zI5hvq0+3ChmRb4UUvlRrDF3WS0MSzUErESw6f4CLqthpRdvKEM4CmP5X2W1jz17q+LNyLikBUy9dm+AEqh2JRb2PKV0CgYEA3jIM5/2w4RI6GIJLLhh12gkqy1+HUZ12gNXIzuPHxzoBICul+mR2FIYaEZBRo6fQwfMJkXhdowMiiOoruxizyQHKV3oRS9qesN51xffNQPDdDac72SKv3Holahx/Uro8M2yfPmMVLRh5D4+ScBZs54fidVRtyAFMxF9OtASpYNECgYEA1ZP2LlQQJw5yLzAXylXJqwodKepC8nDJFjiUSj3/76e23Brp3bm+Ggbag2u/d088LBGZGP7VhSNBaDWTqkGcmx7qddJQQJpNUPeN/bvnCH3GkxnyaWPTT8kTYm883/DnvRNWffViqMzNwPVvoj4d9PS03kVabiGGCH2+45JIobkCgYBnRIXBEKQzhuAfYfcE/nNPmbEdAlIG+ZMI/9MrbKv+CRRa2k5y2FwU39qfzR5UXHtmmMkapgGG8L8NOSCH/UwZoM5k56PASGQ2ub2s+6WWiBuE6/Oh0EBBzTc0YPg//7RZBiPgv/YollY1iDm8BIAq/3mdpFa9fPUr00vl2MDL8QKBgA2QKWR8QYh92L9d81vHQDs4J+9vOx60OFCTwrh6qhZ48wxN+Tyq9op/ZPBpWHo28V8tfhINQJWnqlnGaZ77NP4I/8Oroc2nI+NqZ2iz4MweuMIWeRnTQbzr+DnZlnAoxBcHKWbcWECotaM3fRqvBNKiEyd3FTwefvWDjd0e87Yg`

// RSA加密函数
const encryptRSA = (text: string, publicKey: string): string => {
    try {
        const encrypt = new JSEncrypt()
        encrypt.setPublicKey(publicKey)
        return encrypt.encrypt(text) || ''
    } catch (error) {
        console.error('RSA加密失败:', error)
        throw new Error('加密失败')
    }
}

// RSA解密函数
const decryptRSA = (encryptedText: string, privateKey: string): string => {
    try {
        const decrypt = new JSEncrypt()
        decrypt.setPrivateKey(privateKey)
        return decrypt.decrypt(encryptedText) || ''
    } catch (error) {
        console.error('RSA解密失败:', error)
        throw new Error('解密失败')
    }
}

// 响应式数据
const originalText = ref('')
const cipherText = ref('')
const showToast = ref(false)
const toastMessage = ref('')
const toastType = ref('success') // 'success' | 'error' | 'info'

let clipboard: ClipboardJS | null = null

onMounted(() => {
  clipboard = new ClipboardJS('.copy-btn')
  clipboard.on('success', () => {
    showToastMessage('密文已复制到剪贴板')
  })
  clipboard.on('error', () => {
    showToastMessage('复制失败，请手动复制', 'error')
  })
})

onBeforeUnmount(() => {
  clipboard?.destroy()
})

// 显示toast函数
const showToastMessage = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    toastMessage.value = message
    toastType.value = type
    showToast.value = true
    
    // 3秒后自动隐藏
    setTimeout(() => {
        showToast.value = false
    }, 3000)
}

// 加密函数
const encrypt = () => {
    if (!originalText.value.trim()) {
        showToastMessage('请输入要加密的原文', 'error')
        return
    }
    
    if (!RSA_PUBLIC_KEY) {
        showToastMessage('请先配置RSA公钥', 'error')
        return
    }
    
    try {
        // 使用公钥加密原文
        const encrypted = encryptRSA(originalText.value, RSA_PUBLIC_KEY)
        cipherText.value = encrypted
        showToastMessage('加密成功')
        console.log('加密成功:', encrypted)
    } catch (error) {
        console.error('加密失败:', error)
        showToastMessage('加密失败，请检查密钥配置', 'error')
    }
}

// 解密函数
const decrypt = async () => {
    await pasteCipherText()
    if (!cipherText.value.trim()) {
        showToastMessage('请输入要解密的密文', 'error')
        return
    }
    
    if (!RSA_PRIVATE_KEY) {
        showToastMessage('请先配置RSA私钥', 'error')
        return
    }
    
    try {
        // 使用私钥解密密文
        const decrypted = decryptRSA(cipherText.value, RSA_PRIVATE_KEY)
        originalText.value = decrypted
        showToastMessage('解密成功')
        console.log('解密成功:', decrypted)
    } catch (error) {
        console.error('解密失败:', error)
        showToastMessage('解密失败，请检查密钥配置', 'error')
    }
}

// // 交换函数
// const swap = () => {
//     const temp = originalText.value
//     originalText.value = cipherText.value
//     cipherText.value = temp
// }

// 清空函数
const clear = () => {
    originalText.value = ''
    cipherText.value = ''
}

// 复制密文函数
const copyCipherText = async () => {
    if (!cipherText.value.trim()) {
        showToastMessage('没有可复制的内容', 'error')
        return
    }
    
    try {
        await navigator.clipboard.writeText(cipherText.value)
        showToastMessage('密文已复制到剪贴板')
    } catch (error) {
        console.error('复制失败:', error)
        showToastMessage('复制失败，请手动复制', 'error')
    }
}

// 粘贴密文函数
const pasteCipherText = async () => {
    if (navigator.clipboard && navigator.clipboard.readText) {
        try {
            const text = await navigator.clipboard.readText()
            if (text) {
                cipherText.value = text
                showToastMessage('已粘贴密文')
                return text
            } else {
                showToastMessage('剪贴板为空', 'error')
            }
        } catch {
            showToastMessage('粘贴失败，请手动粘贴', 'error')
        }
    } else {
        showToastMessage('当前浏览器不支持一键粘贴，请手动粘贴', 'error')
    }
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

.label-with-buttons {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 8px;
}

.action-buttons {
    display: flex;
    gap: 5px;
}

.action-btn {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.9);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    transition: all 0.2s;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.action-btn:hover {
    background-color: #f0f0f0;
    transform: scale(1.05);
}

.copy-btn:hover {
    background-color: #e8f5e8;
}

.paste-btn:hover {
    background-color: #e8f0ff;
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
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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

/* Toast 样式 */
.toast {
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 12px 20px;
    border-radius: 6px;
    color: white;
    font-size: 14px;
    z-index: 1000;
    animation: slideIn 0.3s ease-out;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.toast-success {
    background-color: #4CAF50;
}

.toast-error {
    background-color: #f44336;
}

.toast-info {
    background-color: #2196F3;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
        opacity: 0;
    }
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
</style>