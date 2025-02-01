const pool = require('./db/connection')
const queries = require('./db/queries')

const getFriends = (req, res) => {
    pool.query(queries.getFriends(1), (error, results) => {
        if (error) throw error
        res.status(200).json(results.rows)
})

    /*
    res.status(200).json([
        {
            id: 1,
            name: "Mike",
            avatar: "images/mike.jpg",
            location: {
              latitude: "33.15161564",
              longitude: "-1.02655545",
              timestamp: "2025-01-31T16:58:11.077Z"
            }
          },
          {
            id: 2,
            name: "Nick",
            avatar: "images/nick.jpg",
            location: {
              latitude: "-33.15161564",
              longitude: "1.02655545",
              timestamp: "2025-01-31T16:58:11.077Z"
            }
          }
    ]);
    */
}

const deleteFriend = (req, res) => {
  
  const user_id = 1;
  //1. get friends array
  pool.query(queries.findFriends(user_id), (error, results) => {
    if (error) throw error
    const friends_array = results.rows[0][0];
    if (!friends_array) {
      res.status(200).send('');
      return;
    }
    const filtered = friends_array.filter(id => id != req.params.id);

    pool.query(queries.udateFriends(user_id, JSON.stringify(filtered)), (error) => {
      if (error) throw error
      res.status(200).send('');

    })    
  })
}

module.exports = {
    getFriends,
    deleteFriend
}