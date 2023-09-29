
<template>
    <div>
        <p> 把手机号复制到下面，注意一行一个，和备注一一对应 </p>
        <n-input v-model:value="data.phone" type="textarea" placeholder="手机号，一行一个" rows="5" />
        <p> 把备注复制到下面，注意一行一个，和手机号一一对应 </p>
        <n-input v-model:value="data.name" type="textarea" placeholder="备注，一行一个" rows="5" />
        <p> 结果到下面 </p>
        <div class="flex-row">
            <n-button @click="create()">
                生成
            </n-button>
            <n-button @click="copy()">
                复制
            </n-button>
        </div>
        <n-input id="result" autosize v-model:value="data.result" type="textarea" placeholder="结果" />
    </div>
</template>

<script lang="ts" setup>
import { reactive, toRefs } from 'vue';
import Clipboard from "clipboard";
import { useMessage } from 'naive-ui'
const message = useMessage()
const create = () => {
    const phones = data.phone.split('\n')
    const names = data.name.split('\n')
    const reuslt = []
    for (let index = 0; index < phones.length; index++) {
        const phone = phones[index];
        const name = names[index];
        reuslt.push({
            phone,
            name
        })
    }
    const tmp = JSON.stringify(reuslt)
    let resultString = `
    const friends = ${tmp};
    module.exports = friends;
    `
    data.result = resultString
}

const copy = () => {
    Clipboard.copy(data.result);
    setTimeout(() => {
        message.success(
            "复制成功"
        )
    }, 2000)


}
//console.log('1-开始创建组件-setup')
/**
* 数据部分
*/
const data = reactive({
    phone: '',
    name: '',
    result: '',
})
// 使用toRefs解构
// let { } = { ...toRefs(data) } 
defineExpose({
    ...toRefs(data)
})

</script>

<style scoped lang='less'></style>