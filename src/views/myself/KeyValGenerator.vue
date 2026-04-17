<template>
    <n-input placeholder="请输入key 用;分割" v-model:value="data.keys">
        <template #prefix>
            keys：
        </template>
    </n-input>

    <div class="flex">
        <div v-for="(item, index) in keys" :key="index">
            <n-input v-model:value="data.values[item]" :key="index" type="textarea" placeholder="item" rows="5" />
        </div>
        <!-- <p> 把手机号复制到下面，注意一行一个，和备注一一对应 </p>
        <n-input v-model:value="data.phone" type="textarea" placeholder="手机号，一行一个" rows="5" />
        <p> 把备注复制到下面，注意一行一个，和手机号一一对应 </p>
        <n-input v-model:value="data.name" type="textarea" placeholder="备注，一行一个" rows="5" />
        <p> 结果到下面 </p> -->
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
import { onMounted } from 'vue';
import { computed } from 'vue';
interface ValObj {
    [key: string]: string
}
const message = useMessage()
const create = () => {
    const reuslt: ValObj[]  = [];
    const length = keys.value.length;
    const tmp: {
        [key: string]: string[]
    } = {}
    // 先做一次分割，避免每次都需要分割
    for (let index = 0; index < keys.value.length; index++) {
        const key = keys.value[index];
        tmp[key] = data.values[key].split('\n');
    }

    const length2 = tmp[keys.value[0]].length;
    for (let index = 0; index < length2; index++) {
        let tmpVal: ValObj = {}
        for (let index2 = 0; index2 < length; index2++) {
            const key1 = keys.value[index2]
            const val = tmp[key1][index]
            tmpVal[key1] = val
        }
        reuslt.push(tmpVal)
    }
    const resultString = JSON.stringify(reuslt)
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
const keys = computed(() => {
    return data.keys.split(";")
});

const data: {
    keys: string,
    values: ValObj,
    result: string
} = reactive({
    keys: "",
    values: {},
    result: '',
})
// 使用toRefs解构
// let { } = { ...toRefs(data) } 

onMounted(() => {

})
defineExpose({
    ...toRefs(data)
})

</script>

<style scoped>
div {
    background-color: black;
}
</style>