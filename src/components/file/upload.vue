<template>
    <view class="example-body">
        <uni-file-picker v-model="fileList" :auto-upload="false" mode="grid" @select="select" @delete="delFile"
            :image-styles="imageStyles" :list-styles="listStyles" limit="6" title="上传图片"></uni-file-picker>
    </view>

</template>

<script setup>
import { upload } from '@/api/interface/file'
import { ref, reactive, watch } from "vue";
import { useUserStore } from "@/stores/user";
let imageStyles = {
    "width": "140rpx",
    "height": "140rpx",
}

const listStyles = {
    border: true,
    dividline: true,

}

const props = defineProps({
    appendixEntityList: { default: [] },
});
const emit = defineEmits(["update:appendixEntityList"]);

let fileList = ref([]);
const select = (e) => {
    let promises = [];
    for (let i = 0; i < e.tempFilePaths.length; i++) {
        const promise = uploadFiles(e.tempFilePaths, i);
        promises.push(promise);
    }
    Promise.all(promises).then(() => {
    });
};
// 上传函数
const uploadFiles = async (tempFilePaths, i) => {
    let userInfo = useUserStore();
    await uni.uploadFile({
        url: import.meta.env.VITE_API_URL + '/api/wxmp/upload', //后端用于处理图片并返回图片地址的接口
        filePath: tempFilePaths[i],
        name: "file",
        header: {
            Authorization: "SaBearer " + userInfo.data.token || "",
            ContentType: "application/x-www-form-urlencoded",
            skipToken: true,
        },
        success: (res) => {
            if (res.statusCode == 200) {
                let data = JSON.parse(res.data);
                console.log(data.data.link);
                props.appendixEntityList.push(data.data.link);
                console.log(props.appendixEntityList);
                emit("update:appendixEntityList", props.appendixEntityList);
            }
        },
        fail: () => {
            console.log("err");
        },
    });
};

//文件列表回显
const fileListEcho = () => {
    if (props.appendixEntityList.length > 0) {
        fileList.value = [];
        props.appendixEntityList?.forEach((v) => {
            //改成官方文档要求的格式。才能回显附件
            fileList.value.push({
                name: v?.appendixOriginal,
                extname: v?.appendixType,
                url: v?.appendixUrl,
            });
        });
    }
};
// 移出图片函数
const delFile = async (val) => {
    //在提交数组中删除那个被删的文件
    props.appendixEntityList.some((v, i) => {
        if (v.appendixOriginal === val.tempFile.name) {
            props.appendixEntityList.splice(i, 1);
            emit("update:appendixEntityList", props.appendixEntityList);
            return true;
        }
    });
};
watch(
    () => props.appendixEntityList,
    (newVal) => {
        fileListEcho();
    },
);
</script>

<style lang="scss" scoped>
.icon-zengjiatianjiajiahao {
    font-size: 42rpx;
    color: #a2a3a5;
    position: absolute;
    right: 0;
    top: -50rpx;
}
</style>