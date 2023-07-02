import { Link } from "react-router-dom";
import videoFile from '../assets/videos/routines.mp4';


function Hero() {
    return (
        <section section className="text-gray-600 body-font" >
            <div className="container mx-auto flex px-5 py-24 md:flex-row flex-col items-center">
                <div className="lg:flex-grow md:w-1/2 lg:pr-24 md:pr-16 flex flex-col md:items-start md:text-left mb-16 md:mb-0 items-center text-center">
                    <h1 className="title-font sm:text-4xl text-3xl mb-4 font-medium text-gray-900">WeekPlanner</h1>
                    <p className="mb-8 leading-relaxed">WeekPlanner는 개인의 주간 루틴을 계획하고 관리하는 데 도움을 주는 온라인 도구입니다. <br />이 서비스는 사용자가 자신의 개발 공부, 운동, 또는 기타 주간 활동을 체계적으로 조직할 수 있도록 지원합니다.</p>
                    <Link to='/service' className="inline-flex text-white bg-indigo-500 border-0 py-2 px-6 focus:outline-none hover:bg-indigo-600 rounded text-lg">시작하기</Link>
                    <div className="flex justify-center">
                    </div>
                </div>
                <div className="lg:max-w-lg lg:w-full md:w-1/2 w-5/6">
                    <video src={videoFile} autoPlay muted loop />
                </div>
            </div>
        </section >

    )
}

export default Hero;