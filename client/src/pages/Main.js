import Layout from '../components/Layout';
import Hero from '../components/Hero';
import Footer from '../components/Footer';

function Main() {
    return (
        <>
            <div className="h-screen flex flex-col justify-between">
                <Layout />
                <Hero />
                <Footer />
            </div>
        </>
    )
}

export default Main;