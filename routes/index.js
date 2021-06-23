var express = require('express');
var router = express.Router();

var model = require('../model');

var moment = require('moment');


/* GET home page. */
router.get('/', function(req, res, next) {
  var page = req.query.page||1;
  var pageSize = req.query.pageSize||3;//默认一页3篇文章
  model.connect(function(db) {
    db.collection('articles').find().toArray(function(err, result) {
      if (err) throw err;
      var total = result.length;
      page = page<1?1:page;
      page = page>Math.ceil(total/pageSize)?Math.ceil(total/pageSize):page;
      var skipNum = (page-1)*pageSize;
      if (total === 0) {
        var data = {
          articles: result,
          page: page,
          pageSize: pageSize,
          total: total
        }
        res.render('index', {data: data,username: req.session.username});
        return;
      }
      model.connect(function(db) {
        db.collection('articles').find().sort({_id:-1}).skip(skipNum).limit(pageSize).toArray(function(err, ret) {
          var list = ret;
          list.map((item, index) => {
            item.time = moment(item.publishTime).format('YYYY-MM-DD hh:mm:ss');
          })
          var data = {
            articles: list,
            page: page,
            pageSize: pageSize,
            total: total
          }
          res.render('index', {data: data,username: req.session.username});
        })
      })
    })
  })
});

router.get('/regist', function(req, res, next) {
  res.render('regist')
})

router.get('/login', function(req, res, next) {
  res.render('login')
})

router.get('/logout', function(req, res, next) {
  req.session.username = null;
  res.redirect('/login')
})


module.exports = router;
