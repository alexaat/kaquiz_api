const express = require('express')
const router = express.Router()
const controller = require('../controller')

router.post('/:id/accept', (req, res) => {
    res.status(200).send(`Accept invite to user with id: ${req.params.id}`)
});

router.post('/:id/decline', (req, res) => {
    res.status(200).send(`Decline invite to user with id: ${req.params.id}`)
});

router.post('/:id', (req, res) => {
    res.status(200).send(`Send invite to user with id: ${req.params.id}`)
});

router.get('/:id', controller.getInvites);


module.exports = router