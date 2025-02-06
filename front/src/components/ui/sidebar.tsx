import { Calendar, Users, BarChart,Bird ,Calculator} from 'lucide-react'
import { Link } from 'react-router-dom'

export function Sidebar() {
  return (
    <aside className="w-64  border-r-4 border-black">
      <div className="p-6 border-b-4 border-black bg-[white]">
        <h1 className="text-3xl font-bold text-gray-800 ">会议预订系统</h1>
      </div>
      <nav className="mt-6 ">
        <Link to="/home/dashboard" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
          <BarChart className="w-5 h-5 mr-3" />
          仪表板
        </Link>
        <Link to="/home/meetingroomManagement" className="flex items-center px-6 py-3 text-gray-700 hover:bg-gray-100">
          <Bird className="w-5 h-5 mr-3" />
          会议室管理
        </Link>
        <Link to="/home/reservationManagement" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100">
          <Calendar className="w-5 h-5 mr-3" />
          预订管理
        </Link>
        <Link to="/home/userManagement" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100">
          <Users className="w-5 h-5 mr-3" />
          用户管理
        </Link>
        <Link to="/home/statics" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100">
          <Calculator className="w-5 h-5 mr-3" />
          统计
        </Link>
        {/* <Link to="/home/systemSetting" className="flex items-center px-6 py-3 text-gray-600 hover:bg-gray-100">
          <Settings className="w-5 h-5 mr-3" />
          系统设置
        </Link> */}
      </nav>
    </aside>
  )
}
