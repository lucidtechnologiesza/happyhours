var mysql = require('mysql');
require('dotenv/config');

var db_config = {
    connectionLimit: 1000,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    reconnect: true,
}

var con = null;

function dbConnect() {
    con = mysql.createConnection(db_config); // Recreate the connection, since
    // the old one cannot be reused.
    con.connect(function(err) { // The server is either down
        if (err) { // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(dbConnect, 2000); // We introduce a delay before attempting to reconnect,
        } // to avoid a hot loop, and to allow our node script to
    }); // process asynchronous requests in the meantime.
    // If you're also serving http, display a 503 error.
    con.on('error', function(err) {
        //console.log('db error', "reconnecting");
        if (err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
            dbConnect(); // lost due to either server restart, or a
        } else { // connnection idle timeout (the wait_timeout
            throw err; // server variable configures this)
        }
    });
}
dbConnect();

/*                                        Queries                                                 */
const Sql = `CREATE TABLE IF NOT EXISTS ` + db_config.database + `.happy_hours(
  applicant_id int NOT NULL AUTO_INCREMENT  PRIMARY KEY,
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
  Categories varchar(20),
  babiesCategories varchar(20),
  afterschlcare varchar(20),
  casualday_holidaycare varchar(20),
  Pottytraining varchar(20),
  agree varchar(10)
);`;

const admin = `CREATE TABLE IF NOT EXISTS ${db_config.database}.admin(
    user_id int NOT NULL AUTO_INCREMENT  PRIMARY KEY,
    username varchar(10),
    password varchar(1000)
);`

const documents = `CREATE TABLE IF NOT EXISTS ${db_config.database}.documents(
    document_id int NOT NULL AUTO_INCREMENT,
    applicant_id int,
    document_name varchar(255),
    document_type varchar(100),
    document_path varchar(255),
    PRIMARY KEY (document_id),
    FOREIGN KEY (applicant_id) REFERENCES happy_hours(applicant_id)
);`;

createTable = function(sql) {
    return new Promise(function(resolve, reject) {
        con.query(
            sql,
            function(error, results) {
                if (error) return reject(error);    
                console.info('Table created');
                return resolve(results[0]);
            }
        )
    });
}

var HappyHours = {};

HappyHours.insert = function(data) {
    return new Promise(function(resolve, reject) {
        con.query(
            `INSERT INTO ${process.env.DB_NAME}.happy_hours SET ?`,
            data,
            function(error, results) {
                if (error) return reject(error);
                return resolve(results.insertId);
            }
        )
    });
}

HappyHours.documents = function(id, doc_name, doc_type, doc_path) {
    return new Promise(function(resolve, reject) {
        con.query(
            `INSERT INTO ${process.env.DB_NAME}.documents(applicant_id, document_name, document_type, document_path)
                VALUES (?,?,?,?)`,
            [id, doc_name, doc_type, doc_path],
            function(error, results) {
                if (error) return reject(error);
                console.log(results);
                return resolve(results[0]);
            }
        )
    });
}

HappyHours.getData = function() {
    return new Promise(function(resolve, reject) {
        con.query(
            `SELECT * FROM ${process.env.DB_NAME}.happy_hours`,
            function(error, results) {
                if (error) return reject(error);
                return resolve(results);
            }
        )
    });
}

const setupAPP = async () => {
    try {
      await createTable(Sql) // apllication schema
      await createTable(admin) // admin user too login
      await createTable(documents) // document names and location
    } catch (error) {
        console.error('COULD NOT CREATE TABLES', error);
    }
  }
  
  setupAPP()

module.exports = HappyHours;
