const express = require('express')
const router = express.Router()
const controller = require('../controller')

router.post('/:id/accept', controller.acceptInvite);

router.post('/:id/decline', (req, res) => {
    res.status(200).send(`Decline invite to user with id: ${req.params.id}`)
});

router.post('/:id', controller.sendInvite);

router.get('/:id', controller.getInvites);


module.exports = router