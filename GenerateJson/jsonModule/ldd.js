const axios = require('axios');
const imageSize = require('image-size');
const xlsx = require('xlsx');
const fs = require('fs');
let singleData = {};
// 处理表格数据逻辑
const generatePic = async function(workData, dirPath) {
    let sheetName = workData.SheetNames;
    let sheet = workData.Sheets[sheetName[0]]
    let generateJson = xlsx.utils.sheet_to_json(sheet);
    console.log('generateJson', generateJson);
    let saveObj = {}; // 最外层json对象
    let LDDJson = []; // 存储LDDJson数据
    let obj = {}; // 存储对象数据
    let lineNum = 0; // 存储一共几条数据
    let computeNum = 0; // 计算次数
    await removeDirContent(dirPath);
    let num = 0;
    for (let [key, line] of generateJson.entries()) {
        if (key == 0) {
            if (line.tabbarControl) {
                saveObj.tabbarControl = line.tabbarControl;
            } else {
                saveObj.tabbarControl = false;
            }
            if (line.tabbarList) {
                saveObj.tabbarList = {};
                let arrTab = line.tabbarList.split('&#');
                console.log('arrTab', arrTab);
                saveObj.tabbarList.text = arrTab[0];
                saveObj.tabbarList.icon = arrTab[1];
                saveObj.tabbarList.iconSelect = arrTab[2];
            }
            if (line.shareInfo) {
                saveObj.shareInfo = {};
                let shareInfo = line.shareInfo.split('&#');
                saveObj.shareInfo.title = shareInfo[0];
                saveObj.shareInfo.imageUrl = shareInfo[1];
            }
        }
        if (line.image) {
            let obj = {};
            obj.type = 'image';
            let styleSplit = line.style.split('&#');
            obj.style = `width: ${styleSplit[0]}rpx;height: ${styleSplit[1]}rpx;`;
            obj.data = {};
            obj.data.src = line.image;
            if (line.href) {
                obj.data.href = line.href;
            } else if (line.link){
                obj.data.link = line.link;
                if (line.track) {
                    obj.data.track = {};
                    let trackArr = line.track.split('&#');
                    obj.data.track.id = trackArr[0];
                    obj.data.track.name = trackArr[1];
                }
            }
            LDDJson.push(obj);
        } else if (line['product-imgs-group'] || (line.imageUrl && line.skus)) {
            if (line['product-imgs-group']) {
                obj.type = 'product-imgs-group';
                obj.active = 0;
                obj.tabbarExist = false;
                obj.id = `imgs-group-${num}`;
                obj.data = [];
                num++;
                swiperArr = line['product-imgs-group'].split('&#');
                obj.swiper = {
                    autoplay: swiperArr[0],
                    interval: swiperArr[1],
                    duration: swiperArr[2],
                    displayMultipleItems: swiperArr[3]
                }
                lineNum = swiperArr[4];
            }
            let dataArr = [];
            let dataObj = {};
            dataObj.data = {};
            dataObj.code = line.spu;
            dataObj.areaStyle = 'width:100%;left:0%;height:100%;bottom:0;';
            let saveSkus = [];
            if (line.skus.indexOf('&#') == -1) {
                let skuObj = {};
                skuObj.sku = line.skus;
                saveSkus.push(skuObj);
            } else {
                let skuSplit = line.skus.split('&#');
                skuSplit.forEach(item => {
                    let skuObj = {};
                    skuObj.sku = item;
                    saveSkus.push(skuObj);
                })
            }
            dataObj.data.productInfo = {
                spu: line.spu,
                imageUrl: line.imageUrl,
                name: line.name,
                skus: saveSkus,
                isAddCart: line.isAddCart
            }
            dataArr.push(dataObj);
            obj.data.push(dataArr);
            computeNum += 1;
            if (lineNum == computeNum) {
                LDDJson.push(obj);
                obj = {};
                lineNum = 0; // 存储一共几条数据
                computeNum = 0; // 计算次数
            }
        } else if (line.imageExtension) {
            let imageObj = {};
            imageObj.type = 'imageExtension';
            let splitBasic = line.imageExtension.split('&#');
            imageObj.style = `width: ${splitBasic[0]}rpx;height: ${splitBasic[1]}rpx;`
            imageObj.imageSetting = {
                width: `${splitBasic[0]}rpx;`,
                height: `${splitBasic[1]}rpx;`
            }
            imageObj.imageStyle = "width: 100%!important;";
            let settingArr = line.swiperSetting.split('&#');
            imageObj.swiperSetting = {
                interval: `${settingArr[0]}`,
                autoplay: `${settingArr[1]}`,
                indicator: `${settingArr[2]}`,
                style: "height: 100%;!important;"
            };
            imageObj.imageGroupSwiper = [];
            let splitGroup = line.imageGroupSwiper.split('&#');
            splitGroup && splitGroup.forEach(element => {
                let groupObj = {};
                groupObj.imageSrc = element;
                imageObj.imageGroupSwiper.push(groupObj);
            });
            LDDJson.push(imageObj);
        }
        if (key == generateJson.length - 1) {
            saveObj.LDDJson = JSON.parse(JSON.stringify(LDDJson));
            // LDDJson = [];
            fs.writeFileSync(`${dirPath}/lddData.txt`, JSON.stringify(saveObj))
        }

    }
}
// 删除指定文件夹下的内容
const removeDirContent = function (path) {
    console.log('path', path);
    let files = fs.readdirSync(path); // 读取文件夹下面的文件内容
    console.log('files', files);
    files && files.forEach(item => {
        let currentPath = `${path}/${item}`;
        if (fs.statSync(currentPath).isDirectory()) { // 如果该文件夹下有文件夹 返回true 执行递归操作 没有文件夹 返回false 删除文件夹下文件
            removeDirContent(currentPath);
        } else {
            fs.unlinkSync(currentPath); // 删除该文件
        }
    })

}

module.exports = generatePic;