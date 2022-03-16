const express = require('express');
const body_parser = require("body-parser")
const path = require('path')
const pug = require('pug');
var Notes = require("./database")
const updateRouter = require('./update-router');
const app = express()
const test = require('./mail.js')
const fs = require('fs-extra');
const multer = require('multer');
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, "views"));
app.use('/uploads', express.static('uploads'))
app.use(body_parser.urlencoded({
  extended: true
}));
app.use(body_parser.json());
app.use('/updatepage', updateRouter);
app.use((req, res, next) => {
  console.log(req.method + " : " + req.url);
  next();
})
/////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

app.get("/", (req, res, next) => {
  // console.log("get perfomed")
  //now find them
  res.redirect('/index')
})

//store the file
const storage = multer.diskStorage({destination:"uploads",
 filename:(req,file,cb)=>{
   cb(null,Date.now()+file.originalname)
 }
})
//We will use this when we upload on post request
const upload = multer({storage:storage}).single('image')


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

app.route("/notes-add")
  .get((req, res, next) => {
    res.render('notes-add');
  })
  .post(upload, (req, res, next) => {
    console.log(req.body);
    const Note = new Notes({})
    Note.title = req.body.title
    Note.description = req.body.description
    Note.mail = req.body.mail
    Note.img={data:req.file.filename,
    contentType:'image/png'}
    console.log("hello",req.file.filename)
          //save notes first
    Note.save((err,product)=>{
            if(err) console.log(err);
            console.log(product);
    })
    /////////////////
    //Send Mail
    test(req.body.mail,req.body.title,req.file.filename)

    res.redirect('/index')
  })

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

//When we get a get request we search for all enteris in the database and show it
app.get('/index', (req, res, next) => {


  Notes.find({}).exec((err, document) => {

    if (err) console.log(err);
    res.render('view', {
      data: document
    })
  })
})


//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

//DELETE
app.get("/delete/:__id", (req, res, next) => {
  //Deleting the file from upload
  Notes.findById(req.params.__id,(err,docs) => {
    if (err) console.log(err)
    // Fuck this is how you convert base64 encoded to string
    const base64 = docs.img.data
    const tostring  = Buffer.from(base64,'base64').toString('utf-8')
    //remove the file from upload with requested ID
    fs.unlink("uploads/"+tostring)

  })
  //Deleting everything else
  Notes.findByIdAndRemove(req.params.__id, {
    useFindAndModify: false
  }, (err) => {
    if (err){
      console.log(err)
    }else{
      console.log("Delete Successful")
    }

  })
  res.redirect('/index');

})

//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

//To update the particular id request, we are passing the id in the url
app.get('/updatepage/:__id', (req, res) => {
  console.log('id for get request: ' + req.id);
  Notes.findById(req.id, (err, document) => {
    console.log(document.title);

    res.render('updatepage', {
      data: document
    });
  })
})
//////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////

//we got the id to be updated, now update using the findByIdAndUpdate.

app.route('/updatepage').post(upload,(req, res, next) => {
  console.log('id: ' + req.id);

  Notes.findById(req.id,(err,docs) => {
    if (err) console.log(err)
    // Fuck this is how you convert base64 encoded to string
    const base64 = docs.img.data
    const tostring  = Buffer.from(base64,'base64').toString('utf-8')
    //remove the file from upload with requested ID
    fs.unlink("uploads/"+tostring)

  })


  Notes.findByIdAndUpdate(req.id, {
    title: req.body.title,
    description: req.body.description,
    img:{data:req.file.filename,
      contentType: 'image/png'
    }
  }, {
    useFindAndModify: false
  }, (err, document) => {
    console.log('updated');
  })
  res.redirect('/index');
  return next();
})

/*
  app.get('/updatepage/:__id',(req,res,next)=>{
    
  })
  */
app.listen(5000);