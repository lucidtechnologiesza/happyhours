const path = require('path');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');
const mkdirp = require('mkdirp')
const passEncrypt = require('bcryptjs');

const db = require('./config/db');
const mail = require('./config/mail');
const helper = require('./utils/helpers')

const app = express();

/** --- MIDDLEWARE ---- */
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true
  }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

const storage = multer.diskStorage({
    destination: function(req, file, cb) {

        if (file.fieldname == 'proof_of_pay') cb(null, './public/uploads/pop')

        if (file.fieldname == 'id_passport') cb(null, './public/uploads/id_passport')

        if (file.fieldname == 'prove_of_residence') cb(null, './public/uploads/por')

        if (file.fieldname == 'cliic_card') cb(null, './public/uploads/cliic_card')

        if (file.fieldname == 'certificate') cb(null, './public/uploads/certificate')

        if (file.fieldname == 'medical') cb(null, './public/uploads/medical')
    },
    filename: function(req, file, cb) {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
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

// CREATE DIRECTORIES ON SERVER
mkdirp.sync('./public/uploads/pop');
mkdirp.sync( './public/uploads/id_passport')
mkdirp.sync( './public/uploads/por')
mkdirp.sync( './public/uploads/cliic_card')
mkdirp.sync( './public/uploads/certificate')
mkdirp.sync('./public/uploads/medical')

/** --- MIDDLEWARE ---- */

app.post('/login', async (req, res) => {
    try {
        let details = await db.findAdminByUsername(req.body.username)
        let match = await passEncrypt.compare(req.body.pass, details.password);
        if (!match) {
            throw new Error("Incorrect username or password");
        }
        req.session.loggedin = true;
        const data = await helper.getApplicants();
        console.log("DATA", data);
        res.status(200).render('admin', data);
    } catch (error) {
        console.error("FORBIDEN : ", error.message);
        res.status(401).render('home');
    }
});

auth = (req, res, next) => {
    if (req.session.loggedin) {
        next();
    } else {
        console.log("UNAUTHORIZED LOGIN : ", req.body);
        res.status(400).render('home');
    }
}

app.get('/admin', auth, async(req, res) => {
    try {
        const data = await helper.getApplicants();
        console.log("DATA", data);
        res.status(200).render('admin', data);
    } catch (error) {
        console.error("AN ERROR HAS OCCURED. ", error.message);
        res.status(500).render('home');
    }
});

app.get('/home', (req, res) => {
    res.render('home');
})

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

                if (req.files.id_passport) {
                    req.files.id_passport.forEach(async docs => {
                        await helper.storeDocDetails(docs)
                    });
                }

                if (req.files.proof_of_pay) {
                    req.files.proof_of_pay.forEach(async docs => {
                        await helper.storeDocDetails(docs)
                    });
                }

                if (req.files.cliic_card) {
                    req.files.prove_of_residence.forEach(async docs => {
                        await helper.storeDocDetails(docs)
                    });
                }

                if (req.files.certificate) {
                    req.files.certificate.forEach(async docs => {
                        await helper.storeDocDetails(docs)
                    });
                }

                if (req.files.medical) {
                    req.files.medical.forEach(async docs => {
                        await helper.storeDocDetails(docs)
                    });
                }
                
                if (req.body.motherOrGuardianEmail) {
                    await mail(req.body.motherOrGuardianEmail,
                      'Happy Hours Registration',
                      `Thank you for registering with us`);    
                }

                if (req.body.fatherOrGuardianEmail) {
                    await mail(req.body.fatherOrGuardianEmail,
                      'Happy Hours Registration',
                      `Thank you for registering with us`);
                }

                res.status(200).render('home')
            } catch (error) {
                console.log(error.message);
                console.log("Error processing user information");
                res.status(500).render('home')
            }
        }
    })
})

app.all('*', (req, res) => {
    res.render('home');
});

module.exports = app;
