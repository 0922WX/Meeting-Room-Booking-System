import { KeyMetrics } from './keyMetrics'
import { RecentBookings } from '../../mock/recentBookings'

export default function Dashboard() {
  return (
    <div className="space-y-6 w-full">
      <h2 className="text-3xl font-bold text-gray-800">仪表板</h2>
      <KeyMetrics />
      <RecentBookings />
    </div>
  )
}

