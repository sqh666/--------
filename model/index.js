var MongodbClient = require('mongodb').MongoClient;

var url = 'mongodb://localhost:27017/';
var dbName = 'articlesDBS';

function connect(callback){
    MongodbClient.connect(url, function(err, client) {
        if (err) throw '数据库连接错误' + err;
        var db = client.db(dbName);
        callback && callback(db);
        client.close();
    })
}

module.exports = {
    connect
}

