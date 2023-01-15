import Header from '../components/Header';
import Card from '../components/Card'
import { useEffect, useState } from 'react';
import AddForm from '../components/AddForm';



function Service() {

    const date = new Date();
    const hour = date.getHours()
    const min = date.getMinutes()
    const progress = (hour * 60 + min) / 60 / 24 * 100
    const [addForm, setAddForm] = useState(false)

    useEffect(() => {

    })

    return (
        <>
            {
                addForm === true && <AddForm addForm={addForm} setAddForm={setAddForm} />
            }
            <Header />
            <div className='min-h-[90vh] container mx-auto flex'>
                <div className='flex flex-col-reverse mx-8 mt-8 mb-3 w-2.5 bg-gray-300 rounded-full'>
                    <div className='w-2.5 bg-indigo-300 rounded-full' style={{ height: `${progress}%` }}></div>
                </div>
                <Card addForm={addForm} setAddForm={setAddForm} />
            </div>
        </>
    )
}

export default Service;