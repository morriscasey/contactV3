var express = require('express');
var router = express.Router();

/* GET contacts page */
router.get('/', function(req,res){
  var db = req.db;
  var collection = db.get('contacts');
  collection.find({}, {}, function(e, docs){
    res.render('contactlist', {"contactlist":docs});
  });
});

/* GET new contact */
router.get('/newcontact', function(req, res){
 res.render('newcontact', { title: 'Add New Contact', message: '',errors: {} });
});

/* GET edit contact */
router.get('/edit/:ID', function(req, res){
  var db = req.db;
  var collection = db.get('contacts');
  collection.findOne({_id: req.params.ID}, function(err, contact){
    res.render('editcontact', {"contact":contact});
  });
});

/* POST reqst to edit contact*/
router.post('/editcontact/:ID', function(req,res){
  var db= req.db;
  var collection = db.get('contacts');
  if(req.body.button == "no"){
    res.location("/");
    res.redirect("/");
  } else {

  // Get form values
 var firstName = req.body.firstname;
 var lastName = req.body.lastname;
 var company = req.body.company;
 var title = req.body.title;
 var email = req.body.email;
 var number = req.body.number;
 var date = req.body.date;
 var whereMet = req.body.wheremet;
 var notes = req.body.notes;

 collection.update(
  {_id: req.params.ID},
  {
   "name" : {"first": firstName, "last" : lastName},
   "company": company,
   "title": title,
   "email": email,
   "number": number,
   "date": date,
   "wheremet": whereMet,
   "notes": notes
 },function(err){
   if(err){
     res.send(err);
   } else {
     res.location("/");
     res.redirect("/");
   }
 });
}
  
});

/* GET edit contact */
router.get('/delete/:ID', function(req, res){
  var db = req.db;
  var collection = db.get('contacts');
  collection.findOne({_id: req.params.ID}, function(err, contact){
    res.render('deletecontact', {"contact":contact});
  });
});

/* POST reqst to delete contact*/
router.post('/deletecontact/:ID', function(req,res){
  var db= req.db;
  var collection = db.get('contacts');
  if(req.body.button == "no"){
    res.location("/");
    res.redirect("/");
  } else {
  collection.remove(
  {_id: req.params.ID},
  {
    justOne: true  
  },function(err){
    if(err){
      res.send(err);
    } else {
      res.location("/");
      res.redirect("/");
    }
  });
}
});


/* POST to add a new contact*/
router.post('/addcontact', function(req,res){
 
 
 //Validation
 req.assert('firstname', 'First name is required').notEmpty();
 req.assert('lastname','Last name is required').notEmpty();
 req.assert('email', 'Email invalid').isEmail();
 
 var date = req.body.date;
//Check to see if date is empty
if(!date){
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();

  if(dd<10) {
      dd='0'+dd
  } 

  if(mm<10) {
      mm='0'+mm
  } 

  date = mm+'/'+dd+'/'+yyyy;
  

 } else {
   req.assert('date', date).isDate({format: 'DD-MM-YYYY'});
 }

 var errors = req.validationErrors();
 if(!errors){
  //No errors than pass validation
 var db = req.db;
 
 // Get form values
 var firstName = req.body.firstname;
 var lastName = req.body.lastname;
 var company = req.body.company;
 var title = req.body.title;
 var email = req.body.email;
 var number = req.body.number;
     
 var whereMet = req.body.wheremet;
 var notes = req.body.notes;
  //Set Collection
 var collection = db.get('contacts');
 //Check to see if date is empty and put today's date
 
 
 //Submit to DB
 collection.insert({
 "name" : {"first": firstName, "last" : lastName},
 "company": company,
 "title": title,
 "email": email,
 "number": number,
 "date": date,
 "wheremet": whereMet,
 "notes": notes
  }, function (err,doc){
       if(err){
         //if failed return error
         res.send("There was a problem adding the information to the database.")
       }
       else {
         res.location("/");
         res.redirect("/");
       }
      });
 } else {
  //Display errors
  res.render('newcontact', 
    { title: 'Add New Contact',
      message: 'Opps! Missing Something!',
      errors :errors,
      firstname: req.body.firstname
    });
 }
 
 
});


module.exports = router;
