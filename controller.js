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

const updateLocation = (req, res) => {
  const user_id = 1;

  const body = req.body
  let latitude = body["latitude"];
  let longitude = body["longitude"];

  if(latitude && longitude){
    latitude = latitude.trim()
    longitude = longitude.trim()
    if(latitude && longitude) {
      const lat = parseFloat(latitude) 
      const lng =  parseFloat(longitude) 
      if(lat == NaN || lng == NaN){
        res.status(200).end()          
      }else{
        pool.query(queries.updateLocation(user_id, lat, lng), (error, results) => {
          if (error) {
            res.status(500).end()
          } else {
            res.status(200).end()
          }
        })
      }
    } else {
      res.status(200).end()
    }
  } else {
    res.status(200).end()
  } 


}

const getFriends = (req, res) => {
    const user_id = 1;
    pool.query(queries.getFriends(user_id), (error, results) => {
        if (error) {
          res.status(500).end()
        } else {
          res.status(200).json(results.rows)
        }      
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
      if (error) {
        res.status(500).end();        
      } else {
        res.status(200).end();
      }
    })    
  })
}

const getInvites = (req, res) => {
    const user_id = req.params.id;
    pool.query(queries.getIncomingInvites(user_id), (error, results) => {
      if(error) {
        console.log(error)
        res.status(500).end() 
      } else {
        const incoming = results.rows
        pool.query(queries.getOutgoingInvites(user_id), (error, results) => {
          if(error) {
            res.status(500).end()   
          }else{
            const outgoing = results.rows

            res.status(200).json({
              "incoming" : incoming,
              "outgoing" : outgoing
            })

          }
        })     
      }
    })
}

const sendInvite = (req, res) => {
  const id = 2; //from auth
  let user_id = req.params.id
    
  //validation
  user_id = parseInt(user_id)
  if(user_id == NaN){
    res.status(404).end()
    return
  }

  //check user exists
  pool.query(queries.findUser(user_id), (error, results) => {
    if (error) {
      res.status(500).end()
      return
    } 
    if (results.rows.length === 0){
      res.status(404).end()      
    } else {

      //check that already freinds
      pool.query(queries.getFriends(id), (error, results) => {
        if (error) {
          res.status(500).end()
          return
        } 
        const friends = results.rows;
        const fr = friends.find(friend => friend.id == user_id)
        if (fr){
          res.status(200).end()
          return
        }
        //send invite
        pool.query(queries.sendInvite(id, user_id), (error) => {
          if (error) {
            res.status(500).end()
          } else {
            res.status(200).end()
          }
        })
      })
    }
  })
}

const acceptInvite = (req, res) => {
  const user_id = 1 // from auth
  let friend_id = req.params.id

  //validate
  friend_id = parseInt(friend_id)
  if(friend_id == NaN) {
      console.log('invalid param')
      res.status(404).end()
    return
  }

  //check that invite exists
  pool.query(queries.findInvite(user_id, friend_id), (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).end()
      return
    } 
    if (results.rows.length === 0){
      console.log('invalid param')
      res.status(404).end()
      return
    }
    //let inviteId = results.rows[0]["id"]

    //remove invite from table
    pool.query(queries.deleteInvites(user_id, friend_id), (error) => {
      if (error) {
        console.log(error)
        res.status(500).end()
        return
      }

      //add friend
      pool.query(queries.findFriends(user_id), (error, results) => {
        if (error) {
          console.log(error)
          res.status(500).end()
          return
        }
        let friends_array = results.rows[0][0];
        friends_array.push(friend_id);
        pool.query(queries.udateFriends(user_id, JSON.stringify(friends_array)), (error) => {
          if (error) {
            console.log(error)
            res.status(500).end();        
          } else {
            res.status(200).end();
          }
        })

      })

    })
  })
}

const declineInvite = (req, res) => {
  const user_id = 2 // from auth
  let friend_id = req.params.id

  //validate
  friend_id = parseInt(friend_id)
  if(friend_id == NaN) {
      console.log('invalid param')
      res.status(404).end()
    return
  }

  //check that invite exists
  pool.query(queries.findInvite(user_id, friend_id), (error, results) => {
    if (error) {
      console.log(error)
      res.status(500).end()
      return
    } 
    if (results.rows.length === 0){
      console.log('invalid param')
      res.status(404).end()
      return
    }
    //let inviteId = results.rows[0]["id"]

    //remove invite from table
    pool.query(queries.deleteInvites(user_id, friend_id), (error) => {
      if (error) {
        console.log(error)
        res.status(500).end()
        return
      } 
      res.status(200).end()
    })
  })
}

module.exports = {
    getFriends,
    deleteFriend,
    updateUser,
    updateLocation,
    getInvites,
    sendInvite,
    acceptInvite,
    declineInvite
}