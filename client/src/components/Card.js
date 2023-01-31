import { useState } from "react";

function Card({ addForm, setAddForm, routines, todayRoutines }) {

    const [nutrients, setNutrients] = useState(['Omega-3', 'multivitimin', 'test', 'test', 'Omega-3', 'multivitimin', 'test', 'test', 'Omega-3', 'multivitimin', 'test', 'test'])


    return (
        <>
            <div className="flex flex-wrap -m-4 px-5 py-10 mx-auto">
                <div className="p-4 sm:w-1/2 md:w-1/3 lg:w-1/4" >
                    <div className="border-dotted border-4 hover:scale-101 rounded-lg h-full p-6 shadow-lg hover:shadow-indigo-500/30 cursor-pointer"
                        onClick={() => {
                            setAddForm(true)
                        }}>
                        <button className='relative top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 text-white bg-indigo-500 px-2 rounded-full text-lg cursor-pointer'>+</button>
                    </div>
                </div>

                {
                    todayRoutines.map((data, i) => {
                        return (
                            <div className="p-4 sm:w-1/2 md:w-1/3 lg:w-1/4" key={i}>
                                <div className=" hover:scale-101 rounded-lg bg-gray-100 p-6 shadow-lg hover:shadow-indigo-500/30 cursor-pointer" style={{ opacity: `100%` }}>
                                    <div className="flex mb-3">
                                        <h2 className="text-gray-900 text-base font-medium max-md:text-sm">{data.title}</h2>
                                        <p className=" text-indigo-500 ml-2 text-sm max-md:text-xs">{data.time}</p>
                                    </div>
                                    <div className=" text-gray-600">
                                        <p className="text-sm break-keep">{data.description}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            </div>


        </>
    )
}



export default Card;