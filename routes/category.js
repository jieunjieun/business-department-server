module.exports = function (app, Categories) {
    
    //카테고리 + 회사 리스트 조회
    app.get('/getlist', function (req, res) {
        Categories.find({},{_id: 0, name: 1, 'company.name' : 1, 'company.ename': 1}).select('name')
        .then((result) => {
            res.send(result)
        }).catch((err) => {
            console.error(err);
        })
    })

    //카테고리 추가
    app.post('/addCategories', function (req, res) {
        var news = new Categories();
        news.name = req.body.category;
        news.save()
        .then((result) => {
            res.json({result: 1})
        }).catch((err) => {
            console.error(err);
        })
    })
    //회사 정보 추가
    app.put('/addCompanyinfo', function (req, res) {
        Categories.update({name: req.body.category}, {$addToSet: {company: {$each: req.body.company}}})
        .then((result) => {
            res.json({result: 1})
        }).catch((err) => {
            console.error(err);
        })
    })
  
    // 카테고리 모든 정보
    app.get('/getCategory', function (req, res) {
        Categories.find().then( (result)=>{
            res.json(result)
        })
        .catch( (err) => {
            console.error(err)
        })
    })
    

    //회사 + 카테고리 구조 변경
    app.put('/modifyStructure', function (req, res) {
        Categories.update({}, {$set: req.body.data})
        .then( (result) => {
            console.log(result);
        }).error( (err) => {
            console.error(err)
        })
    })

    // 회사 정보 조회
    app.post('/getCompanyinfo', function (req, res) {
        var curCom = req.body.com;
        var name;
        var category;
        Categories.find({"company.ename" : curCom}, {_id: 0, name: 1, company: {$elemMatch: {"ename" : curCom}}})
        .then((result) => {
            res.json({"name" : result[0].company[0].name, "category": result[0].name})
        })
    })
    
    //검색
    app.post('/search', function (req, res) {
        var curCom = req.body.name;
        Categories.find({"company.name" : curCom}, {_id: 0, company: {$elemMatch: {"name" : curCom}}})
        .then((result) => {
            res.json({"ename" : result[0].company[0].ename})
        })
    })

    //수정하기 전 데이터 조회
    app.post('/modify', function (req, res) {
        var origin = req.body.company.com //원래 ename
        Categories.find({"company.ename" : origin}, {_id: 0, company: {$elemMatch: {"ename" : origin}}})
        .then((result) => {
            console.log(result[0].company[0].name);
            res.json({"name": result[0].company[0].name, "ename": result[0].company[0].ename})
        })
    })

    //회사 정보 수정
    app.put('/modifyCompanyinfo', function (req, res) {
        var origin = req.body.origin.com;    //원래 ename <- 이걸로 쿼리 조회함
        var newCompany = req.body.company;   //새로운 회사 이름
        var newEname = req.body.ename;       //새로운 ename
        var newCategory = req.body.category;    //새로운 카테고리
        var news = new Categories();
        
        Categories.find({"company.ename" : origin }, {_id: 1, name: 1, company: {$elemMatch : {"ename": origin}}})
        .then((result) => {
            if(result[0].name != newCategory) {
                Categories.update({"company.ename" : origin}, {$pull: { "company" : { "ename": origin }}})
                .then((result) => {
                    Categories.update({"name": newCategory}, {$addToSet: {"company": {"name": newCompany, "ename": newEname}}})
                    .then((result) => {
                        console.log('modify success');
                    })
                }).catch((err) => {
                    console.error(err)
                })
            }
            else {
                Categories.update({"company.ename" : origin}, {$set: {"company" : {"name": newCompany, "ename": newEname}}})
                .then((result) => {
                    console.log('success');
                })
            }
        })

    })
    //카테고리 이름 수정
    app.put('/modifyCategoryinfo', function (req, res) {
       
    })

    app.put('/deleteCategory', function (req, res) {
        Categories.remove({"name": req.body.category})
        .then((res) => {
            console.log("success");
            // res.json({result: 1})
        })
    })
}