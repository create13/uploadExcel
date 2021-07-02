const Koa = require("koa");
const app = new Koa();
const json = require('koa-json');
const koaRouter = require('koa-router');
const router = new koaRouter();
const generatePic = require('./jsonModule/pdp.js');
const koaBody = require('koa-body');
const archiver = require('archiver');
const fs = require('fs');
const path = require('path');
app.use(json());
app.use(router.routes()).use(router.allowedMethods());
router.get('/', async ctx => {
    ctx.body = 'hello yours!';
})
router.post('/uploadPdpFile', koaBody(), async ctx => {
    await generatePic(ctx.request.body.readBinary, path.join(__dirname, '/exportData/pdpJson'));
    const fileName = `${process.cwd()}/exportData/pdpJson/jsonFile.zip`;
    const zipStream = fs.createWriteStream(fileName);
    const zip = archiver('zip');
    zip.pipe(zipStream);
    zip.directory(`${__dirname}/exportData/pdpJson`);
    zip.finalize();
    ctx.body = {
        status: 200,
        message: '上传成功'
    }
})
router.get('/downLoadPdpAll', async ctx => {
    ctx.set("Content-Disposition", `attachment; filename=jsonFile.zip`);
    ctx.set('Content-type', 'application/vnd.openxmlformats');
    ctx.body = await fs.readFileSync(`${process.cwd()}/exportData/pdpJson/jsonFile.zip`);
})
router.post('/uploadLddFile', koaBody(), async ctx => {
    console.log('readBinary',ctx.request.body.readBinary);
    await generatePic(ctx.request.body.readBinary); 
    ctx.body = {
        status: 200,
        message: '上传成功'
    }
})
app.listen(3000, () => {console.log('server started...');});