 const getFriends = (id) => {
    return {
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
                users.avatar,         
                jsonb_build_object('latitude', latitude::TEXT, 'longitude', longitude::TEXT,'timestamp', timestamp) AS location
            FROM
                locations, temporaryTable
            JOIN 
                users
            ON users.id IN (friend_ids)     
            WHERE
                locations.user_id IN (friend_ids) 
        `,
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
        text: "UPDATE locations SET latitude = $1, longitude = $2, timestamp = current_timestamp WHERE user_id = $3",
        values: [lat, lng, user_id]
    }
}

    
/*
backup
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
INSERT INTO users (name, email, avatar) VALUES ('Charlie', 'charlie@gmail.com', 'images/charlie.png');

CREATE TABLE locations (id SERIAL PRIMARY KEY, user_id INT NOT NULL, latitude REAL NOT NULL, longitude REAL NOT NULL, timestamp TIMESTAMP DEFAULT current_timestamp);
INSERT INTO locations (user_id, latitude, longitude) VALUES (1, 51.5083456, -0.0764236);
INSERT INTO locations (user_id, latitude, longitude) VALUES (2, 51.4999139, -0.1251736);
INSERT INTO locations (user_id, latitude, longitude) VALUES (3, 51.5012373, -0.1418884);


UPDATE users SET friends = '[2,3]' WHERE id = 1;



CREATE TABLE friends (id SERIAL PRIMARY KEY, user_id INT NOT NULL, friends JSONB);
INSERT INTO friends (user_id, friends) VALUES (1, '[2]');

ALTER TABLE users ADD friends JSONB;

*/

/*

CURL

curl -H 'Content-Type: application/json' -X PUT \
    -d '{"avatar": "images/new.png",
            "name": "Doug"}' \
    http://localhost:3000/users

curl -H 'Content-Type: application/json' -X POST \
    -d '{"latitude": "51.508347",
            "longitude": "-0.0764236"}' \
    http://localhost:3000/locations
*/

module.exports = {
    getFriends,
    findFriends,
    udateFriends,
    updateName,
    updateAvatar,
    updateLocation
}