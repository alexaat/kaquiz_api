const pool = require('./db/connection')
const queries = require('./db/queries')

const updateUser = (req, res) => {
  const user_id = 1;

  const body = req.body
  let name = body["name"];
  let avatar = body["avatar"];

  if(name && name.trim()){
    name = name.trim();
    pool.query(queries.updateName(user_id, name), (error, results) => {
      if (error) {
        res.status(500).end()
        return
      }
      if(avatar && avatar.trim()){
        avatar = avatar.trim();
        pool.query(queries.updateAvatar(user_id, avatar), (error, results) => {
          if (error) {
            res.status(500).end()
            return
          }
          res.status(200).json(results.rows)
        })
      } else{
        res.status(200).json(results.rows)
      }
    })
  } else if(avatar && avatar.trim()){
    avatar = avatar.trim();
    pool.query(queries.updateAvatar(user_id, avatar), (error, results) => {
      if (error) {
        res.status(500).end()
        return
      }
      res.status(200).json(results.rows)
    })
  } else {
    res.status(200).end()
  }
}




const getFriends = (req, res) => {
    const user_id = 1;
    pool.query(queries.getFriends(user_id), (error, results) => {
        if (error) throw error
        res.status(200).json(results.rows)
  })
}

const deleteFriend = (req, res) => {
  
  const user_id = 1;
  //1. get friends array
  pool.query(queries.findFriends(user_id), (error, results) => {
    if (error) throw error
    const friends_array = results.rows[0][0];
    if (!friends_array) {
      res.status(200).end();
      return;
    }
    const filtered = friends_array.filter(id => id != req.params.id);

    pool.query(queries.udateFriends(user_id, JSON.stringify(filtered)), (error) => {
      if (error) throw error
      res.status(200).end();

    })    
  })
}

module.exports = {
    getFriends,
    deleteFriend,
    updateUser
}