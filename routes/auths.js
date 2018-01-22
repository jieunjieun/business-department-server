module.exports = function (app, Auths) {
    // app.post('/signup', function (req, res) {
    //     var manager = new Auths();
    //     manager.id = req.body.id;
    //     manager.password = req.body.password;
        
    //     manager.save(function (err) {
    //         if(err) {
    //             console.error(err);
    //             res.json({result: 0});
    //             return;
    //         }
    //         res.json({result: 1});
    //     });
    // });

    // 로그인
    app.post('/login', function (req, res, next) {
    
       var inputId = req.body.id;
       var inputPw = req.body.password

       Auths.find({}, {_id: 0, id: 1, password: 1}, function (error, result) {
           if(error) return res.status(500).json({error: err});
           if(result.length === 0) return res.status(404).json({error: 'no auths'})

           var id = result[0].id;
           var password = result[0].password

          if(inputId === id && inputPw === password) {
            console.log(inputId);
            req.session.username = inputId;
            console.log(req.session.username);
            res.send({"result": 1})
            } else if(inputId === id && inputPw != password ) {
                res.send("Pw wrong")
            } else if(inputId != id && inputPw === password) {
                res.send("Id wrong")
            } else if(inputid != id && inputPw != password ) {
                res.send('no user')
            }
       })
    })

    //로그아웃 
    app.get('/logout', function (req, res) {
        if(req.session.username) {
            req.session.destroy(function (err) {
                if(err) {
                    console.log(err);
                } else {
                    res.send('logout successfully')
                }
            })
        }else {
            res.send('no session')
        }
    })

    //세션 확인 
    app.get('/edit', function (req, res) {
        if(req.session.username) {
            res.send('yes')
        } else {
            res.send('no')
        }
    })
}