const port = 3000;
const express = require('express');
const invitesRouter = require('./routes/invites')
const friendsRouter = require('./routes/friends')
const usersRouter = require('./routes/users')
const locationsRouter = require('./routes/locations')
const authRouter = require('./routes/auth')

const app = express();

app.use(express.json())

app.use('/invites', invitesRouter)
app.use('/friends', friendsRouter)
app.use('/users', usersRouter)
app.use('/locations', locationsRouter)
app.use('/auth', authRouter)

app.get('/', (req, res) => {
    res.send('Hello World');  
  });

app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
});