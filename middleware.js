const pool = require('./db/connection')
const queries = require('./db/queries')
const google_api = require('./network/google_user_api');

const auth = (req, res, next) => {
    let fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    console.log(`url: ${fullUrl}`);
    //authorization
    const accessToken = req.header('authorization');
    google_api.getGoogleUser(accessToken)
    .then(result =>{
        let name = result.data.name;
        let picture = result.data.picture;
        let email = result.data.email;

        if (!name) {
            name = '';
        }
        if (!picture){
            picture = '';
        }
        if(!email){
            res.status(401).end();
            return
        }
        //get user by email
        pool.query(queries.findUserByEmail(email), (error, results) => {
                if (error) {
                    console.log('findUserByEmail error: ', error)                    
                    res.status(500).end()
                } else {                   
                    if (results.rows.length == 0) {
                        //Insert user
                        pool.query(queries.addUser(name, email, picture), (error, results) => {
                            if(error){
                                console.log('addUser error: ', error)     
                                res.status(500).end()
                            } else {
                                const user_id = results.rows[0]["id"]
                                req.headers['authorization_id'] = user_id
                                next()
                            }
                        })
                    } else {
                        //Get user id
                        const user_id = results.rows[0]["id"]
                        const _name = results.rows[0]["name"];
                        const _avatar = results.rows[0]["avatar"];

                        if(_name != name){
                            //update user name 
                            pool.query(queries.updateName(user_id, name))               
                        }
            
                        if(_avatar != picture){
                            //update user avatar      
                            pool.query(queries.updateAvatar(user_id, picture))
                        }
                        req.headers['authorization_id'] = user_id
                        next()
                    }
                }
            })       
        }     
    )
    .catch(e => {
        console.log('error at middleware')
        console.log(`ERROR. ${e}`)
        res.status(401).end()
    })
  
}

module.exports = {
    auth
}