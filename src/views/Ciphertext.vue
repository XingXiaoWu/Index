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
                <label for="cipher-text">密文：</label>
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
                class="btn btn-decrypt">解密</button>
            <button @click="swap" class="btn btn-swap">交换</button>
            <button @click="clear" class="btn btn-clear">清空</button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import JSEncrypt from 'jsencrypt'

// RSA2 密钥配置 - 请填入您的密钥
const RSA_PUBLIC_KEY = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsSXjpphcj/34n1nHCnma
rGCzFsv/vRE1XpQTwJpuXxCjjSUUAvf202I+sDH93/Tm6M0k0LQ1WQkeEApRzkb6
gPG1LybpKjvaYGMGEBZ5wHvM4FclJMIGqYAB/XP40XfvpYvn/C+QAY0JZxkvYlDb
cBhy5ggYS1Y0+3tS8WriplyjhjFBkq+plgPncOyAXNZ6tntjmpkuQw4sJ+Pt9Ag8
dypB8qmjM8464m2+3b81K64VhH4GtPJt0V6+rpUUlbGdbhyQJM6KdRwDY8WARxMH
zAESwCTEDoVBtZcSGK/UwsGAtTGqHxfFCtFc+/6GRIr0o29goPeIELRn6TTmu+VY
ywIDAQAB`
const RSA_PRIVATE_KEY = `MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCxJeOmmFyP/fif
WccKeZqsYLMWy/+9ETVelBPAmm5fEKONJRQC9/bTYj6wMf3f9ObozSTQtDVZCR4Q
ClHORvqA8bUvJukqO9pgYwYQFnnAe8zgVyUkwgapgAH9c/jRd++li+f8L5ABjQln
GS9iUNtwGHLmCBhLVjT7e1LxauKmXKOGMUGSr6mWA+dw7IBc1nq2e2OamS5DDiwn
4+30CDx3KkHyqaMzzjribb7dvzUrrhWEfga08m3RXr6ulRSVsZ1uHJAkzop1HANj
xYBHEwfMARLAJMQOhUG1lxIYr9TCwYC1MaofF8UK0Vz7/oZEivSjb2Cg94gQtGfp
NOa75VjLAgMBAAECggEAF6bFZELHaPoxraTg7EccHZOzlYGbHXUkuQHwOTDlN5AT
Jg8jQto0fDiLwh6KlNIv2jk5hxvoW4DaIK4gCfh0Da83z5nUW60uFNxjvNYjX02o
JvO7o9K77PmISnynZeArgODTElqPUYWxEbDNIMVG5wp8nLXL+JMD8+edRVpN9IQE
4BdnPgN0+zxCFgBWyUWGzFjc1oovtJDnpYT+1nfW4M9HV7/vEY8SVC/rvzuYlae/
NbyreHpiAHsf849IbBwZS7WW469OtAiWMy+hBhX6mCwx5ZMnjjaVcQu1pm8ao2Ml
lZwhnd/A4RdQbtuN1nkAKrTKjoFmVVgFMgzm4ZB/YQKBgQDie3rwf2zmk4o/Zirr
eqTjQws6cmd/i79fu9BoY/7vRuaOGBYhPc0hQTq9zlveRrhuLH+mO2rJ5yYGhTit
bCsHrhdaTZdv6eGgqxH69f6+AaT02XVgt61NTAx54FveTwGzI5ocXRimYEnBph+S
5CGURwwhihgmPgKDd4raozrNUwKBgQDIPGH1ZoGTtboKv36PRxAtizRxB7BM26+T
LssDF2soEkzxf26epdXre80h+EtLn35RV8Nb73+6EQrF5HQaDuLwGgxF5RPO53ek
rHoNuMu166GhNsKqKPbcQbfOSHSzB4EMGS2MaWyi8TWVa6N61h4qtjzS+bvW42ts
5bH6WlZfqQKBgBSX07Lgcz939N8U5BwrN6juZKv40Q5Y35rN0gJb7UdGdBpBeGmn
W+qFKtktVU8dsRFbfHPZ/TjEisGXBXNHXZZCLx9n5LgpVPmt9GGUUohmT+BvkWus
59Yabxv52YCaQHZQa2fe0yn1oV85Qq+xjJgV6bV3AAEiLEpV6Us+Ak+/AoGACN3T
oKA3YKkNYeh03DdTWhDt84tZnS2lKqlJyAtDbXTR/2ebKF9Dh7flr3llLCYV29g9
CFckmsKibXzeP0Elf2hH3thz9hd9zsbsaKskKhwS/iaEnDBQLhSi5PmEYWEVr8l1
oOASNWzk6IbpqEjO8Sk8rELutGdBnILXTLSvWnECgYBTqlQMIBkgZyEeCYGIkhUx
bU3qBTG9+PfbOfdgGtJMwAog4IuoN8Y7CvZjn3ex82nCsD7A3bFBZQrIKrrFWmj8
QnE9jceqRpv+HVeFGlGO5pwWuz2PGtPK4f9ILK6JVp8Wq7KUwguV3VIKEeVr4x58
s2cqbfwxKATFJEL/jOaslg==`

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
        // 使用公钥加密原文
        const encrypted = encryptRSA(originalText.value, RSA_PUBLIC_KEY)
        cipherText.value = encrypted
        console.log('加密成功:', encrypted)
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
        // 使用私钥解密密文
        const decrypted = decryptRSA(cipherText.value, RSA_PRIVATE_KEY)
        originalText.value = decrypted
        console.log('解密成功:', decrypted)
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
</style>