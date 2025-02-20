const getFriends = (id) => {
    return {
       
        
        // text: `
        //     WITH temporaryTable (friend_ids) AS (
        //         SELECT
        //         jsonb_array_elements_text(friends)::int
        //         FROM
        //         users
        //         WHERE id = $1    
        //     ) 

        //     SELECT
        //         users.id, 
        //         users.name,
        //         users.avatar,         
        //         jsonb_build_object('latitude', latitude::TEXT, 'longitude', longitude::TEXT,'timestamp', timestamp) AS location
        //     FROM
        //         locations, temporaryTable
        //     JOIN 
        //         users
        //     ON
        //         users.id IN (friend_ids)
        //     WHERE
        //         locations.user_id IN (friend_ids) 
        // `,
        
       
        
        text: `

            WITH temporaryTable (friend_ids) AS (
                SELECT
                jsonb_array_elements_text(friends)::int
                FROM
                users
                WHERE id = $1    
            )

                SELECT 
                    users.id,
                    users.name,
                    users.avatar                  
                FROM
                    users, temporaryTable
                WHERE 
                    users.id IN (friend_ids)    
            

                      
            

        `,        
        values: [id]
    }
}

const findLocation = (id) => {
    return {
        text: 'SELECT latitude::TEXT, longitude::TEXT, timestamp::TEXT FROM locations WHERE user_id = $1',
        values: [id]
    }
}

const findFriends = (id) => {
    return {
        text: 'SELECT friends FROM users WHERE id = $1',
        values: [id],
        rowMode: 'array'
    }
}

const findUsersByEmail = (email) => {
    return  {
        text: "SELECT * FROM users WHERE (LOWER(email) LIKE '%' || LOWER($1) || '%')",
        values: [email]
    }
}
   
const udateFriends = (user_id, friends) => {
    return {
        text: 'UPDATE users SET friends = $1 WHERE id = $2',
        values: [friends, user_id]
    }

}

const updateName = (user_id, name) => {
   return {
        text: "UPDATE users SET name = $1 WHERE id = $2 RETURNING id, name, avatar, email",
        values: [name, user_id]
   }     
}

const updateAvatar = (user_id, avatar) => {
    return {
         text: "UPDATE users SET avatar = $1 WHERE id = $2 RETURNING id, name, avatar, email",
         values: [avatar, user_id]
    }     
}

const updateLocation = (user_id, lat, lng) => {
    return  {
        text:
        `INSERT INTO locations (user_id, latitude, longitude, timestamp) VALUES ($1,$2,$3,current_timestamp)
         ON CONFLICT (user_id)
         DO UPDATE SET latitude = $2, longitude = $3, timestamp = current_timestamp`,
        values: [user_id, lat, lng]
    }
    // return  {
    //     text: "UPDATE locations SET latitude = $1, longitude = $2, timestamp = current_timestamp WHERE user_id = $3",
    //     values: [lat, lng, user_id]
    // }
    
}

const findUserByEmail = (email) => {
    return  {
        text: "SELECT * FROM users WHERE email = $1",
        values: [email]
    }
}

const getIncomingInvites = (user_id) => {
    return {
        text: `
            SELECT
                invites.id AS id,
                jsonb_build_object('id', users.id, 'name', name, 'avatar', avatar) AS sender,
                created_at
            FROM
                invites
            JOIN
                users
            ON
                users.id = invites.from_id
            WHERE
                to_id = $1
        `,
        values: [user_id]
    }
}

const getOutgoingInvites = (user_id) => {
    return {
        text: `
            SELECT
                invites.id AS id,
                jsonb_build_object('id', users.id, 'name', name, 'avatar', avatar) AS recipient,
                created_at
            FROM
                invites
            JOIN
                users
            ON
                users.id = invites.to_id
            WHERE
                from_id = $1      
        
        `,
        values: [user_id]
    }
}

const sendInvite = (sender_id, recipient_id) => {
    return {
        text: `
            INSERT INTO invites(from_id, to_id)
            VALUES ($1, $2)
            ON CONFLICT (from_id, to_id) DO UPDATE 
                SET
                from_id = $1, 
                to_id = $2,
                created_at = current_timestamp
        `,
        values: [sender_id, recipient_id]
    }
}

const findUser = (user_id) => {
    return {
        text: 'SELECT * FROM users WHERE id = $1',
        values: [user_id]
    }
}

const findInvite = (user_id, friend_id) => {
    return {
        text: 'SELECT * FROM invites WHERE from_id = $1 AND to_id = $2',
        values: [friend_id, user_id]
    }
}

const deleteInvites = (user_id, friend_id) => {
    return {
        text: `
        DELETE FROM invites WHERE (from_id = $1 AND to_id = $2) OR (from_id = $2 AND to_id = $1)`,
        values: [user_id, friend_id]
    }
}

const addUser = (name, email, avatar) => {
    return {
        text: `
        INSERT INTO users (name, email, avatar) VALUES ($1,$2,$3) RETURNING id`,
        values: [name, email, avatar]
    }
}

const createUsersTable = () => {
    return `
    CREATE TABLE IF NOT EXISTS
            users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(256),
                email VARCHAR(256) UNIQUE NOT NULL, 
                avatar VARCHAR(2048),
                friends JSONB);
    `

}

const createLocationsTable = () => {
    return `
    CREATE TABLE IF NOT EXISTS
        locations (
            id SERIAL PRIMARY KEY,
            user_id INT UNIQUE NOT NULL,
            latitude REAL NOT NULL,
            longitude REAL NOT NULL,
            timestamp TIMESTAMP DEFAULT current_timestamp);    
    `
}

const createInvitesTable = () => {
    return `
        CREATE TABLE IF NOT EXISTS
            invites (
                id SERIAL PRIMARY KEY,
                from_id INT NOT NULL,
                to_id INT NOT NULL,
                created_at TIMESTAMP DEFAULT current_timestamp, UNIQUE (from_id, to_id));    
    `
}


/*
    audit

INSERT INTO users (name, email, avatar) VALUES ('Alice', 'alice@gmail.com', 'https://static.wikia.nocookie.net/disney/images/7/73/Alice_Render.png/revision/latest?cb=20170606133308');
INSERT INTO users (name, email, avatar) VALUES ('Bob', 'bob@gmail.com', 'images/bob.png');
INSERT INTO users (name, email, avatar) VALUES ('Charlie', 'charlie@gmail.com', 'images/charlie.png');
INSERT INTO users (name, email, avatar) VALUES ('Doug', 'doug@gmail.com', 'https://people.com/thmb/LHRqhgllrUZ5cV-gzT4-J02oJOA=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(756x379:758x381):format(webp)/doug-nickelodeon-122724-ed5e58e9bdee4615a498209a7e68d758.jpg');

INSERT INTO locations (user_id, latitude, longitude) VALUES (1, 51.5083456, -0.0764236);
INSERT INTO locations (user_id, latitude, longitude) VALUES (2, 51.4999139, -0.1251736);
INSERT INTO locations (user_id, latitude, longitude) VALUES (3, 51.5012373, -0.1418884);

INSERT INTO invites (from_id, to_id) VALUES (1, 5);
INSERT INTO invites (from_id, to_id) VALUES (3, 5);


*/


    
/*
backup

        SELECT
            jsonb_build_array(
                jsonb_build_object(
                    'id', invites.id,
                    'sender', jsonb_build_object('id', users.id, 'name', name, 'avatar', avatar),
                    'created_at', created_at
                )
            ) AS incoming
        FROM
            invites
        INNER JOIN
            users
        ON
            users.id = to_id
        WHERE
            from_id = $1     







            WITH temporaryTable (friend_ids) AS (
                SELECT
                jsonb_array_elements_text(friends)::int
                FROM
                friends
                WHERE user_id = $1    
            ) 

            SELECT
                users.id, 
                users.name,
                users.avatar,         
                jsonb_build_object('latitude', latitude::TEXT, 'longitude', longitude::TEXT,'timestamp', timestamp) AS location
            FROM
                locations, temporaryTable
            JOIN 
                users
            ON users.id IN (friend_ids)     
            WHERE
                locations.user_id IN (friend_ids) 
*/


/*


  SELECT friends FROM friends WHERE user_id = 1
  SELECT id, name, avatar FROM users where id = 2
  SELECT latitude, longitude, timestamp FROM locations WHERE user_id = 2
*/

/*
INSERT INTO users (name, email, avatar) VALUES ('Alice', 'alice@gmail.com', 'https://static.wikia.nocookie.net/disney/images/7/73/Alice_Render.png/revision/latest?cb=20170606133308');
INSERT INTO users (name, email, avatar) VALUES ('Bob', 'bob@gmail.com', 'images/bob.png');
INSERT INTO users (name, email, avatar) VALUES ('Charlie', 'charlie@gmail.com', 'images/charlie.png');
INSERT INTO users (name, email, avatar) VALUES ('Doug', 'doug@gmail.com', 'https://people.com/thmb/LHRqhgllrUZ5cV-gzT4-J02oJOA=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(756x379:758x381):format(webp)/doug-nickelodeon-122724-ed5e58e9bdee4615a498209a7e68d758.jpg');

CREATE TABLE locations (id SERIAL PRIMARY KEY, user_id INT NOT NULL, latitude REAL NOT NULL, longitude REAL NOT NULL, timestamp TIMESTAMP DEFAULT current_timestamp);
INSERT INTO locations (user_id, latitude, longitude) VALUES (1, 51.5083456, -0.0764236);
INSERT INTO locations (user_id, latitude, longitude) VALUES (2, 51.4999139, -0.1251736);
INSERT INTO locations (user_id, latitude, longitude) VALUES (3, 51.5012373, -0.1418884);

UPDATE users SET friends = '[2,3]' WHERE id = 1;

CREATE TABLE friends (id SERIAL PRIMARY KEY, user_id INT NOT NULL, friends JSONB);
INSERT INTO friends (user_id, friends) VALUES (1, '[2]');

ALTER TABLE users ADD friends JSONB;

CREATE TABLE invites (id SERIAL PRIMARY KEY, from_id INT NOT NULL, to_id INT NOT NULL , created_at TIMESTAMP DEFAULT current_timestamp, UNIQUE (from_id, to_id));
INSERT INTO invites (from_id, to_id) VALUES (1, 2);
INSERT INTO invites (from_id, to_id) VALUES (2, 1);
*/



module.exports = {
    getFriends,
    findFriends,
    udateFriends,
    updateName,
    updateAvatar,
    updateLocation,
    getIncomingInvites,
    getOutgoingInvites,
    sendInvite,
    findUser,
    findInvite,
    deleteInvites,
    findUserByEmail,
    addUser,
    findUsersByEmail,
    findLocation,
    createUsersTable,
    createLocationsTable,
    createInvitesTable
}