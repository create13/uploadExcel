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
    let restructuringArray = []; // 数据重组
    let recordSpu;
    await removeDirContent(dirPath);
    // console.log('generateJson', generateJson);
    for (let [key, line] of generateJson.entries()) {
        console.log('line', line);
        if (line.spu) {
            if (restructuringArray.length != 0) {
                singleData = {"pdpJson": [...restructuringArray]};
                fs.writeFileSync(`${dirPath}/${recordSpu}.txt`, JSON.stringify(singleData))
                restructuringArray = [];
                recordSpu = line.spu;
            } else {
                recordSpu = line.spu;
            }
        }
        if (line.image) {
            let obj = {};
            if (!line.width && !line.navigate) {
                obj.dom = "image";
                obj.style = "";
                obj.data = {};
                obj.data['src'] = line.image;
            } else if (line.width && line.navigate) {
                obj.dom = "image";
                obj.style = "";
                obj.data = {};
                obj.data['src'] = line.image;
                obj.imageStyle = {};
                obj.imageStyle['width'] = `${line.width}rpx;`;
                await axios.get(line.image, {responseType: 'arraybuffer'})
                .then((response) => {
                    let getSize = imageSize(response.data);
                    if (getSize.width != line.width) {
                        let proportion;
                        if (getSize.width > line.width) {
                            proportion = getSize.width / line.width;
                            obj.imageStyle['height'] = `${getSize.height / proportion}rpx;`;
                        } else if (getSize.width < line.width) {
                            proportion = line.width / getSize.width;
                            obj.imageStyle['height'] = `${getSize.height * proportion}rpx;`;
                        }
                    } else {
                        obj.imageStyle['height'] = `${getSize.height}rpx;`;
                    }
                })
                .catch(function (error) {
                    console.log(error);
                })
                let navigateNum = line.navigate.split(',');
                const mapArr = new Map();
                obj.clickBlock = [];
                navigateNum.forEach((item, index) => {
                    mapArr.set(item, index);
                })
                const MapNum = mapArr.size;
                for (let [item, index] of [...mapArr]) {
                    let navigateObj = {};
                    if (mapArr.has('/pages/playHome/playHome') || mapArr.has('/pages/productListing/productListing') || mapArr.has('/pages/user-center/user-center')) {
                        navigateObj.navigate = 'switchTab'
                        navigateObj.url = item;
                        navigateObj.itemStyle = `width: ${100 / MapNum}%; left: ${(100 / MapNum) * index == 0 ? 0: (100 / MapNum) * index + '%'};position: absolute;top: 0;bottom: 0;`
                    } else {
                        navigateObj.navigate = 'navigate'
                        navigateObj.url = item;
                        navigateObj.itemStyle = `width: ${100 / MapNum}%; left: ${(100 / MapNum) * index == 0 ? 0: (100 / MapNum) * index + '%'};position: absolute;top: 0;bottom: 0;`
                    }
                    mapArr.delete(item);
                    obj.clickBlock.push(navigateObj)
                }
            } else {
                if (line.width) {
                    obj.dom = "image";
                    obj.style = "";
                    obj.data = {};
                    obj.data['src'] = line.image;
                    obj.imageStyle = {};
                    obj.imageStyle['width'] = `${line.width}rpx;`;
                    await axios.get(line.image, {responseType: 'arraybuffer'})
                    .then((response) => {
                        let getSize = imageSize(response.data);
                        if (getSize.width != line.width) {
                            let proportion;
                            if (getSize.width > line.width) {
                                proportion = getSize.width / line.width;
                                obj.imageStyle['height'] = `${getSize.height / proportion}rpx;`;
                            } else if (getSize.width < line.width) {
                                proportion = line.width / getSize.width;
                                obj.imageStyle['height'] = `${getSize.height * proportion}rpx;`;
                            }
                        } else {
                            obj.imageStyle['height'] = `${getSize.height}rpx;`;
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                }
                if (line.navigate) {
                    obj.dom = "image";
                    obj.style = "";
                    obj.data = {};
                    obj.data['src'] = line.image;
                    let navigateNum = line.navigate.split(',');
                    const mapArr = new Map();
                    obj.clickBlock = [];
                    navigateNum.forEach((item, index) => {
                        mapArr.set(item, index);
                    })
                    const MapNum = mapArr.size;
                    for (let [item, index] of [...mapArr]) {
                        let navigateObj = {};
                        if (mapArr.has('/pages/playHome/playHome') || mapArr.has('/pages/productListing/productListing') || mapArr.has('/pages/user-center/user-center')) {
                            navigateObj.navigate = 'switchTab'
                            navigateObj.url = item;
                            navigateObj.itemStyle = `width: ${100 / MapNum}%; left: ${(100 / MapNum) * index == 0 ? 0: (100 / MapNum) * index + '%'};position: absolute;top: 0;bottom: 0;`
                        } else {
                            navigateObj.navigate = 'navigate'
                            navigateObj.url = item;
                            navigateObj.itemStyle = `width: ${100 / MapNum}%; left: ${(100 / MapNum) * index == 0 ? 0: (100 / MapNum) * index + '%'};position: absolute;top: 0;bottom: 0;`
                        }
                        mapArr.delete(item);
                        obj.clickBlock.push(navigateObj)
                    }
                }
            }
            restructuringArray.push(obj);
        }
        if (line.video) {
            let obj = {};
            obj.dom = "video";
            obj.data = {};
            obj.data['src'] = line.video;
            obj.data['poster'] = line.poster;
            if (line.videoWidth && line.videoHeight) {
                obj.style = `width:${line.videoWidth}rpx;height:${line.videoHeight}rpx;`;
                obj.videoStyle = `width:${line.videoWidth}rpx;height:${line.videoHeight}rpx;`;
            } else {
                obj.style = "";
            }

            restructuringArray.push(obj);
        }
        if (line.imageSwiper && line.src) {
            let obj = {};
            obj.dom = "imageSwiper";
            let getWidth = line.style && line.style.substring(0, line.style.indexOf('&#'));
            let getHeight = line.style && line.style.substring(line.style.indexOf('&#') + 2);
            obj.style = `width: ${getWidth}rpx; height: ${getHeight}rpx;`
            if (line.imageSwiper == 'need') {
                obj.dots = true;
            } else {
                obj.dots = false;
            }
            let dataArr = line.src && line.src.split('&#');
            let contentData = [];
            dataArr && dataArr.forEach(res => {
                let saveObj = {};
                saveObj.src = res;
                saveObj.imageStyle = {
                    width: `${line.imageWidth}rpx;`,
                    height: `${line.imageHeight}rpx;`
                }
                contentData.push(saveObj);
            })
            obj.data = Array.from(contentData);
            restructuringArray.push(obj);
            
        }
        let filterData = generateJson.filter(item => {
            return item.spu;
        })
        if (filterData.length == 1) {
            if (key == generateJson.length - 1) {
                singleData = {"pdpJson": [...restructuringArray]};
                fs.writeFileSync(`${dirPath}/${recordSpu}.txt`, JSON.stringify(singleData))
                restructuringArray = [];
            }
        } else if (filterData.length > 1) {
            if (key == generateJson.length - 1 && recordSpu) {
                singleData = {"pdpJson": [...restructuringArray]};
                fs.writeFileSync(`${dirPath}/${recordSpu}.txt`, JSON.stringify(singleData))
                restructuringArray = [];
            }
        }
    }
}
// 删除指定文件夹下的内容
const removeDirContent = function (path) {
    console.log('path', path);
    let files = fs.readdirSync(path); // 读取文件夹下面的文件内容
    console.log('files', files);
    // files && files.forEach(item => {
    //     let currentPath = `${path}/${item}`;
    //     if (fs.statSync(currentPath).isDirectory()) { // 如果该文件夹下有文件夹 返回true 执行递归操作 没有文件夹 返回false 删除文件夹下文件
    //         removeDirContent(currentPath);
    //     } else {
    //         fs.unlinkSync(currentPath); // 删除该文件
    //     }
    // })

}

module.exports = generatePic;