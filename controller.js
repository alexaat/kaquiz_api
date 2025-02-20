const pool = require('./db/connection')
const queries = require('./db/queries')

const authHandler = (req, res) => {
  const body = req.body
  const token = body["authorization"];
  const user_id = req.header('authorization_id');
  pool.query(queries.findUser(user_id), (error, results) => {
    if (error) {
      console.log('findUser error: ',error)
      res.status(500).end()
      return
    } else {
      if (results.rows.length == 0) {
        console.log('results.rows.length = 0: ')
        res.status(500).end()
        return
      } else {
        
        const user = results.rows[0];
        user['access_token'] = token;
        res.status(200).json(user)
      }
    }
  })  
}

const updateUser = (req, res) => {
  const user_id = req.header('authorization_id');
 
  const body = req.body
  let name = body["name"];
  let avatar = body["avatar"];

  if(name && name.trim()){
    name = name.trim();
    pool.query(queries.updateName(user_id, name), (error, results) => {
      if (error) {
        console.log('updateName error: ',error);
        res.status(500).end()
        return
      }
      if(avatar && avatar.trim()){
        avatar = avatar.trim();
        pool.query(queries.updateAvatar(user_id, avatar), (error, results) => {
          if (error) {
            console.log('updateAvatar error: ',error);
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
        console.log('updateAvatar error: ',error);
        res.status(500).end()
        return
      }
      res.status(200).json(results.rows)
    })
  } else {
    res.status(200).end()
  }
}

const findUsers = (req, res) => {
  const user_id = req.header('authorization_id');
  const search =  req.query.search;

  if (search.trim() == ''){
    res.status(200).json([]);
  } else {
    pool.query(queries.findUsersByEmail(search), (error, results) => {
      if (error) {
        console.log('findUsers error: ', error);
        res.status(500).end()
      } else {
         const users = results.rows;
         const filtered = users.filter(user => user.id != user_id);
         res.status(200).json(filtered);
      }
    });
  }
}

const findUser = (req, res) => {
  //const user_id = req.header('authorization_id');
  const friend_id = req.params.id;
  pool.query(queries.findUser(friend_id), (error, results) => {
    if (error) {
      console.log('findUser error: ', error);
      res.status(500).end()
    } else {
      const user = results.rows[0];  
      res.status(200).json(user);
    }
  });
}

const updateLocation = (req, res) => {
  const user_id = req.header('authorization_id')

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
            console.log('updateLocation error: ', error);
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

const getFriends  = async (req, res) => {
  const user_id = req.header('authorization_id');

  try {
    let results = await pool.query(queries.findFriends(user_id));
    let friendIds = results.rows[0][0];
    if(!friendIds){
      friendIds = [];
    }
    if(friendIds.length == 0){
      res.status(200).json([])
      return
    }
    let users = [];
    for(let i = 0; i < friendIds.length; i++){
      results = await pool.query(queries.findUser(friendIds[i]));
      let user = results.rows[0];
      let results1 = await pool.query(queries.findLocation(friendIds[i])); 
      let location = results1.rows[0];
      if(location === undefined){
        location = null;
      }
      users.push({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        location: location
      })    
    }

    console.log(JSON.stringify(users));
    res.status(200).json(users);
  }
  catch(error){
    console.log('getFriends error: ', error);
    res.status(500).end()
  }
}

const deleteFriend = (req, res) => {
  
  const user_id = req.header('authorization_id')
  const friend_id = req.params.id;

  //1. get friends array
  pool.query(queries.findFriends(user_id), (error, results) => {
    if (error) {
        console.log('deleteFriend error: ',error);
        res.status(500).end();
    } else {
      const friends_array = results.rows[0][0];
      if (!friends_array) {
        res.status(200).end();
        return;
      }  
      let filtered = friends_array.filter(id => id != friend_id);
      if(filtered.length == 0){
        filtered = null;
      }
      const value = filtered == null ? null : JSON.stringify(filtered);    
      pool.query(queries.udateFriends(user_id, value), (error) => {
        if (error) {
          console.log('udateFriends error: ',error);
          res.status(500).end();        
        } else {
          pool.query(queries.findFriends(friend_id), (error, results) => {
            if (error) {
              console.log('findFriends error: ',error);
              res.status(500).end();
            } else {
              const friends_array = results.rows[0][0];
              if (!friends_array) {
                res.status(200).end();
                return;
              }
              let filtered = friends_array.filter(id => id != user_id);
              if(filtered.length == 0){
                filtered = null;
              }  
              const value = filtered == null ? null : JSON.stringify(filtered);    
              pool.query(queries.udateFriends(friend_id, value), (error) => {
                if (error) {
                  console.log('udateFriends error: ',error);
                  res.status(500).end();        
                } else {
                  res.status(200).end();
                }
              })
            }
          })
        }
      })
    }
  })
}

const getInvites = (req, res) => {
    //const user_id = req.header('authorization_id')
    const user_id = req.params.id;
    pool.query(queries.getIncomingInvites(user_id), (error, results) => {
      if(error) {
        console.log('getIncomingInvites error: ',error);
        res.status(500).end() 
      } else {
        const incoming = results.rows
        pool.query(queries.getOutgoingInvites(user_id), (error, results) => {
          if(error) {
            console.log('getOutgoingInvites error: ',error);
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
  const id = req.header('authorization_id');
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
      console.log('findUser error: ',error);
      res.status(500).end()
      return
    } 
    if (results.rows.length === 0){
      res.status(404).end()      
    } else {

      //check that already freinds
      pool.query(queries.getFriends(id), (error, results) => {
        if (error) {
          console.log('getFriends error: ',error);
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
            console.log('sendInvite error: ',error);
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
  const user_id = req.header('authorization_id')
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
      console.log('findInvite error: ',error);
      res.status(500).end()
      return
    } 
    if (results.rows.length === 0){
      console.log('invalid param')
      res.status(404).end()
      return
    }

    //remove invite from table
    pool.query(queries.deleteInvites(user_id, friend_id), (error) => {
      if (error) {
        console.log('deleteInvites error: ',error);
        res.status(500).end()
        return
      }

      //add friend to recipient
      pool.query(queries.findFriends(user_id), (error, results) => {
        if (error) {
          console.log('findFriends error: ',error);
          res.status(500).end()
          return
        }
        let friends_array = results.rows[0][0];
        if(!friends_array){
          friends_array = [];
        }
        friends_array.push(friend_id);
        pool.query(queries.udateFriends(user_id, JSON.stringify(friends_array)), (error) => {
          if (error) {
            console.log('udateFriends error: ',error);
            res.status(500).end();        
          } else {
            //add friend to sender
            pool.query(queries.findFriends(friend_id), (error, results) => {
              if (error) {
                console.log('findFriends error: ',error);
                res.status(500).end()
                return
              }
              let friends_array = results.rows[0][0];
              if(!friends_array){
                friends_array = [];
              }
              friends_array.push(user_id);
              pool.query(queries.udateFriends(friend_id, JSON.stringify(friends_array)), (error) => {
                if (error) {
                  console.log('udateFriends error: ',error);
                  res.status(500).end();        
                } else {
                  res.status(200).end();
                }
              })
            })
          }
        })
      })
    })
  })
}

const declineInvite = (req, res) => {
  const user_id = req.header('authorization_id')
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
      console.log('findInvite error: ',error);
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
        console.log('deleteInvites error: ',error);
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
    declineInvite,
    authHandler,
    findUsers,
    findUser
}