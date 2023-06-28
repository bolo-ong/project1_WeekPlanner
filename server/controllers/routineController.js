const { Routine } = require('../models');


const getRoutine = async (req, res) => {
    try {
        const userData = req.userData
        const selectedCardId = req.params._id

        let data;

        if (selectedCardId) {
            data = await Routine.findOne({ _id: selectedCardId });
            const { createBy, ...others } = data.toObject();
            return res.json(others);
        }

        if (userData) {
            data = await Routine.find({ createdBy: userData._id });
        }
        else {
            data = await Routine.find();
        }
        res.json(data);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createRoutine = async (req, res) => {
    try {
        let routine

        if (req.userData) {
            routine = new Routine({ ...req.body, createdBy: req.userData._id });
        }
        else {
            routine = new Routine(req.body);
        }

        await routine.save();
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateRoutine = async (req, res) => {
    const selectedCardId = req.params._id
    try {
        await Routine.updateOne({ _id: selectedCardId }, req.body);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteRoutine = async (req, res) => {
    const selectedCardId = req.params._id
    try {
        await Routine.deleteOne({ _id: selectedCardId });
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = { getRoutine, createRoutine, updateRoutine, deleteRoutine }
