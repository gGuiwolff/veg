const spicedPg = require("spiced-pg");

const db = spicedPg(process.env.DATABASE_URL);

module.exports.registerUser = (first_name, last_name, email, password) => {
    const query = `
    INSERT INTO users (first_name, last_name, email, password)  
    VALUES ($1, $2, $3, $4)
    RETURNING id, first_name;
    `;
    const params = [first_name, last_name, email, password];
    return db.query(query, params);
};

module.exports.getPassword = (email) => {
    const query = `SELECT * FROM users WHERE email = $1;`;
    const params = [email];
    return db.query(query, params);
};

module.exports.addResetCode = (email, code) => {
    const query = `
    INSERT INTO password_reset_codes (email, code)
    VALUES ($1, $2);
    `;
    const params = [email, code];
    return db.query(query, params);
};

module.exports.getResetCode = (email) => {
    const params = [email];
    const query = `
    SELECT * FROM password_reset_codes
    WHERE email = $1
    ORDER BY created_at DESC
    LIMIT 1;
    `;

    return db.query(query, params);
};

module.exports.changePassword = (password, email) => {
    const params = [password, email];
    const query = `
    UPDATE users
    SET password = $1
    WHERE email = $2;`;
    return db.query(query, params);
};

module.exports.addImage = (id, url) => {
    const params = [id, url];
    const query = `
    UPDATE users
    SET profile_picture = $2
    WHERE id = $1
    RETURNING profile_picture;
    `;
    return db.query(query, params);
};

module.exports.addBio = (id, bio) => {
    const params = [id, bio];
    const query = `
    UPDATE users
    SET bio = $2
    WHERE id = $1
    RETURNING bio;
    `;
    return db.query(query, params);
};

module.exports.getUser = (userId) => {
    const params = [userId];
    const query = `
    SELECT id, first_name, last_name, profile_picture, email, bio FROM users
    WHERE id = $1;
    `;
    return db.query(query, params);
};

module.exports.getOtherUser = (id) => {
    const params = [id];
    const query = `
    SELECT first_name, last_name, bio, profile_picture FROM users
    WHERE id = $1
    `;
    return db.query(query, params);
};

module.exports.latestUsers = () => {
    return db.query(`
    SELECT id, first_name, last_name, profile_picture FROM users ORDER BY id DESC LIMIT 5;
    `);
};

module.exports.searchUsers = (userInput) => {
    return db.query(
        `SELECT id, first_name, last_name, profile_picture FROM users WHERE first_name ILIKE $1 OR last_name ILIKE $1 ORDER BY id DESC LIMIT 20;`,
        [userInput + "%"]
    );
};

module.exports.getFriendStatus = (userId, otherUserId) => {
    const params = [userId, otherUserId];
    return db.query(
        `SELECT * FROM friendships WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1);`,
        params
    );
};

module.exports.addFriend = (userId, otherUserId) => {
    const params = [userId, otherUserId];
    return db.query(
        `INSERT INTO friendships (sender_id, recipient_id) 
        VALUES ($1, $2) RETURNING 2;`,
        params
    );
};

module.exports.acceptFriend = (userId, otherUserId) => {
    const params = [userId, otherUserId];
    return db.query(
        `UPDATE friendships
        SET accepted = TRUE
        WHERE recipient_id = $1 AND sender_id = $2 RETURNING 1;`,
        params
    );
};

module.exports.cancelFriend = (userId, otherUserId) => {
    const params = [userId, otherUserId];
    return db.query(
        `DELETE FROM friendships WHERE sender_id = $1 AND recipient_id = $2 RETURNING 0;`,
        params
    );
};

module.exports.unfriend = (userId, otherUserId) => {
    const params = [userId, otherUserId];
    return db.query(
        `DELETE FROM friendships WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1) RETURNING 0;`,
        params
    );
};

module.exports.getFriends = (userId) => {
    const params = [userId];
    return db.query(
        `SELECT users.id, first_name, last_name, profile_picture, accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND recipient_id = users.id);`,
        params
    );
};

module.exports.getChatMessages = () => {
    return db.query(
        `SELECT chat_messages.id AS id, user_id, message, created_at, first_name, last_name, profile_picture
        FROM chat_messages
        JOIN users ON user_id = users.id
        ORDER BY created_at DESC
        LIMIT 10`
    );
};

module.exports.addChatMessage = (user_id, message) => {
    const params = [user_id, message];
    return db.query(
        `
        WITH inserted AS (
        INSERT INTO chat_messages (user_id, message) 
        VALUES ($1, $2) 
        RETURNING id, user_id, message, created_at)
        SELECT inserted.*, users.first_name, users.last_name, users.profile_picture
        FROM inserted
        INNER JOIN users ON inserted.user_id = users.id
        `,
        params
    );
};

module.exports.getPrivateMessages = (userId, otherUserId) => {
    const params = [userId, otherUserId];
    return db.query(
        `
        SELECT * 
        FROM private_messages
        WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1)
        ORDER BY created_at DESC;
        `,
        params
    );
};

module.exports.addPrivateMessage = (userId, message, to) => {
    const params = [userId, message, to];
    return db.query(
        `
        INSERT INTO private_messages (sender_id, message, recipient_id ) 
        VALUES ($1, $2, $3)
        RETURNING id, message, sender_id, recipient_id, created_at;
        `,
        params
    );
};

module.exports.getAllPrivateMessages = (userId) => {
    const params = [userId];
    return db.query(
        `
        SELECT * 
        FROM private_messages
        WHERE recipient_id = $1 OR sender_id = $1
        ORDER BY created_at DESC;
        `,
        params
    );
};
// ABRE TESTE ========================
/*module.exports.postImages = () => {
    try {
        const  description  = req.body.description.url;
        const newImage = await db.query(
          "INSERT INTO userimages (id, description) VALUES ($1, $2) RETURNING *",
          [req.user.id, description]
        );
        res.json(newImage);
       } catch (err) {
        console.error(err.message);
    }
}
teste 2*/
module.exports.postImagesFeed = (userId , description) => {
    const params = [userId, description];
    const query = `
    INSERT INTO posts (user_id,url)  
    VALUES ($1, $2)
    RETURNING user_id, url;
    `;
    return db.query(query, params);
};

//  FUNCIONANDO
module.exports.getImagesFeed = (userId) => {
    console.log('[chamada]')
    const params = [userId];
    return db.query(
        `
        SELECT ARRAY(SELECT url FROM posts WHERE user_id = $1);
        `,
        params
    );
};

module.exports.getImagesFeedId = (userId) => {
    console.log('[chamada]')
    const params = [userId];
    return db.query(
        `
        SELECT ARRAY(SELECT id FROM posts WHERE user_id = $1);
        `,
        params
    );
};
//getImagesFeed ANTES A CIMA = SELECT ARRAY(SELECT t.url FROM users AS u LEFT JOIN posts AS t ON u.id = t.user_id WHERE u.id = $1);

//SELECT ARRAY(SELECT t.description FROM users AS u LEFT JOIN userimages AS t ON u.id = t.sender_id WHERE u.id = $1);
//SELECT ARRAY(SELECT t.description FROM users AS u LEFT JOIN userimages AS t ON u.sender_id = t.sender_id WHERE u.sender_id = $1);

// PEGAR IMAGENS DE OUTRO USUARIO
/*module.exports.getOtherImagesFeed = (otherId) => {
    console.log('[chamada2]')
    const params = [otherId];
    return db.query(
        `
        SELECT ARRAY(SELECT t.description FROM users AS u LEFT JOIN userimages AS t ON u.id = t.sender_id WHERE u.id = $1);
        `,
        params
    );
};*/

//  NOVO TESTE PARA FOTOS DE OUTRO USUARIO ========================================================
module.exports.getOtherFeed = (id) => {
    console.log('[CHAMANDO NOVAS IMAGENS]')
    const params = [id];
    const query = `
    SELECT ARRAY(SELECT url FROM posts WHERE user_id = $1);
    `;
    return db.query(query, params);
};
//  NOVO TESTE PARA FOTOS DE OUTRO USUARIO ========================================================
/*
module.exports.getOtherImagesFeed = (sender_id) => {
    console.log('[IMAGENS DE OUTRO USUARIO]')
    const params = [sender_id];
    return db.query(`
    SELECT description FROM userimages WHERE sender_id = $1;
    `,
     params
    );
};*/
module.exports.post = (url, sender_id) => {
    const query = `
    INSERT INTO posts (url, user_id)  
    VALUES ($1, $2)
    RETURNING id, user_id, url;
    `;
    const params = [url, sender_id];
    return db.query(query, params);
};

module.exports.getIndividualPosts = (id) => {
    console.log('[CHAMANDO NOVAS IMAGENS]')
    const params = [id];
    const query = `
    SELECT ARRAY(SELECT url FROM posts WHERE id = $1);
    `;
    return db.query(query, params);
};
// FECHA TESTE=======================
// INDIVIDUAL POSTS
/*
module.exports.getIndividualPosts = (id) => {
    console.log('[CHAMANDO NOVAS IMAGENS]')
    const params = [id];
    const query = `
    SELECT ARRAY(SELECT (id,created_at,url) FROM posts WHERE user_id = $1);
    `;
    return db.query(query, params);
};
*/