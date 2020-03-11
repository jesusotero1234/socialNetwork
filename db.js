const spicePg = require("spiced-pg");

const db = spicePg(
    process.env.DATABASE_URL ||
        "postgres://postgres:postgres@localhost:5432/socialNetwork"
);

////////////////////////////////////
////////////////////////////////////
////// userInfo Table Section //////
////////////////////////////////////
////////////////////////////////////

//Insert User information
exports.addUserUserInfo = function(firstName, lastName, email, password) {
    return db
        .query(
            `INSERT INTO userInfo (firstName, lastName, email,password)
        VALUES ($1, $2, $3,$4) RETURNING id`,
            [firstName, lastName, email, password]
        )
        .then(({ rows }) => rows);
};

//LogIn
exports.logIn = function(email) {
    return db
        .query(`SELECT email, password,id FROM userInfo WHERE email=$1`, [
            email
        ])
        .then(({ rows }) => rows);
};

//User Info
exports.userInfo = function(id) {
    return db
        .query(
            `SELECT email, firstName, lastName, imageUrl,id,bio FROM userInfo WHERE id=$1`,
            [id]
        )
        .then(({ rows }) => rows);
};

//Insert User image
exports.insertImage = function(imageUrl, id) {
    return db
        .query(
            `UPDATE userInfo 
        SET imageUrl=$1
        WHERE id=$2`,
            [imageUrl, id]
        )
        .then(({ rows }) => rows);
};

//SaveBio
exports.saveBio = function(id, bio) {
    return db
        .query(
            `UPDATE userInfo
        SET bio=$2 WHERE id=$1`,
            [id, bio]
        )
        .then(({ rows }) => rows);
};

//LastJoiners
exports.lastJoiners = function() {
    return db
        .query(
            `SELECT id, imageUrl, firstName, lastName FROM userInfo
        ORDER BY created_at DESC
        LIMIT 3
        `
        )
        .then(({ rows }) => rows);
};

//Search Users
exports.searchUsers = function(val) {
    return db
        .query(
            `SELECT firstName, lastName , id, imageUrl FROM userInfo
         WHERE firstName ILIKE $1;`,
            [val + "%"]
        )
        .then(({ rows }) => rows);
};

/////////////////////////////////////
/////////////////////////////////////
////// resetCode Table Section //////
/////////////////////////////////////
/////////////////////////////////////

//Insert Code from User
exports.insertCodeReset = function(code, email) {
    return db
        .query(
            `INSERT INTO resetCode (code, email)
         VALUES ($1,$2) 
         RETURNING code`,
            [code, email]
        )
        .then(({ rows }) => rows);
};

//Retrieve Code
exports.checkCode = function(email) {
    return db
        .query(
            `SELECT * FROM resetCode
        WHERE email=$1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes';`,
            [email]
        )
        .then(({ rows }) => rows);
};
// `SELECT * FROM resetCode
// WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes';`
//
// checkcode('jesusotero1234@gmail.com')//?

//Update Password
exports.updatePassword = function(password, email) {
    return db
        .query(
            `UPDATE userInfo 
        SET password=$1
        WHERE email=$2`,
            [password, email]
        )
        .then(({ rows }) => rows);
};

/////////////////////////////////////
/////////////////////////////////////
////// friendship Table Section /////
/////////////////////////////////////
/////////////////////////////////////

//Check Friendship status when component mount
exports.friendshipStatus = function(senderId, receiverId) {
    return db
        .query(
            `SELECT * FROM friendships
        WHERE (receiver_id=$1 AND sender_id=$2)
        OR (receiver_id=$2 AND sender_id=$1)
        `,
            [senderId, receiverId]
        )
        .then(({ rows }) => rows);
};

//Insert request for the first time
exports.sendFrienshipRequest = function(senderId, receiverId) {
    return db
        .query(
            `
         INSERT INTO friendships (sender_id, receiver_id)
         VALUES ($1,$2) `,
            [senderId, receiverId]
        )
        .then(({ rows }) => rows);
};


//Delete request before the other person accepting it
exports.deleteRequest = function(senderId, receiverId) {
    return db
        .query(
            `
            DELETE FROM friendships 
            WHERE sender_id=$1 AND receiver_id=$2;
          `,
            [senderId, receiverId]
        )
        .then(({ rows }) => rows);
};

//Accept request from the user 
exports.acceptRequest = function(senderId, receiverId) {
    return db
        .query(
            `UPDATE friendships 
            SET accepted=true
            WHERE sender_id=$1 AND receiver_id=$2;`,
            [senderId, receiverId]
        )
        .then(({ rows }) => rows);
};

