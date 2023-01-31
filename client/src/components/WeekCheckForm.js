import { useState, useEffect } from "react";


function WeekCheckForm({ day, setCheckedDays }) {
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
    const today = week[(day - 1 + 7) % 7][0];

    const updateCheckedDays = (copy) => {
        const checkedDays = Object.entries(copy)
            .filter(([day, isChecked]) => isChecked)
            .map(([day]) => day);
        setCheckedDays(checkedDays)
    }

    useEffect(() => {
        const copy = { ...weekCheck };
        copy[today] = true;
        setWeekCheck(copy);

        updateCheckedDays(copy);
    }, []);

    const handleWeekCheck = (e) => {
        const copy = { ...weekCheck };
        copy[e.target.id] = e.target.checked;
        setWeekCheck(copy);

        updateCheckedDays(copy);
    }


    return (
        <div className="flex mt-7 ml-9">
            {week.map((data, i) =>
                <div className="p-2" key={i}>
                    <input
                        type='checkbox'
                        id={data[0]}
                        checked={data[1]}
                        onChange={handleWeekCheck}
                    />
                    <label htmlFor={data[0]}>{data[0]}</label>
                </div>
            )}
        </div>
    )
}

export default WeekCheckForm;