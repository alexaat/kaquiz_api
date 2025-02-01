const express = require('express')
const router = express.Router()

router.put('/', (req, res) => {
    res.status(200).send(`Update user's avatar and name`)
});

module.exports = router