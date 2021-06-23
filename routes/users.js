var express = require('express');
var router = express.Router();


var model = require('../model');


/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/regist', function(req, res, next) {
  let userObj = {
    username: req.body.username,
    password: req.body.password
  }
  //应该效验确认密码
  model.connect(function(db) {
    db.collection('users').insertOne(userObj, function(err, ret) {
      if (err) throw err;
      res.redirect('/login');
    })
  })
})

router.post('/login', function(req, res, next) {
  var userObj = {
    username: req.body.username,
    password: req.body.password
  }
  model.connect(function(db) {
    db.collection('users').find(userObj).toArray(function(err, result) {
      if (err) throw err;
      if(result.length>0){
        console.log("登录成功-----------",req.body.username);
        req.session.username = req.body.username;
        res.redirect('/');
      }else{
        res.render('login',{
          msg: "账户或密码错误！"
        });
      }
    })
  })
})

module.exports = router;
