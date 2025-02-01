const express = require('express')
const router = express.Router()

router.post('/:id/accept', (req, res) => {
    res.status(200).send(`Accept invite to user with id: ${req.params.id}`)
});

router.post('/:id/decline', (req, res) => {
    res.status(200).send(`Decline invite to user with id: ${req.params.id}`)
});

router.post('/:id', (req, res) => {
    res.status(200).send(`Send invite to user with id: ${req.params.id}`)
});

router.get('/:id', (req, res) => {
    res.status(200).send(`Get incoming and outgoing invites for user with id: ${req.params.id}`)
});


module.exports = router