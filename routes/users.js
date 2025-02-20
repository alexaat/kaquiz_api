const express = require('express')
const router = express.Router()
const controller = require('../controller')

router.put('/', controller.updateUser);

router.get('/:id', controller.findUser);

router.get('/', controller.findUsers);

module.exports = router