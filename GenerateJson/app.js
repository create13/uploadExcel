const Koa = require("koa");
const app = new Koa();
const json = require('koa-json');
const koaRouter = require('koa-router');
const router = new koaRouter();
const generatePic = require('./generatePic.js');
const koaBody = require('koa-body');
const archiver = require('archiver');
const fs = require('fs');
app.use(json());
app.use(router.routes()).use(router.allowedMethods());
router.get('/', async ctx => {
    ctx.body = 'hello yours!';
})
router.post('/uploadFile', koaBody(), async ctx => {
    console.log('readBinary', ctx.request.body.readBinary);
    await generatePic(ctx.request.body.readBinary); 
    ctx.body = {
        status: 200,
        message: '上传成功'
    }
})
router.get('/downLoadAll', async ctx => {
    const fileName = 'jsonFile.zip';
    const zipStream = fs.createWriteStream(fileName);
    const zip = archiver('zip');
    zip.pipe(zipStream);
    zip.directory(`${__dirname}/exportData/`);
    zip.finalize();
    ctx.set("Content-Disposition", "attachment; filename="+fileName);
    ctx.set('Content-type', 'application/vnd.openxmlformats');
    ctx.body = await fs.readFileSync(fileName);
})
app.listen(3000, () => {console.log('server started...');});