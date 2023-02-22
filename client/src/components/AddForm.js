import { useRef, useEffect, useState } from "react";
import { useFormik } from "formik"
import * as yup from "yup"

function AddForm({ setAddForm, setRoutines, routines }) {
    const inputRef = useRef();
    const closeModal = () => {
        setAddForm(false)
    };

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

    const handleWeekCheck = (e) => {
        const copy = { ...weekCheck };
        copy[e.target.id] = e.target.checked;
        setButtonUiController(Object.values(copy).includes(true))
        setWeekCheck(copy)
    }

    const [buttonUiController, setButtonUiController] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(e.target);
            console.log(formData)
            const data = {}
            for (const [key, value] of formData) {
                data[key] = value
            }
            data['weekCheck'] = weekCheck;
            await fetch(`${process.env.REACT_APP_SERVER_URL}/routine`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });
            // const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/routine`)
            // const resData = await res.json();
            const newRoutines = [...routines, data]
            newRoutines.sort((a, b) => new Date("1970/01/01 " + a.time) - new Date("1970/01/01 " + b.time))
            await setRoutines(newRoutines);

            closeModal();
        } catch (error) {
            console.error(error);
        }
    }

    const validationSchema = yup.object().shape({
        title: yup
            .string()
            .required('제목을 입력해 주세요.')
            .max(100, '100자 이내로 작성해 주세요.'),
        time: yup
            .string()
            .required('시간을 선택해 주세요.'),
        description: yup
            .string()
            .max(300, '300자 이내로 작성해 주세요.'),
        checked: yup
            .array()
            .required('요일을 선택해 주세요.')
    })

    const formik = useFormik({
        initialValues: {
            title: '',
            time: '',
            description: '',
            checked: []
        },
        onSubmit: values => {
            console.log(values)
        },
        validationSchema
    })


    return (
        <form onSubmit={formik.handleSubmit}>
            <div className="fixed w-full h-full z-10">
                <div className="w-full h-full bg-black opacity-80"
                    onClick={() => {
                        setAddForm(false)
                    }}></div>

                <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 ">
                    <button className="float-right m-1 mr-3"
                        onClick={() => {
                            setAddForm(false)
                        }}>x</button>
                    <div className="rounded-lg bg-gray-100 p-6">
                        <div className="flex mb-3">
                            <div className="flex justify-between">
                                <input className=" mt-1 p-1 mr-1 w-min bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md focus:ring-1"
                                    ref={inputRef}

                                    maxLength="100"
                                    placeholder="Title"
                                    type="text"
                                    name="title"
                                    required
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.title && formik.errors.title && <p>{formik.errors.title}</p>}
                                <input className="ml-1 mt-1 p-1 w-32 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md focus:ring-1"
                                    type="time"
                                    name="time"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.time && formik.errors.time && <p>{formik.errors.time}</p>}
                            </div>
                        </div>
                        <div className=" text-gray-600">
                            <textarea className="mt-1 p-1 mr-1 h-32 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md focus:ring-1"

                                maxLength="300"
                                placeholder="Content"
                                type="text"
                                name="description"
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.description && formik.errors.description && <p>{formik.errors.description}</p>}
                        </div>
                        <div className="flex justify-evenly mt-2">
                            {week.map((data, i) =>
                                <div key={i}>
                                    <input
                                        type="checkbox"
                                        name="checked"
                                        id={data[0]}
                                        checked={data[1]}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    // checked={formik.values.checked.includes(data)}

                                    // onChange={handleWeekCheck}
                                    />
                                    {formik.touched.checked && formik.errors.checked && <p>{formik.errors.title}</p>}
                                    <label htmlFor={data}>{data}</label>
                                </div>
                            )}
                        </div>
                        {
                            buttonUiController === false ? <button disabled className="pointer-events-none w-full py-1.5 mt-3 text-white font-medium text-sm rounded shadow-md bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg">요일을 선택해 주세요</button>
                                : <button className="cursor-pointer w-full py-1.5 mt-3 text-white font-medium text-sm rounded shadow-md bg-blue-600 hover:bg-blue-700  focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg">기록</button>
                        }
                    </div>
                </div>
            </div>
        </form>
    )
}

export default AddForm;