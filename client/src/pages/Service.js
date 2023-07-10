import { v4 as uuidv4 } from 'uuid';
import Header from '../components/Header';
import Card from '../components/Card';
import { useEffect, useState, useContext } from 'react';
import AddForm from '../components/AddForm';
import EditForm from '../components/EditForm';
import AuthOverlay from '../components/AuthOverlay';
import SignInContext from '../contexts/SignInCheckContext/SignInCheckContext';

function Service() {
    const { isSignIn, setIsSignIn } = useContext(SignInContext);
    const date = new Date();
    const day = date.getDay();
    const hour = date.getHours();
    const min = date.getMinutes();

    const [addForm, setAddForm] = useState(false);
    const [editForm, setEditForm] = useState(false);
    const [routines, setRoutines] = useState([]);
    const [todayRoutines, setTodayRoutines] = useState([]);
    const [selectedCardId, setSelectedCardId] = useState();


    //요일 체크박스에 체크된 요일의 데이터만 가져와서 보여주기 위한 변수와 핸들러
    const [weekCheck, setWeekCheck] = useState({
        "월": false,
        "화": false,
        "수": false,
        "목": false,
        "금": false,
        "토": false,
        "일": false
    });
    const week = Object.entries(weekCheck);
    const today = week[(day - 1 + 7) % 7][0];
    const handleWeekCheck = (e) => {
        const copy = { ...weekCheck };
        copy[e.target.id] = e.target.checked;
        setWeekCheck(copy);
    };


    //렌더링 시 요일 체크박스에 '오늘'의 요일을 체크
    useEffect(() => {
        const copy = { ...weekCheck };
        copy[today] = true;
        setWeekCheck(copy);
    }, []);


    //서버에서 루틴 데이터를 받아와 시간순으로 정렬하고 스테이트에 저장, 로그인 시 해당 유저의 루틴만 가져옴
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/routine`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                });
                const data = await res.json();
                data.sort((a, b) => new Date(`1970/01/01 ${a.time}`) - new Date(`1970/01/01 ${b.time}`));
                setRoutines(data);

            } catch (error) {
                console.error(error.message);
            }
        };
        fetchData();
    }, [isSignIn]);

    //루틴 데이터중에 체크박스에 체크된 요일의 데이터만 가져옴
    useEffect(() => {
        const filteredRoutines = routines.filter(routine =>
            routine.weekCheck && Object.keys(routine.weekCheck).some(day => weekCheck[day] && routine.weekCheck[day])
        );
        setTodayRoutines(filteredRoutines);
    }, [routines, weekCheck]);


    //페이지 왼쪽에 시간이 지날수록 차오르는 bar와, 루틴을 실행할 시간을 bar에 표시해줌
    function progressBar(hour, min) {
        hour = isNaN(hour) ? 0 : hour;
        min = isNaN(min) ? 0 : min;
        return (hour * 60 + min) / 60 / 24 * 100;
    }
    function progressLine(time) {
        const [hour, min] = time.split(':').map(data => parseInt(data));
        return progressBar(hour, min);
    }

    return (
        <>
            {isSignIn === false && <AuthOverlay />}
            {addForm === true && <AddForm setAddForm={setAddForm} setRoutines={setRoutines} routines={routines} />}
            {editForm === true && <EditForm setEditForm={setEditForm} setRoutines={setRoutines} routines={routines} todayRoutines={todayRoutines} selectedCardId={selectedCardId} />}
            <Header />
            <div className='min-h-[90vh] container mx-auto flex'>
                <div className='relative flex flex-col-reverse mx-8 mt-10 mb-3 w-2.5 bg-gray-300 rounded-full'>
                    <div className='w-2.5 bg-indigo-300 rounded-full' style={{ height: `${progressBar(hour, min)}%` }}></div>
                    {todayRoutines.map((data) => (
                        <div className='absolute bg-indigo-500 w-2.5 h-1.5 rounded-full' key={uuidv4()} style={{ bottom: `${progressLine(data.time)}%` }}></div>
                    ))}
                </div>
                <div>
                    <div className='flex mt-7 ml-9'>
                        {week.map((data) => (
                            <div className='p-2' key={uuidv4()}>
                                <input
                                    type='checkbox'
                                    id={data[0]}
                                    checked={data[1]}
                                    onChange={handleWeekCheck}
                                />
                                <label htmlFor={data[0]}>{data[0]}</label>
                            </div>
                        ))}
                    </div>
                    <Card
                        addForm={addForm}
                        setAddForm={setAddForm}
                        routines={routines}
                        todayRoutines={todayRoutines}
                        editForm={editForm}
                        setEditForm={setEditForm}
                        setSelectedCardId={setSelectedCardId}
                    />
                </div>
            </div>
        </>
    );
}

export default Service;
