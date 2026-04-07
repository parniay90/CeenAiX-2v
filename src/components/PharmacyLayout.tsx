import { Outlet } from 'react-router-dom';
import PharmacySidebar from './PharmacySidebar';
import PharmacyTopNav from './PharmacyTopNav';

export default function PharmacyLayout() {
  return (
    <div className="flex h-screen bg-gray-50">
      <PharmacySidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <PharmacyTopNav />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
