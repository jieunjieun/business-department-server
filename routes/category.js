module.exports = function (app, Categories) {
    app.post('/addCategories', function (req, res){
        var news = new Categories();
        news.name = req.body.category;
        news.save(function (err) {
            if(err) {
                console.error(err);
                res.json({result: 0});
                return;
            }
            res.json({result: 1})
        })
    })


    // app.post('/addCompanyinfo', function (req, res){
    //     var news = new Categories();
    //     news.company = req.body.category
    //     // {
    //     //     "category":
    //     //     [
    //     //     {
    //     //     "name": "company1",
    //     //     "url": "urlurlurl",
    //     //     "images": ["hello"]
    //     //     }
    //     //     ]
            
    //     // }
    //     news.save(function (err) {
    //         if(err) {
    //             console.error(err);
    //             res.json({result: 0});
    //             return;
    //         }
    //         res.json({result: 1})
    //     })
    // })

    app.put('/addCompanyinfo', function (req, res) {
        Categories.update({name: req.body.category},{$addToSet: {company: {$each: req.body.company}}}, function (err, result) {
            if(err) {
                console.error(err);
                res.json({result: 0});
                return;
            }
            res.json({result: 1})
        })
    })
    // app.post('/add', function (req, res){
    //     var news = new Categories();
    //     news.name = req.body.catename;
    //     news.company = req.body.company
    //     news.save(function (err) {
    //         if(err) {
    //             console.error(err);
    //             res.json({result: 0});
    //             return;
    //         }
    //         res.json({result: 1})
    //     })
    // })

    // app.put('/updatecompany', function (req, res) {
    //     var news = new Categories();
    //     news.find(req.body.catename, function (err) {
    //         news.company = req.body.company
    //     })
    //     news.save(function (err) {
    //         if(err) {
    //             console.error(err);
    //             res.json({result: 0});
    //             return;
    //         }
    //         res.json({result: 1})
    //     })
    // })

    app.get('/getCategory', function (req, res) {
        Categories.find(function (err,category) {
            var cateMap = {};
            category.forEach(function (cate) {
                cateMap[cate.name] = cate;
            });
           
            if(err) {
                console.error(err);
                res.json({result: 0});
                return;
            }

            res.json(cateMap)
            
        })
    })
}