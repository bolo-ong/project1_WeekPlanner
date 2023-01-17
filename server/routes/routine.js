const express = require('express');
const router = express.Router();
const Routine = require('../schemas/routine');

router.post('/', (req, res) => {
    const routine = new Routine(req.body);
    routine.save((err, routine) => {
        if (err) return res.status(500).send(err);
        return res.status(200).json(routine);
    });
});

module.exports = router;