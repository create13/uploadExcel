<template>
    <div>
        <div class="back-home" @click="backHome">回到首页</div>
        <div class="des-title">pdp页面数据处理</div>
        <div class="upload-file">
            <input @change="uploadPdpFile" multiple="multiple" ref="file" type="file" class="input-opacity" />
            上传表格
        </div>
        <div @click="downLoadPdpFile" class="download-file">下载文件</div>
        <div class="prompt-fonts">{{uploadSuccess}}</div>
    </div>
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
  components: {},
  mounted () {},
  methods: {
        uploadPdpFile () {
            this.uploadSuccess = '';
            const file = this.$refs.file.files[0];
            let readBinary;
            let reader = new FileReader();
            reader.readAsBinaryString(file);
            reader.onload = async (e) => {
                let resultData = e.target.result;
                readBinary = await XLSX.read(resultData, {
                    type: 'binary'
                });
                axios.post('/api/uploadPdpFile', {readBinary}).then(res => {
                    console.log('res', res.data.message);
                    this.uploadSuccess = res.data.message;
                }).catch(err => {
                    console.log('err', err);
                })
            }
        },
        downLoadPdpFile () {
            window.open('http://192.168.210.238:3000/downLoadPdpAll', '_blank');   
        },
         backHome () {
            this.$router.push('/');
        }
  }
}
</script>

<style scoped>
    .back-home {padding: 10px 0; cursor: pointer;text-decoration: underline;color: dodgerblue;}
    .des-title {padding: 20px 0;}
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