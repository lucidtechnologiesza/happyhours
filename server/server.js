var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var db = require('./config/db');
var mail = require('./config/mail');
var path = require('path')

const app = express();

/** --- middleware ---- */

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

/** --- middleware ---- */

var storage = multer.diskStorage({
    destination: function(req, file, cb) {

        if (file.fieldname == 'proof_of_pay') cb(null, './public/uploads/pop')

        if (file.fieldname == 'id_passport') cb(null, './public/uploads/id_passport')

        if (file.fieldname == 'prove_of_residence') cb(null, './public/uploads/por')

        if (file.fieldname == 'cliic_card') cb(null, './public/uploads/cliic_card')

        if (file.fieldname == 'certificate') cb(null, './public/uploads/certificate')

        if (file.fieldname == 'medical') cb(null, './public/uploads/medical')
    },
    filename: function(req, file, cb) {
        console.log(file);
        cb(null, `Document` + '-' + Date.now() + '.pdf')
    }
});

var upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 },
    fileFilter: function(req, file, cb) {
        checkFileType(file, cb);
    }
}).fields([
    { name: 'proof_of_pay', maxCount: 1 },
    { name: 'id_passport', maxCount: 2 },
    { name: 'prove_of_residence', maxCount: 1 },
    { name: 'cliic_card', maxCount: 1 },
    { name: 'certificate', maxCount: 1 },
    { name: 'medical', maxCount: 1 }
]);

function checkFileType(file, cb) {
    const filetypes = /pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: pdf\'s Only!');
    }
}

app.post('/login', (req, res) => {
    console.log(req.body);
    res.render('home');
});


app.get('/admin', async(req, res) => {
    let info = {};
    var data = await db.getData();
    info.users = data;
    res.render('admin', info);
});

app.get('/register', (req, res) => {
    res.render('register', {
        status: false,
        type: 'primary',
        message: ''
    });
});

app.post('/register', async(req, res) => {
    let progress = {
        status: false,
        type: '',
        message: ''
    };
    res.status(500).render('register', progress)

    upload(req, res, async(err) => {
        if (err instanceof multer.MulterError) {
            if (err.code === 'LIMIT_UNEXPECTED_FILE') {
                progress.status = true;
                progress.type = 'danger'
                progress.message = 'Form not subimitted, Please do not provide not more than 2 copy of passport or ID'
                console.log('multer: ', err);
                res.status(400).render('register', progress)
            }
        } else if (err) {
            progress.status = true;
            progress.type = 'danger'
            progress.message = 'Form not subimitted, Please provide valid documents...'
            console.log('error: ', err);
            res.status(500).render('resigster', progress)
        } else {
            try {
                const applicat_id = await db.insert({
                    childSurname: req.body.childSurname,
                    childName: req.body.childName,
                    childGender: req.body.childGender,
                    childDateOfBirth: req.body.childDateOfBirth,
                    childKnownAs: req.body.childKnownAs,
                    childRace: req.body.childRace,
                    childEnrolmentDate: req.body.childEnrolmentDate,
                    childReligion: req.body.childReligion,
                    childHomeLanguage: req.body.childHomeLanguage,
                    childAllergies: req.body.childAllergies,
                    previousPreSchool: req.body.previousPreSchool,
                    childDurationDate: req.body.childDurationDate,
                    importantInformation: req.body.importantInformation,
                    //mother details
                    motherOrGuardianTitle: req.body.motherOrGuardianTitle,
                    motherOrGuardianSurname: req.body.motherOrGuardianSurname,
                    motherOrGuardianName: req.body.motherOrGuardianName,
                    motherOrGuardianIdNumber: req.body.motherOrGuardianIdNumber,
                    motherOrGuardianRelationship: req.body.motherOrGuardianRelationship,
                    motherOrGuardianHomeTel: req.body.motherOrGuardianHomeTel,
                    motherOrGuardianWorkTel: req.body.motherOrGuardianWorkTel,
                    motherOrGuardianCell: req.body.motherOrGuardianCell,
                    motherOrGuardianResidential: req.body.motherOrGuardianResidential,
                    motherOrGuardianPostal: req.body.motherOrGuardianPostal,
                    motherOrGuardianEmail: req.body.motherOrGuardianEmail,
                    motherOrGuardianOccupation: req.body.motherOrGuardianOccupation,
                    //father's details
                    fatherOrGuardianTitle: req.body.fatherOrGuardianTitle,
                    fatherOrGuardianSurname: req.body.fatherOrGuardianSurname,
                    fatherOrGuardianName: req.body.fatherOrGuardianName,
                    fatherOrGuardianIdNumber: req.body.fatherOrGuardianIdNumber,
                    fatherOrGuardianRelationship: req.body.fatherOrGuardianRelationship,
                    fatherOrGuardianHomeTel: req.body.fatherOrGuardianHomeTel,
                    fatherOrGuardianWorkTel: req.body.fatherOrGuardianWorkTel,
                    fatherOrGuardianCell: req.body.fatherOrGuardianCell,
                    fatherOrGuardianResidential: req.body.fatherOrGuardianResidential,
                    fatherOrGuardianPostal: req.body.fatherOrGuardianPostal,
                    fatherOrGuardianEmail: req.body.fatherOrGuardianEmail,
                    fatherOrGuardianOccupation: req.body.fatherOrGuardianOccupation,
                    //emergency contact
                    emergencyContactName_1: req.body.emergencyContactName_1,
                    emergencyContact_1: req.body.emergencyContact_1,
                    emergencyContactName_2: req.body.emergencyContactName_2,
                    emergencyContact_2: req.body.emergencyContact_2,
                    // agreement
                    agree: req.body.agree
                });

                // console.log(req.body.motherOrGuardianEmail);
                // console.log(req.body.fatherOrGuardianEmail);

                // await mail(req.body.motherOrGuardianEmail,
                //   'Happy Hours Registration',
                //   `Thank you for registering with us`);

                // await mail(req.body.fatherOrGuardianEmail,
                //   'Happy Hours Registration',
                //   `Thank you for registering with us`);



                console.log(req.files); // use this to store the file names in the database.
                res.status(200).render('register', progress)

            } catch (error) {
                console.log(error.message);
                console.log("Error processing user information");
            }
        }
    })
})

app.all('*', (req, res) => {
    res.render('home');
});

module.exports = app;