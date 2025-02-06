
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const recentBookings = [
  { id: 1, user: "张三", room: "会议室A", date: "2023-06-15", time: "14:00-15:00" },
  { id: 2, user: "李四", room: "会议室B", date: "2023-06-15", time: "15:30-16:30" },
  { id: 3, user: "王五", room: "会议室C", date: "2023-06-16", time: "10:00-11:00" },
  { id: 4, user: "赵六", room: "会议室A", date: "2023-06-16", time: "13:00-14:00" },
  { id: 5, user: "钱七", room: "会议室B", date: "2023-06-17", time: "09:00-10:00" },
]

export function RecentBookings() {
  return (
    <div>
      <h3 className="text-xl font-semibold mb-4">最近预订</h3>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>用户</TableHead>
            <TableHead>会议室</TableHead>
            <TableHead>日期</TableHead>
            <TableHead>时间</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentBookings.map((booking) => (
            <TableRow key={booking.id}>
              <TableCell>{booking.user}</TableCell>
              <TableCell>{booking.room}</TableCell>
              <TableCell>{booking.date}</TableCell>
              <TableCell>{booking.time}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

