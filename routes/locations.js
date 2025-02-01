const express = require('express')
const router = express.Router()

router.post('/', (req, res) => {
    res.status(200).send(`Submit user's location`)
});

module.exports = router