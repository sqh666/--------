var express = require('express');
var router = express.Router();

var moment = require('moment');
var multiparty = require('multiparty');
var fs = require('fs');

var model = require('../model');

var ObjectID = require('mongodb').ObjectID;



router.get('/publish', function(req, res, next) {
    var id = ObjectID(req.query.id);
    var page = req.query.page||'';
    model.connect(function(db) {
        db.collection('articles').find({_id:id}).toArray(function(err, result) {
            if (err) throw err;
            var article = {};
            if (result.length != 0){
                article = result[0];
            }
            res.render('articlePublish', {article: article, page: page, username: req.session.username});
        })
    })
})
router.post('/publish', function(req, res, next){
    var id = req.body.id;
    var page = req.body.page;
    var articleObj = {
        title: req.body.title,
        content: req.body.content
    }
    model.connect(function(db) {
        if (id) { // 修改
            db.collection("articles").updateOne({_id: ObjectID(id)}, {$set: articleObj}, function(err, result) {
                if (err) throw err;
                res.redirect('/?page='+page);
            })
        } else { // 新增
            articleObj.author = req.session.username;
            articleObj.publishTime = Date.now();
            db.collection("articles").insertOne(articleObj, function(err, result) {
                if (err) throw err;
                res.redirect('/');
            })
        }
    })
})

router.get('/detail', function(req, res, next) {
    model.connect(function(db) {
        db.collection("articles").find({"_id": ObjectID(req.query.id)}).toArray(function(err, result) {
            if (err) throw err;
            var data = result[0];
            data.time = moment(data.publishTime).format('YYYY-MM-DD hh:mm:ss');
            res.render('articleDetail', {article: data, username: req.session.username});
        })
    })
})

router.get('/del', function(req, res, next) {
    model.connect(function(db) {
        db.collection('articles').deleteOne({_id: ObjectID(req.query.id)}, function(err, obj) {
            if (err) throw err;
            res.redirect('/?page='+req.query.page);
        })
    })
})

router.post('/upload', function(req, res, next) {
    var form = new multiparty.Form();
    form.parse(req, function(err, field, files) {
        if (err) throw '文件上传失败' + err;
        var file = files.filedata[0];
        var rs = fs.createReadStream(file.path);
        var dstPath = '/uploads/' + file.originalFilename;
        var ws = fs.createWriteStream('./public' + dstPath);
        rs.pipe(ws);
        ws.on('close', function() {
            console.log('文件上传成功');
            res.send({err: '', msg: dstPath});
        })
    })
})

module.exports = router