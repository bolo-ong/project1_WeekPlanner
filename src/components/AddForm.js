import { useRef, useEffect } from "react";

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


    return (
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
                        <form className="flex justify-between">
                            <input ref={inputRef} type="text" name="title" minLength="1" maxLength="100" className=" mt-1 p-1 mr-1 w-min bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md focus:ring-1" placeholder="Title"></input>
                            <input type="time" name="time" className="ml-1 mt-1 p-1 w-min  bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md focus:ring-1"></input>
                        </form>
                    </div>
                    <div className=" text-gray-600">
                        <textarea type="text" name="content" minLength="1" maxLength="300" className="mt-1 p-1 mr-1 h-32 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-sky-500 block w-full rounded-md focus:ring-1" placeholder="Content"></textarea>
                    </div>
                    <button disabled className="cursor-pointer w-full py-1.5 mt-3 bg-blue-600 text-white font-medium text-sm rounded shadow-md hover:bg-blue-700  focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg">기록</button>
                </div>
            </div>
        </div>
    )
}

export default AddForm;