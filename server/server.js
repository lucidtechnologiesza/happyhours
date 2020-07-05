var path = require('path');
var express =  require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var db = require('./config/db');
var mail = require('./config/mail');

const app = express();

/** --- middleware ---- */

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

/** --- middleware ---- */

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'dest/')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now())
  }
});

var upload = multer({storage: storage});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/admin', (req, res) => {
  res.render('admin');
})

app.post('/login', (req, res) => {
  console.log(req.body);
  res.render('home');
});

app.post('/register',  upload.single('file'), async (req, res) => {
  console.log(req.body);
  try {
    await db.insert({
      childSurname: req.body.childSurname,
      childName:  req.body.childName,
      childGender: req.body.childGender,
      childDateOfBirth:  req.body.childDateOfBirth,
      childRace:  req.body.childRace,
      childEnrolmentDate:  req.body.childEnrolmentDate,
      childReligion:  req.body.childReligion,
      childHomeLanguage:  req.body.childHomeLanguage,
      childAllergies:  req.body.childAllergies,
      previousPreSchool:  req.body.previousPreSchool,
      childDurationDate:  req.body.childDurationDate,
      importantInformation:  req.body.importantInformation,
      motherOrGuardianTitle:  req.body.motherOrGuardianTitle,
      motherOrGuardianSurname:  req.body.motherOrGuardianSurname,
      motherOrGuardianName:  req.body.motherOrGuardianName,
      motherOrGuardianIdNumber:  req.body.motherOrGuardianIdNumber,
      motherOrGuardianRelationship:  req.body.motherOrGuardianRelationship,
      motherOrGuardianHomeTel:  req.body.motherOrGuardianHomeTel,
      motherOrGuardianResidential:  req.body.motherOrGuardianResidential,
      motherOrGuardianPostal:  req.body.motherOrGuardianPostal,
      motherOrGuardianEmail:  req.body.motherOrGuardianEmail,
      motherOrGuardianOccupation:  req.body.motherOrGuardianOccupation,
      fatherOrGuardianTitle:  req.body.fatherOrGuardianTitle,
      fatherOrGuardianSurname:  req.body.fatherOrGuardianSurname,
      fatherOrGuardianName:  req.body.fatherOrGuardianName,
      fatherOrGuardianIdNumber: req.body.fatherOrGuardianIdNumber,
      fatherOrGuardianRelationship:  req.body.fatherOrGuardianRelationship,
      fatherOrGuardianHomeTel: req.body.fatherOrGuardianHomeTel,
      fatherOrGuardianResidential:  req.body.fatherOrGuardianResidential,
      fatherOrGuardianPostal:  req.body.fatherOrGuardianPostal,
      fatherOrGuardianEmail:  req.body.fatherOrGuardianEmail,
      fatherOrGuardianOccupation:  req.body.fatherOrGuardianOccupation,
      emergencyContactName_1:  req.body.emergencyContactName_1,
      emergencyContact_1:  req.body.emergencyContact_1,
      emergencyContactName_2:  req.body.emergencyContactName_2,
      emergencyContact_2:  req.body.emergencyContact_2,
      agree: req.body.agree
    });

    console.log(req.body.motherOrGuardianEmail);
    console.log(req.body.fatherOrGuardianEmail);

    await mail(req.body.motherOrGuardianEmail,
      'Happy Hours Registration',
      `Thank you for registering with us`);

    await mail(req.body.fatherOrGuardianEmail,
      'Happy Hours Registration',
      `Thank you for registering with us`);

  } catch (e) {
    console.log(e.message);
  }
    res.render('home');
});

app.all('*', (req, res) => {
    res.render('home');
});
module.exports = app;
