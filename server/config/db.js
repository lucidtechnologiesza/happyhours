var mysql = require('mysql');
require('dotenv/config');

const con = mysql.createConnection(
  {
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    reconnect: true
  }
);

// con.connect(function(err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

// console.log(con);

/*                                        Queries                                                 */
const Sql = `CREATE TABLE IF NOT EXISTS heroku_b72c9f1df3e1f56.happy_hours(
  user_id int(11) NOT NULL AUTO_INCREMENT  PRIMARY KEY,
  aboutUs varchar(50),
  childSurname varchar(50),
  childName varchar(50),
  childKnownAs varchar(50),
  childDateOfBirth varchar(50),
  childGender varchar(10),
  childRace varchar(50),
  childReligion varchar(50),
  childEnrolmentDate varchar(50),
  childAllergies varchar(50),
  previousPreSchool varchar(100),
  childDurationDate varchar(50),
  childHomeLanguage varchar(50),
  importantInformation varchar(255),
  motherOrGuardianTitle varchar(10),
  motherOrGuardianName varchar(50),
  motherOrGuardianSurname varchar(50),
  motherOrGuardianIdNumber varchar(20),
  motherOrGuardianRelationship varchar(50),
  motherOrGuardianResidential varchar(50),
  motherOrGuardianPostal varchar(50),
  motherOrGuardianHomeTel varchar(20),
  motherOrGuardianWorkTel varchar(20),
  motherOrGuardianCell varchar(20),
  motherOrGuardianEmail varchar(50),
  motherOrGuardianOccupation varchar(255),
  fatherOrGuardianTitle varchar(10),
  fatherOrGuardianName varchar(50),
  fatherOrGuardianSurname varchar(50),
  fatherOrGuardianIdNumber varchar(20),
  fatherOrGuardianRelationship varchar(50),
  fatherOrGuardianResidential varchar(100),
  fatherOrGuardianPostal varchar(100),
  fatherOrGuardianHomeTel varchar(10),
  fatherOrGuardianWorkTel varchar(10),
  fatherOrGuardianCell varchar(10),
  fatherOrGuardianEmail varchar(50),
  fatherOrGuardianOccupation varchar(50),
  emergencyContactName_1 varchar(50),
  emergencyContact_1 varchar(20),
  emergencyContactName_2 varchar(50),
  emergencyContact_2 varchar(20),
  agree varchar(10)
)`;
/*                                        End of Queries                                          */

con.connect((connectErr) => {
  if (connectErr) {
    console.log(`${connectErr} `)
    throw connectErr;
  }
  console.log("CONNECTED TO DATABASE " + con["database"])
  
  con.query(
    `${Sql};`,
    (UsersErr) => {
      if (UsersErr) throw UsersErr;
      console.info('Tables created');
    }
  );
});

var HappyHours = {};

HappyHours.insert = function (data) {
  return new Promise(function(resolve, reject) {
    con.query(
      'INSERT INTO con.database.happy_hours SET ?',
      data,
      function(error, results) {
        if (error) return reject(error);
        return resolve(results[0]);
      }
    )
  });
}

module.exports = HappyHours;