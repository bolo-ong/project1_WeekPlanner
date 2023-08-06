import { useState } from 'react';
import AuthForm from './AuthForm';

function AuthOverlay() {
    const [authForm, setAuthForm] = useState(false)

    return (
        <>
            {
                authForm === true && <AuthForm setAuthForm={setAuthForm} />
            }


            <div className="fixed w-full h-full z-10"
                onClick={() => {
                    setAuthForm(true);
                }}>
                {/* <div className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 ">
                    <span className="text-gray-500">더미 데이터 입니다</span>
                    <span className="text-blue-500 cursor-pointer"> 로그인</span>
                    <span className="text-gray-500"> 후 이용해 주세요</span>
                </div> */}

            </div>

        </>
    )
}

export default AuthOverlay;