import { Link } from "react-router-dom";
import { useState } from 'react';
import AuthForm from '../components/AuthForm';
import SignInContext from '../contexts/SignInCheckContext/SignInCheckContext';


function Header() {

    const [authForm, setAuthForm] = useState(false)

    return (
        <>
            {
                authForm === true && <AuthForm setAuthForm={setAuthForm} />
            }


            <header className="text-gray-600 body-font shadow-xl sticky z-20">
                <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                    <div className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                        <Link to="/" className="ml-3 text-xl hover:cursor-pointer">WeekPlanner</Link>
                    </div>
                    <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
                        <Link to='/service' className="mr-5 hover:text-gray-900 cursor-pointer">Routines</Link>

                        <SignInContext.Consumer>
                            {({ isSignIn, setIsSignIn }) => (
                                <>
                                    {isSignIn === null ? (
                                        <div></div>
                                    ) : isSignIn ? (
                                        <div className="mr-5 hover:text-gray-900 cursor-pointer"
                                            onClick={async () => {
                                                try {
                                                    await fetch(`${process.env.REACT_APP_SERVER_URL}/user/signout`, {
                                                        headers: {
                                                            'Content-Type': 'application/json'
                                                        },
                                                        credentials: 'include'
                                                    });
                                                } catch (error) {
                                                    console.error(error);
                                                }
                                                setIsSignIn(false);
                                            }}>
                                            Sign out
                                        </div>
                                    ) : (
                                        <div className="mr-5 hover:text-gray-900 cursor-pointer"
                                            onClick={() => {
                                                setAuthForm(true);
                                            }}>
                                            Sign in
                                        </div>
                                    )}
                                </>)}
                        </SignInContext.Consumer>



                    </nav>
                </div>
            </header>
        </>
    )
}

export default Header;