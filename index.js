var bodyParser = require('body-parser');
const express = require('express');
const cors = require('cors');
const path = require('path');
const huflit = require('./modules/Huflit');

const app =  express();
const port = 3000;

app.set('view engine', 'pug');
app.set('views', 'static');

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'static')))

app.all('/', function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "X-Requested-With");
     next()
});

app.get('/', cors(), function(req, res){
     res.render('index');
});

app.post('/profile', cors(),async (req, res, next) => {
     try{
          const API = new huflit();
          console.log(req.body);
          var data = req.body;
          var profile = await API.login(data);
          console.log(profile);
          
          res.json(profile)
          console.log('success')
     }catch(error){
          console.log(error);
          res.send(error);
     }
});

app.post('/CheckCookie', cors(), async (req, res, next) =>{
     try {
          const API = new huflit();
          API.jar.setCookie(req.body.cookie, 'https://portal.huflit.edu.vn')
          var data = await API.CheckCookie()
          res.send(data);
     } catch (error) {
          console.log(error)
          res.send(error);
     }
});

app.post('/Schedules', cors(), async (req, res, next) => {
     try{
          const API = new huflit();
          console.log(req.body)
          API.jar.setCookie(req.body.cookie, 'https://portal.huflit.edu.vn')
          console.log(API.jar)
          var data = await API.getSchedules('HK01');
          console.log(data)
          res.send(data);

     }catch(error){
          console.log(error)
          res.send(error)
     }
});

app.post('/ChangePass', cors(), async(req, res, next) => {
     try {
          const API = new huflit();
          API.jar.setCookie(req.body.cookie, 'https://portal.huflit.edu.vn')
          var done = await API.ChangePass(req.body.oldPass, req.body.newPass);
          res.send(done)
     } catch (error) {
          console.log(error);
          res.send(error);
     }
});

app.listen(process.env.PORT || port, () => console.log("Server is running..."));