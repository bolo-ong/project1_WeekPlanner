const { Routine } = require('../models');


const getRoutine = async (req, res) => {
    try {
        const userData = req.userData
        const selectedCardId = req.params._id

        let data;

        if (selectedCardId) { //루틴카드를 선택시, 해당 루틴의 데이터 전송
            data = await Routine.findOne({ _id: selectedCardId });
            return res.json(data);
        }

        if (userData) { //유저가 로그인 상태일시, 해당 유저의 루틴 데이터 전송
            data = await Routine.find({ createdBy: userData._id });
        }
        else { //비로그인 상태일시, 모든 루틴 데이터 전송
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
