import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import MobileBar from '../components/MobileBar';

export default function PublicLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow pb-16 md:pb-0">
                <Outlet />
            </main>
            <Footer />
            <MobileBar />
        </div>
    );
}
