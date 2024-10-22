import React from 'react';
import DashboardStatsGrid from '../components/DashboardStatsGrid';
import RealtimeLineChart from '../components/RealTimeLineChart';
import DeviceControlPanel from '../components/DeviceControlPanel';
import DustChart from '../components/Dust';

export default function Dashboard() {
  return (
    <div className='flex flex-col gap-3 p-4 h-screen overflow-y-auto'>
      <DashboardStatsGrid />
      <div className="flex flex-row gap-4 w-full">
        <div className="flex flex-col gap-4 w-full">
          <RealtimeLineChart />
          <div className="mb-4"> {/* Thêm lớp CSS để tạo khoảng cách dưới */}
            <DustChart />
          </div>
        </div>
        <div className="w-3/10">
          <DeviceControlPanel />
        </div>
      </div>
    </div>
  );
}