import React, { useState, useEffect } from 'react';
import SignInContext from './SignInCheckContext'

function SignInProvider({ children }) {

    const [isSignIn, setIsSignIn] = useState(null);

    useEffect(() => {
        const signInCheck = async () => {
            try {
                const res = await fetch(`${process.env.REACT_APP_SERVER_URL}/api/user/signin/success`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include'
                })
                if (res.ok) {
                    setIsSignIn(true)
                } else {
                    setIsSignIn(false)
                }
            } catch (error) {
                console.log(error);
            }
        }
        signInCheck()
    }, []);



    return (
        <SignInContext.Provider value={{ isSignIn, setIsSignIn }}>
            {children}
        </SignInContext.Provider>
    );
}


export default SignInProvider;
