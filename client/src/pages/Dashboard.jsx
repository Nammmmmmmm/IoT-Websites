import React from 'react'
import DashboardStatsGrid from '../components/DashboardStatsGrid'
import RealtimeLineChart from '../components/RealTimeLineChart'
import DeviceControlPanel from '../components/DeviceControlPanel'

export default function Dashboard() {
  return (
    <div className='flex flex-col gap-3 p-4'>
      <DashboardStatsGrid />
      <div className="flex flex-row gap-4 w-full">
				<RealtimeLineChart />
        <DeviceControlPanel />
			</div>
    </div>
  )
}
