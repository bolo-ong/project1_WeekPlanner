import { useRef, useEffect, useState, useContext } from "react";
import { useFormik } from "formik"
import * as yup from "yup"
import SignInContext from '../contexts/SignInCheckContext/SignInCheckContext';


function AuthForm({ setAuthForm }) {

    const { isSignIn, setIsSignIn } = useContext(SignInContext);
    const [showPw, setShowPw] = useState(false)
    const inputRef = useRef();

    //폼이 열리면, ID 입력란에 자동 포커스 되어 유저가 바로 입력할 수 있도록 구현
    useEffect(() => {
        inputRef.current.focus();
    }, [])

    //esc키로 폼을 닫을 수 있도록 구현
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            setAuthForm(false)
        }
    };
    useEffect(() => { //폼을 닫은 후에도 이벤트가 남아서 램을 낭비하지 않도록 이벤트를 삭제
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);


    //유효성 검증
    const validationSchema = yup.object().shape({
        userId: yup
            .string()
            .required('아이디를 입력해 주세요.')
            .min(4, '4자 이상 입력해 주세요.')
            .max(10, '10자 이하로 입력해 주세요.')
            .matches(/^[a-z0-9_-]+$/, '영문 소문자, 숫자, 밑줄(_), 대시(-)만 사용할 수 있습니다.')
            .matches(/[a-z]/, '최소한 한 글자의 영문 소문자가 포함되어야 합니다.'),

        pw: yup
            .string()
            .required('비밀번호를 입력해 주세요.')
            .max(20, '20자 이내로 작성해 주세요.')
    })

    //폼의 기본값 설정
    const formik = useFormik({
        initialValues: {
            userId: '',
            pw: '',
        },

        //signIn버튼과 singUp버튼을 클릭 시, 로그인 or 회원가입 기능 구현
        onSubmit: async (values) => {
            const { action, ...requestData } = values;
            try {
                if (values.action === 'signIn') {
                    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/signin`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(requestData),
                        credentials: 'include'
                    })
                    if (res.ok) {
                        setIsSignIn(true);
                        setAuthForm(false);
                    } else if (res.status === 404) { //id 오류 시 에러메세지 생성
                        const data = await res.json();
                        const errorMessage = data.message;
                        formik.setFieldError('userId', errorMessage);
                    } else if (res.status === 400) {//pw 오류 시 에러메세지 생성
                        const data = await res.json();
                        const errorMessage = data.message;
                        formik.setFieldError('pw', errorMessage);
                    }
                }
                if (values.action === 'signUp') {
                    const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/user/signup`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(requestData),
                        credentials: 'include'
                    })
                    if (res.ok) {
                        setIsSignIn(true);
                        setAuthForm(false);
                    } else if (!res.ok) {
                        const data = await res.json();
                        const errorMessage = data.message;
                        formik.setFieldError('userId', errorMessage);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        },
        validationSchema
    })



    return (
        <div>
            <div className="fixed w-full h-full z-10">
                <div className="w-full h-full bg-black opacity-80"
                    onMouseDown={() => {
                        setAuthForm(false)
                    }}></div>

                <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 ">
                    <button className="float-right m-1 mr-3 hover:scale-110"
                        onMouseDown={() => {
                            setAuthForm(false)
                        }}>x</button>
                    <form onSubmit={formik.handleSubmit}>
                        <div className="rounded-lg bg-gray-100 p-6">
                            <div>
                                <input className="mt-2 p-1 w-72 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md focus:ring-1"
                                    ref={inputRef}
                                    maxLength="10"
                                    placeholder="아이디"
                                    type="text"
                                    name="userId"
                                    value={formik.values.userId}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                {formik.touched.userId && formik.errors.userId && <p className="w-72 text-sm text-red-400 ml-1">{formik.errors.userId}</p>}
                            </div>
                            <div>
                                <input className="mt-3 p-1 w-full bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block rounded-md focus:ring-1"
                                    maxLength="20"
                                    placeholder="비밀번호"
                                    type={showPw ? 'text' : 'password'}
                                    name="pw"
                                    value={formik.values.pw}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                />
                                <p className="inline-block text-sm ml-1 cursor-pointer hover:scale-105 hover:text-blue-500"
                                    onClick={() => { setShowPw(!showPw) }}>  {showPw ? '비밀번호 숨기기' : '비밀번호 보이기'}</p>
                                {formik.touched.pw && formik.errors.pw && <p className="text-sm text-red-400 ml-1">{formik.errors.pw}</p>}
                            </div>



                            {formik.isSubmitting ? (
                                <button
                                    type="submit"
                                    className="block w-full py-1.5 mt-8 text-white font-medium text-sm rounded shadow-md bg-blue-500"
                                >
                                    ...
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="block w-full py-1.5 mt-8 text-white font-medium text-sm rounded shadow-md bg-blue-600 hover:bg-blue-700  focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg"
                                    onClick={() => {
                                        formik.setFieldValue('action', 'signIn');
                                    }}
                                >
                                    로그인
                                </button>
                            )}

                            {formik.isSubmitting ? (
                                <button
                                    type="submit"
                                    className="block w-full py-1.5 mt-3 text-white font-medium text-sm rounded shadow-md bg-teal-500"
                                >
                                    ...
                                </button>
                            ) : (
                                <button
                                    type="submit"
                                    className="block w-full py-1.5 mt-3 text-white font-medium text-sm rounded shadow-md bg-teal-600 hover:bg-teal-700  focus:bg-teal-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-teal-800 active:shadow-lg"
                                    onClick={() => {
                                        formik.setFieldValue('action', 'signUp');
                                    }}
                                >
                                    회원가입
                                </button>
                            )}

                            {formik.submitCount > 0 && formik.errors && (
                                console.error(Object.values(formik.errors).join('\n'))
                            )}


                        </div>
                    </form>
                </div>
            </div>
        </div >
    )
}

export default AuthForm;