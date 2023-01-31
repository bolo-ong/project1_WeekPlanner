import Header from '../components/Header';
import Card from '../components/Card'
import { useEffect, useState } from 'react';
import AddForm from '../components/AddForm';
import WeekCheckForm from '../components/WeekCheckForm';


function Service() {

    const date = new Date();
    const day = date.getDay();
    const hour = date.getHours()
    const min = date.getMinutes()
    // const progressBar = (hour * 60 + min) / 60 / 24 * 100
    const [addForm, setAddForm] = useState(false)
    const [routines, setRoutines] = useState([])
    const [todayRoutines, setTodayRoutines] = useState([])
    const [checkedDays, setCheckedDays] = useState([])


    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/routine`)
                const data = await res.json();
                setRoutines(data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, []);

    useEffect(() => {
        const filteredRoutines = routines.filter(routine =>
            checkedDays.some(day => routine.weekCheck[day] === true)
        );
        setTodayRoutines(filteredRoutines)
    }, [routines, checkedDays]);

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
            <Header />
            <div className='h-[90vh] container mx-auto flex'>
                <div className='relative flex flex-col-reverse mx-8 mt-8 mb-3 w-2.5 bg-gray-300 rounded-full'>
                    <div className='w-2.5 bg-indigo-300 rounded-full' style={{ height: `${progressBar(hour, min)}%` }}></div>
                    {todayRoutines.map((data, i) =>
                        <>
                            {/* <div className='absolute right-5 w-12' style={{ bottom: `${progressLine(data.time)}%` }}>{data.title}</div> */}
                            <div key={i} className='absolute bg-indigo-500 w-2.5 h-1.5 rounded-full' style={{ bottom: `${progressLine(data.time)}%` }}></div>
                        </>
                    )}
                </div>
                <div>
                    <WeekCheckForm day={day} setCheckedDays={setCheckedDays} />
                    <Card addForm={addForm} setAddForm={setAddForm} routines={routines} todayRoutines={todayRoutines} />
                </div>
            </div>
        </>
    )
}

export default Service;