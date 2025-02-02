const express = require('express')
const router = express.Router()
const controller = require('../controller')

router.post('/:id/accept', controller.acceptInvite);

router.post('/:id/decline', controller.declineInvite);

router.post('/:id', controller.sendInvite);

router.get('/:id', controller.getInvites);


module.exports = router