import Navbar from '../common/Navbar.jsx';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-white to-violet-100">
      <Navbar />
      <main className="max-w-screen-2xl mx-auto py-6 px-6">
        <Outlet />
      </main>
    </div>
  );
}
