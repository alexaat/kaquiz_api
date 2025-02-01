const express = require('express')
const router = express.Router()
const controller = require('../controller')

router.put('/', controller.updateUser);

module.exports = router