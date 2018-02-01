module.exports = function (app, Categories) {

    const multer = require('multer');
    const uuidv4 = require('uuid/v4');
    const fs = require('fs')

   // 이미지 파일 저장
    var storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, 'uploads/')
      },
      filename: function(req, file, cb){
        cb(null, rename(uuidv4(), file.originalname))
      }
    })

   // 파일 저장할 때 이름 변경
    var rename = function (uuid, original) {
        var _fileLen = original.length;
        var _lastDot = original.lastIndexOf('.');
        var _fileExt = original.substring(_lastDot, _fileLen).toLowerCase();

        var finalName = uuid+_fileExt

        return finalName
    }

    var upload = multer({storage : storage})

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
    app.post('/addCompanyinfo', function (req, res) {
        Categories.update({name: req.body.category}, {$addToSet: {company: {$each: req.body.company}}})
        .then((result) => {
            res.json({result: 1})
        }).catch((err) => {
            console.error(err);
        })
    })
 

    //사진 업데이트시 모두 다 업로드됨.
    app.post('/upload', upload.array('a'), function (req, res) {
        console.log(req);
        console.log(req.files);
        var arr = [];
        req.files.forEach(element => {
            arr.push({"url": element.path});
        });

        Categories.update({name: req.body.category}, {$addToSet: {company: {"name": req.body.company, "ename": req.body.ename, "images": arr, "site" : req.body.site, "sns" : req.body.sns, "video": req.body.video}}})
        .then((result) => {
            console.log('success');
        }).catch((err)=> {
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
    

    
    // 회사 정보 조회
    app.post('/getCompanyinfo', function (req, res) {
        var curCom = req.body.com; //현재 ename
        var name;
        var category;
        Categories.find({"company.ename" : curCom}, {_id: 0, name: 1, company: {$elemMatch: {"ename" : curCom}}})
        .then((result) => {
            res.json({"name" : result[0].company[0].name, "category": result[0].name, "images" : result[0].company[0].images, "site" : result[0].company[0].site, "video" : result[0].company[0].video, "sns" : result[0].company[0].sns})
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
        var origin = req.body.company.com // ename
        Categories.find({"company.ename" : origin}, {_id: 0, name: 1, company: {$elemMatch: {"ename" : origin}}})
        .then((result) => {
            res.json({"category" : result[0].name ,"name": result[0].company[0].name, "ename": result[0].company[0].ename, "images" : result[0].company[0].images, "site" : result[0].company[0].site, "sns" : result[0].company[0].sns, "video" : result[0].company[0].video})
        })
    })

    //회사 정보 수정
    app.put('/modifyCompanyinfo', function (req, res) {
        var newCompany = req.body.company;   //새로운 회사 이름
        var newEname = req.body.ename;       //새로운 ename
        var newCategory = req.body.category;    //새로운 카테고리
        var newSite = req.body.site;
        var newSns = req.body.sns;
        var newVideo = req.body.video;
        var news = new Categories();
        var files = req.body.files

            Categories.update({"company.ename" : newEname}, {$pull: { "company" : { "ename": newEname }}})
                .then((result) => {
                    Categories.update({"name": newCategory}, {$addToSet: {"company": {"name": newCompany, "ename": newEname, "images" : files, "site" : newSite, "sns" : newSns, "video" : newVideo}}})
                    .then((result) => {
                        console.log('modify success');
                    })
                }).catch((err) => {
                    console.error(err)
                })
    })
    

    //수정페이지에서 입력을 눌렀을때. -> 또한 모두 업데이트
    app.post('/modifyjustinfo', function (req, res) {
        var origin = req.body.origin.com;    //원래 ename <- 이걸로 쿼리 조회함
        var newCompany = req.body.company;   //새로운 회사 이름
        var newEname = req.body.ename;       //새로운 ename
        var newCategory = req.body.category;    //새로운 카테고리
        var newSite = req.body.site;
        var newSns = req.body.sns;
        var newVideo = req.body.video;
        var news = new Categories();
        var image = req.body.images 

        Categories.find({"company.ename" : origin }, {_id: 1, name: 1, company: {$elemMatch : {"ename": origin}}})
        .then((result) => {
                Categories.update({"company.ename" : origin}, {$pull: { "company" : { "ename": origin }}})
                .then((result) => {
                    Categories.update({"name": newCategory}, {$addToSet: {"company": {"name": newCompany, "ename": newEname, "images" : image, "video" : newVideo, "sns": newSns, "site": newSite}}})
                    .then((result) => {
                        console.log('modify success');
                    })
                }).catch((err) => {
                    console.error(err)
                })
        })
    })

    // 이미지 변경시 저장
    app.post('/modifyImage', upload.single('a'), function (req, res) {
        res.send({"path": req.file.path})
    })

    //카테고리 이름 수정
    app.put('/modifyCategoryinfo', function (req, res) {
        var origin = req.body.origin;
        var newCate = req.body.newCate;

        Categories.update({"name" : origin}, {$set: {"name" : newCate}})
        .then((result) => {
            console.log('modify success');
        }).catch((err) => {
            console.error(err)
        })
    })

    //카테고리 삭제
    app.put('/deleteCategory', function (req, res) {
        Categories.remove({"name": req.body.category})
        .then((res) => {
            console.log("success");
        })
    })

    //회사 삭제
    app.put('/deleteCompany', function (req, res) {
        console.log(req.body.company);
        Categories.update({"company.name" : req.body.company}, {$pull: {"company": {"name": req.body.company}}})
        .then((result) => {
            res.send("success")
        })
    })

}