const express = require('express');
const bodyParser = require('body-parser');
const invitesRouter = require('./routes/invites')
const friendsRouter = require('./routes/friends')
const usersRouter = require('./routes/users')
const locationsRouter = require('./routes/locations')
const authRouter = require('./routes/auth')
const {auth} = require('./middleware')
const init = require("./db/init_db");

const app = express();

app.use(express.json())
app.use(bodyParser.json());

init.createTables();

app.get('/', (req, res) => {
  init.createTables();
  res.send('Welcome to kaquiz api');  
});

app.use(auth);

app.use('/auth', authRouter)

app.use('/invites', invitesRouter)
app.use('/friends', friendsRouter)
app.use('/users', usersRouter)
app.use('/locations', locationsRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`)
});