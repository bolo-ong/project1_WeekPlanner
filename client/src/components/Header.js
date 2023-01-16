import { Link } from "react-router-dom";


function Header() {

    return (
        <header class="text-gray-600 body-font shadow-xl">
            <div class="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                <div class="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
                    <Link to="/" class="ml-3 text-xl hover:cursor-pointer">Tailblocks</Link>
                </div>
                <nav class="md:ml-auto flex flex-wrap items-center text-base justify-center">
                    <Link to='/service' class="mr-5 hover:text-gray-900 cursor-pointer">SERVICE</Link>
                    <Link to='/posts' class="mr-5 hover:text-gray-900 cursor-pointer">POSTS</Link>
                    <Link to='/' class="mr-5 hover:text-gray-900 cursor-pointer">MY</Link>
                </nav>
            </div>
        </header>
    )
}

export default Header;