const spicePg = require('spiced-pg');



const db = spicePg( process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/socialNetwork')

//Insert User information
exports.addUserUserInfo = function(firstName, lastName, email,password) {
    return db.query(
        `INSERT INTO userInfo (firstName, lastName, email,password)
        VALUES ($1, $2, $3,$4) RETURNING id`,
        [firstName, lastName, email,password]
    ).then(({rows})=>rows)
}