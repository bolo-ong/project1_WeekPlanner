import { useRef, useEffect, useState } from "react";


function AddForm({ addForm, setAddForm }) {
    const inputRef = useRef();
    useEffect(() => {
        inputRef.current.focus();
    }, [])


    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            closeModal();
        }
    };
    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    const closeModal = () => {
        setAddForm(false)
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = {}
        for (const [key, value] of formData) {
            data[key] = value
        }

        data['weekCheck'] = weekCheck;

        fetch(`${process.env.REACT_APP_SERVER_URL}/routine`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
            .catch(error => {
                console.error(error)
            })

        closeModal();
    }


    const [weekCheck, setWeekCheck] = useState({
        "월": false,
        "화": false,
        "수": false,
        "목": false,
        "금": false,
        "토": false,
        "일": false
    });
    const week = Object.keys(weekCheck)

    const handleWeekCheck = (e) => {
        const copy = { ...weekCheck };
        copy[e.target.id] = e.target.checked;
        setButtonUiController(Object.values(copy).includes(true))
        setWeekCheck(copy)
    }

    const [buttonUiController, setButtonUiController] = useState(false)

    return (
        <form onSubmit={(e) => {
            handleSubmit(e)
        }}>
            <div className="fixed w-full h-full z-10">
                <div className="w-full h-full bg-black opacity-80"
                    onClick={() => {
                        setAddForm(false)
                    }}></div>

                <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2">
                    <button className="float-right m-1 mr-3"
                        onClick={() => {
                            setAddForm(false)
                        }}>x</button>
                    <div className="rounded-lg bg-gray-100 p-6">
                        <div className="flex mb-3">
                            <div className="flex justify-between">
                                <input className=" mt-1 p-1 mr-1 w-min bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md focus:ring-1"
                                    ref={inputRef}
                                    minLength="1"
                                    maxLength="100"
                                    placeholder="Title"
                                    type="text"
                                    name="title"
                                />
                                <input className="ml-1 mt-1 p-1 w-min  bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md focus:ring-1"
                                    type="time"
                                    name="time"
                                />
                            </div>
                        </div>
                        <div className=" text-gray-600">
                            <textarea className="mt-1 p-1 mr-1 h-32 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md focus:ring-1"
                                minLength="1"
                                maxLength="300"
                                placeholder="Content"
                                type="text"
                                name="description"
                            />
                        </div>
                        <div className="flex justify-evenly mt-2">
                            {week.map((data, i) =>
                                <div key={i}>
                                    <input
                                        type='checkbox'
                                        id={data}
                                        onClick={handleWeekCheck}
                                    />
                                    <label htmlFor={data}>{data}</label>
                                </div>
                            )}
                        </div>
                        {
                            buttonUiController === false ? <button disabled className="pointer-events-none w-full py-1.5 mt-3 text-white font-medium text-sm rounded shadow-md bg-red-400 focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg">요일을 선택해 주세요</button>
                                : <button className="cursor-pointer w-full py-1.5 mt-3 text-white font-medium text-sm rounded shadow-md bg-blue-600 hover:bg-blue-700  focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg">기록</button>
                        }
                    </div>
                </div>
            </div>
        </form>
    )
}

export default AddForm;