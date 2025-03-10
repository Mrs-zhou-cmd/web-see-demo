const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const coBody = require('co-body');
// 创建静态服务
const serveStatic = require('serve-static');
const rootPath = path.join(__dirname, 'dist');
app.use(serveStatic(rootPath));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

// 先获取app数据
const appDataPath=path.join(__dirname,'apps-data.json');
// 读取app数据
function loadAppData(){
  try{
    const data=fs.readFileSync(appDataPath,'utf-8');
    return JSON.parse(data);
  }
  catch{
    return {apps:[]}
  }
}
let {apps}=loadAppData();
// 获取app数据
app.get('/getapps',(req,res)=>{
  // let {apps}=loadAppData();
  res.send({
    code:200,
    data:apps
  })
});
// 添加app数据
app.post('/addapp',(req,res)=>{
  try{
    apps.push(req.body);
    saveData({apps},appDataPath);
    res.send({
      code:200,
      message:'添加成功',
    })
  }
  catch(err){
    res.send({
      code:203,
      message:'添加失败',
      err
    })
  }
});
// 保存数据到指定路径
function saveData(data,path){
  fs.writeFileSync(path,JSON.stringify(data),'utf-8');
}
// 存储性能数据
let performanceList = [];
// 存储错误数据
let errorList = [];
// 存储录屏数据
let recordScreenList = [];
// 存储白屏检测数据
let whiteScreenList = [];

// 获取js.map源码文件
app.get('/getmap', (req, res) => {
  // req.query 获取接口参数
  let fileName = req.query.fileName;
  let mapFile = path.join(__filename, '..', 'dist/js');
  // 拿到dist目录下对应map文件的路径
  let mapPath = path.join(mapFile, `${fileName}.map`);
  fs.readFile(mapPath, function (err, data) {
    if (err) {
      console.error(err);
      return;
    }
    res.send(data);
  });
});

app.get('/getErrorList', (req, res) => {
  res.send({
    code: 200,
    data: errorList 
  });
});

app.get('/getRecordScreenId', (req, res) => {
  let id = req.query.id;
  let data = recordScreenList.filter((item) => item.recordScreenId == id);
  res.send({
    code: 200,
    data
  });
});

app.post('/reportData', async (req, res) => {
  try {
    // console.log('1233333333333')
    // req.body 不为空时为正常请求，如录屏信息
    let length = Object.keys(req.body).length;
    if (length) {
      recordScreenList.push(req.body);
    } else {
      // 使用 web beacon 上报数据
      // co-body 可能是为了更灵活地处理非标准数据格式
      let data = await coBody.json(req);
      if (!data) return;
      if (data.type == 'performance') {
        performanceList.push(data);
      } else if (data.type == 'recordScreen') {
        recordScreenList.push(data);
      } else if (data.type == 'whiteScreen') {
        whiteScreenList.push(data);
      } else {
        errorList.push(data);
      }
    }
    res.send({
      code: 200,
      meaage: '上报成功！'
    });
  } catch (err) {
    res.send({
      code: 203,
      meaage: '上报失败！',
      err
    });
  }
});

app.listen(8083, () => {
  console.log('Server is running at http://localhost:8083');
});
