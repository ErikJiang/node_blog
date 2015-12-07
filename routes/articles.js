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
                    errinfo: '发表失败'
                });
            }
            res.render('feedback', {
                user: req.session.user,
                type: 'publish',
                errinfo: null,
                successinfo: '文章已成功发表！'
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
        });
    });
}

module.exports = router;