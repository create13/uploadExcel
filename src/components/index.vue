<template>
    <div class="upload-file">
        <input @change="uploadFile" multiple="multiple" ref="file" type="file" class="input-opacity" />
        上传表格
    </div>
    <div @click="downLoadFile" class="download-file">下载文件</div>
    <div class="prompt-fonts">{{uploadSuccess}}</div>
</template>

<script>
import axios from 'axios'
import XLSX from 'xlsx'
export default {
    name: '',
    data () {
        return {
            uploadSuccess: ''
        };
    },
    components: {
    },
    mounted () {},
    methods: {
        uploadFile () {
            const file = this.$refs.file.files[0];
            let readBinary;
            let reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = async (e) => {
                let resultData = e.target.result;
                readBinary = await XLSX.read(resultData, {
                    type: 'binary'
                });
                axios.post('/api/uploadFile', {readBinary}).then(res => {
                    console.log('res', res.data.message);
                    this.uploadSuccess = res.data.message;
                }).catch(err => {
                    console.log('err', err);
                })
            }
        },
        downLoadFile () {
            window.open('http://192.168.211.125:3000/downLoadAll', '_blank');   
        }
    }
}
</script>

<style scoped>
    .upload-file {
        width: 150px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        color: #fff;
        background: #409EFF;
        border-radius: 5px;
        display: inline-block;
        position: relative;
    }
    .input-opacity {
        opacity: 0;
        position: absolute;
        width: 150px;
        height: 36px;
        left: 0;
    }
    .download-file {
        width: 150px;
        height: 36px;
        line-height: 36px;
        text-align: center;
        color: #fff;
        background: #67C23A;
        border-radius: 5px;
        display: inline-block;
        margin-left: 32px;
    }
    .prompt-fonts {
        width: 150px;
        height: 36px;
        line-height: 36px;
        text-align: center;
    }
</style>