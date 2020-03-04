const spicePg = require('spiced-pg');



const db = spicePg( process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/socialNetwork')


////////////////////////////////////
////////////////////////////////////
////// userInfo Table Section //////
////////////////////////////////////
////////////////////////////////////


//Insert User information
exports.addUserUserInfo = function(firstName, lastName, email,password) {
    return db.query(
        `INSERT INTO userInfo (firstName, lastName, email,password)
        VALUES ($1, $2, $3,$4) RETURNING id`,
        [firstName, lastName, email,password]
    ).then(({rows})=>rows)
}

//LogIn
exports.logIn =function(email) {
    return db.query(
        `SELECT email, password,id FROM userInfo WHERE email=$1`,[email]
    ).then(({rows})=>rows)
}




/////////////////////////////////////
/////////////////////////////////////
////// resetCode Table Section //////
/////////////////////////////////////
/////////////////////////////////////

//Insert Code from User
exports.insertCodeReset =function(code, email) {
    return db.query(
        `INSERT INTO resetCode (code, email)
         VALUES ($1,$2) 
         RETURNING code`,[code,email]
    ).then(({rows})=>rows)
}

//Retrieve Code
exports.checkCode =function() {
    return db.query(
        `SELECT * FROM resetCode
        WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes';`
        
    ).then(({rows})=>rows)
}


//Update Password
exports.updatePassword =function(password,email) {
    return db.query(
        `UPDATE userInfo 
        SET password=$1
        WHERE email=$2`,
        [password,email]
    ).then(({rows})=>rows)
}
