const express = require('express')
const router = express.Router()
const controller = require('../controller')

router.delete('/:id', controller.deleteFriend);

router.get('/', controller.getFriends);

module.exports = router