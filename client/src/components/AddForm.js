import { useRef, useEffect, useState } from "react";
import { useFormik } from "formik"
import * as yup from "yup"
import { v4 as uuidv4 } from 'uuid';

function AddForm({ setAddForm, setRoutines }) {

    //폼이 열리면, 제목란에 자동 포커스 되어 유저가 바로 입력할 수 있도록 구현
    const inputRef = useRef();
    useEffect(() => {
        inputRef.current.focus();
    }, [])

    //esc키로 폼을 닫을 수 있도록 구현
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setAddForm(false);
        }
    };
    useEffect(() => { //폼을 닫은 후에도 이벤트가 남아서 램을 낭비하지 않도록 이벤트를 삭제
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

    //유효성 검증
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
        weekCheck: yup
            .object()
            .shape({
                "월": yup.boolean(),
                "화": yup.boolean(),
                "수": yup.boolean(),
                "목": yup.boolean(),
                "금": yup.boolean(),
                "토": yup.boolean(),
                "일": yup.boolean(),
            })
            .test(
                'isWeekChecked',
                '요일을 선택해 주세요.',
                obj => Object.values(obj).some(checked => checked === true)
            )
    })

    //폼의 기본값 설정
    const formik = useFormik({
        initialValues: {
            title: '',
            time: '',
            description: '',
            weekCheck: {
                '월': false,
                '화': false,
                '수': false,
                '목': false,
                '금': false,
                '토': false,
                '일': false
            }
        },
        onSubmit: async (values) => {
            try {
                await fetch(`${process.env.REACT_APP_SERVER_URL}/routine`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(values),
                    credentials: 'include'
                });

                setTimeout(async () => { //데이터를 저장한 후, 저장한 데이터를 ui에 반영
                    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/routine`, {
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include'
                    });
                    const data = await res.json();
                    data.sort((a, b) => new Date("1970/01/01 " + a.time) - new Date("1970/01/01 " + b.time));

                    setRoutines(data);
                }, 1);

            } catch (error) {
                console.error(error);
            }
            setAddForm(false);
        },
        validationSchema
    })


    return (
        <div>

            <div className="fixed w-full h-full z-10">
                <div className="w-full h-full bg-black opacity-80"
                    onMouseDown={() => {
                        setAddForm(false)
                    }}></div>

                <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 ">
                    <button className="float-right m-1 mr-3 hover:scale-110"
                        onMouseDown={() => {
                            setAddForm(false)
                        }}>x</button>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="rounded-lg bg-gray-100 p-6">
                            <div className="flex mt-2 mb-3">
                                <div>
                                    <input className="p-1 mr-1 w-min h-9 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md focus:ring-1"
                                        ref={inputRef}
                                        maxLength="100"
                                        placeholder="Title"
                                        type="text"
                                        name="title"
                                        value={formik.values.title}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.title && formik.errors.title && <p className="text-sm text-red-400 ml-1">{formik.errors.title}</p>}
                                </div>
                                <div>
                                    <input className="ml-1 p-1 w-32 h-9 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md focus:ring-1"
                                        type="time"
                                        name="time"
                                        value={formik.values.time}
                                        onChange={formik.handleChange}
                                        onBlur={formik.handleBlur}
                                    />
                                    {formik.touched.time && formik.errors.time && <p className="text-sm text-red-400 ml-2">{formik.errors.time}</p>}
                                </div>
                            </div>

                            <textarea className="mt-1 p-1 mr-1 h-32 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md focus:ring-1"
                                maxLength="300"
                                placeholder="Content"
                                type="text"
                                name="description"
                                value={formik.values.description}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />

                            <div>
                                <div className="flex justify-evenly mt-3">
                                    {week.map((data, i) =>
                                        <div key={uuidv4()}
                                            onMouseDown={() => {
                                                const copy = { ...weekCheck }
                                                copy[data[0]] = !copy[data[0]];
                                                setWeekCheck(copy);
                                                formik.setFieldValue("weekCheck", copy);
                                            }}>
                                            <input
                                                readOnly
                                                type="checkbox"
                                                name="weekCheck"
                                                id={data[0]}
                                                checked={weekCheck[data[0]]}
                                                onBlur={formik.handleBlur}
                                            />
                                            <label htmlFor={data[0]}>{data[0]}</label>
                                        </div>
                                    )}
                                </div>
                                {formik.touched.weekCheck && formik.errors.weekCheck && <p className="text-sm text-red-400 ml-4">{formik.errors.weekCheck}</p>}
                            </div>
                            {formik.isSubmitting ?
                                (<button type="submit" className="w-full py-1.5 mt-3 text-white font-medium text-sm rounded shadow-md bg-blue-500">기록중 입니다...</button>)
                                :
                                (<button type="submit" className="w-full py-1.5 mt-3 text-white font-medium text-sm rounded shadow-md bg-blue-600 hover:bg-blue-700  focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg">기록</button>
                                )}

                            {formik.submitCount > 0 && formik.errors && (
                                console.error(Object.values(formik.errors).join('\n')))}
                        </div>
                    </form>
                </div>
            </div>
        </div >
    )
}

export default AddForm;