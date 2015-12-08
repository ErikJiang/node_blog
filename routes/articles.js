/**
 * Created by jiangink on 15/12/4.
 */
var check = require('./checkLogin');
var dbModel = require('../models/dbModel');
var articleModel = dbModel.articleModel;

/* GET articles listing. */
function router(app) {
    //get publish article page
    app.get('/publish.do', check.checkIsLogin);
    app.get('/publish.do', function (req, res, next) {
        res.render('publish', {
            user: req.session.user
        });
    });

    //publish an new article
    app.post('/publish.do', check.checkIsLogin);
    app.post('/publish.do', function(req, res, next) {
        var tags = [req.body.articleTag1, req.body.articleTag2, req.body.articleTag3],
            date = new Date(),
            time = {
                date: date,
                year: date.getFullYear(),
                month: date.getFullYear()+'-'+(date.getMonth()+1),
                day: date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
                minute: date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
                        +" "+date.getHours()+":"
                        +(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())
            };
        var article = new articleModel({
            title: req.body.articleTitle,
            author: req.session.user.userName,
            content: req.body.articleText,
            tags: tags,
            createTime: time
        });

        article.save(function (err, article) {
            if(err) {
                console.log(err);
                return res.render('publish', {
                    user: req.session.user,
                    errinfo: '提交失败'
                });
            }
            res.render('feedback', {
                user: req.session.user,
                type: 'publish',
                errinfo: null,
                successinfo: '文章已成功提交！'
            });
        });
    });

    //show an article
    app.get('/u/:author/:day/:title', function(req, res) {
        var conditions = {
            'title': req.params.title,
            'author': req.params.author,
            'createTime.day': req.params.day
        };
        articleModel.findOne(conditions, function(err, article) {
            if(err) {
                console.log(err);
                return res.send('find article err!');
            }
            if(article) {
                articleModel.update(conditions, {$inc: {"pv": 1}}, function(err) {
                    if(err) {
                        console.log(err);
                        return res.send('update article pv fail!');
                    }
                    res.render('article', {
                        user: req.session.user,
                        article: article
                    });
                });
            }
            else {
                res.send('find article null!');
            }
        });
    });

    //edit an article
    app.get('/edit/:name/:day/:title', check.checkIsLogin);
    app.get('/edit/:name/:day/:title', function(req, res) {
        var conditions = {
            'title': req.params.title,
            'author': req.params.name,
            'createTime.day': req.params.day
        };
        articleModel.findOne(conditions, function(err, article) {
            if(err) {
                console.log(err);
                return res.send('find article err!');
            }
            if(article) {
                res.render('edit', {
                    user: req.session.user,
                    article: article
                });
            }
            else {
                res.send('find article null!');
            }
        });
    });

    //article edit and submit
    app.post('/edit.do', function(req, res) {
        var tags = [req.body.articleTag1, req.body.articleTag2, req.body.articleTag3],
            date = new Date(),
            time = {
                date: date,
                year: date.getFullYear(),
                month: date.getFullYear()+'-'+(date.getMonth()+1),
                day: date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate(),
                minute: date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
                +" "+date.getHours()+":"
                +(date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes())
            };
        var conditions = {
            'title': req.body.priTitle,
            'author': req.body.priAuthor,
            'createTime.day': req.body.priTime
        };
        var update = {
            title: req.body.articleTitle,
            content: req.body.articleText,
            tags: tags,
            createTime: time
        };

        articleModel.findOneAndUpdate(conditions, update, function(err) {
            if(err) {
                console.log(err);
                return res.send('更新文章失败！');
            }
            res.render('feedback', {
                user: req.session.user,
                type: 'publish',
                errinfo: null,
                successinfo: '文章已成功修改！'
            });
        });
    });

    //remove an article
    app.get('/remove/:name/:day/:title', function(req, res) {
        var conditions = {
            'title': req.params.title,
            'author': req.params.name,
            'createTime.day': req.params.day
        };
        articleModel.findOneAndRemove(conditions, function(err) {
            if(err) {
                console.log(err);
                return res.send('删除该文章失败！');
            }
            res.render('feedback', {
                user: req.session.user,
                type: 'publish',
                errinfo: null,
                successinfo: '已删除该文章！'
            });
        });
    });
}

module.exports = router;