import { v4 as uuidv4 } from 'uuid';

import Header from '../components/Header';
import Card from '../components/Card'
import { useEffect, useState, useContext } from 'react';
import AddForm from '../components/AddForm';
import EditForm from '../components/EditForm';
import WeekCheckForm from '../components/WeekCheckForm';
import SignInContext from '../contexts/SignInCheckContext/SignInCheckContext';


function Service() {

    const { isSignIn, setIsSignIn } = useContext(SignInContext);

    const date = new Date();
    const day = date.getDay();
    const hour = date.getHours()
    const min = date.getMinutes()
    // const progressBar = (hour * 60 + min) / 60 / 24 * 100
    const [addForm, setAddForm] = useState(false)
    const [editForm, setEditForm] = useState(false)
    const [routines, setRoutines] = useState([])
    const [todayRoutines, setTodayRoutines] = useState([])
    const [checkedDays, setCheckedDays] = useState([])
    const [selectedCardId, setSelectedCardId] = useState()
    const [weekCheck, setWeekCheck] = useState({
        "월": false,
        "화": false,
        "수": false,
        "목": false,
        "금": false,
        "토": false,
        "일": false
    });

    const week = Object.entries(weekCheck)
    const today = week[(day - 1 + 7) % 7][0];

    const handleWeekCheck = (e) => {
        const copy = { ...weekCheck };
        copy[e.target.id] = e.target.checked;
        setWeekCheck(copy);
        // updateCheckedDays(copy);
    }

    useEffect(() => {
        const copy = { ...weekCheck };
        copy[today] = true;
        setWeekCheck(copy);
        // updateCheckedDays(copy);
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/routine`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                })
                const data = await res.json();
                console.log(data)
                data.sort((a, b) => new Date("1970/01/01 " + a.time) - new Date("1970/01/01 " + b.time))
                setRoutines(data);
                console.log(data)
            } catch (error) {
                console.error(error.message);
            }
        }
        fetchData();
    }, [isSignIn]);

    // const handleAddRoutine = async (newRoutine) => {
    //     // 새로운 루틴 추가
    //     await fetch(`${process.env.REACT_APP_SERVER_URL}/routine`, {
    //         method: 'POST',
    //         headers: {
    //             "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify(newRoutine)
    //     });

    //     const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/routine`)
    //     const resData = await res.json();
    //     const newRoutines = [...routines, resData]
    //     newRoutines.sort((a, b) => new Date("1970/01/01 " + a.time) - new Date("1970/01/01 " + b.time))
    //     await setRoutines(newRoutines);
    // };

    // const updateCheckedDays = (copy) => {
    //     const checkedDays = Object.entries(copy)
    //         .filter(([day, isChecked]) => isChecked)
    //         .map(([day]) => day);
    //     setCheckedDays(checkedDays)
    // }

    useEffect(() => {
        const filteredRoutines = routines.filter(routine =>
            routine.weekCheck && Object.keys(routine.weekCheck).some(day => weekCheck[day] && routine.weekCheck[day])
        );
        setTodayRoutines(filteredRoutines);
    }, [routines, weekCheck]);



    console.log('render')
    console.log(todayRoutines)


    function progressBar(hour, min) {
        hour = isNaN(hour) ? 0 : hour;
        min = isNaN(min) ? 0 : min;
        return (hour * 60 + min) / 60 / 24 * 100;
    }

    function progressLine(time) {
        const [hour, min] = time.split(':').map(data => parseInt(data));
        return progressBar(hour, min)
    }

    return (
        <>
            {
                addForm === true && <AddForm setAddForm={setAddForm} setRoutines={setRoutines} routines={routines} />
            }
            {
                editForm === true && <EditForm setEditForm={setEditForm} setRoutines={setRoutines} routines={routines} todayRoutines={todayRoutines} selectedCardId={selectedCardId} />
            }
            <Header />
            <div className='min-h-[90vh] container mx-auto flex'>
                <div className='relative flex flex-col-reverse mx-8 mt-10 mb-3 w-2.5 bg-gray-300 rounded-full'>
                    <div className='w-2.5 bg-indigo-300 rounded-full' style={{ height: `${progressBar(hour, min)}%` }}></div>
                    {todayRoutines.map((data, i) =>
                        <>
                            {/* <div className='absolute right-5 w-12' style={{ bottom: `${progressLine(data.time)}%` }}>{data.title}</div> */}
                            <div className='absolute bg-indigo-500 w-2.5 h-1.5 rounded-full' key={uuidv4()} style={{ bottom: `${progressLine(data.time)}%` }}></div>
                        </>
                    )}
                </div>
                <div>
                    <div className="flex mt-7 ml-9">
                        {week.map((data, i) =>
                            <div className="p-2" key={uuidv4()}>
                                <input
                                    type='checkbox'
                                    id={data[0]}
                                    checked={data[1]}
                                    onChange={handleWeekCheck}
                                />
                                <label htmlFor={data[0]}>{data[0]}</label>
                            </div>
                        )}
                    </div>
                    <Card addForm={addForm} setAddForm={setAddForm} routines={routines} todayRoutines={todayRoutines} editForm={editForm} setEditForm={setEditForm} setSelectedCardId={setSelectedCardId} />
                </div>
            </div>
        </>
    )
}

export default Service;