
/* GET users listing. */
function router(app){
    app.get('/users', function(req, res, next) {
        res.send('respond with a resource');
    });
}

module.exports = router;
