const express = require('express');
const router = express.Router();
const Routine = require('../schemas/routine');

router.post('/', (req, res) => {
    console.log(req.body)
    const routine = new Routine(req.body);
    try {
        routine.save()
        res.status(200).json(routine);
    }
    catch (err) {
        res.status(500).send(err);
    }
});

router.get('/', async (req, res) => {
    try {
        const data = await Routine.find();
        res.json(data);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;