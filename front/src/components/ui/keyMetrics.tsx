
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function KeyMetrics() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 ">
      <Card className="rounded-none border-2 border-black">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 ">
          <CardTitle className="text-sm font-medium">总预订数</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">1,234</div>
          <p className="text-xs text-muted-foreground">较上月 +20%</p>
        </CardContent>
      </Card>
      <Card  className="rounded-none border-2 border-black">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">本月预订数</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">345</div>
          <p className="text-xs text-muted-foreground">较上月 +5%</p>
        </CardContent>
      </Card>
      <Card  className="rounded-none border-2 border-black">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">会议室使用率</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">75%</div>
          <p className="text-xs text-muted-foreground">较上月 +2%</p>
        </CardContent>
      </Card>
      <Card  className="rounded-none border-2 border-black">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">活跃用户数</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">573</div>
          <p className="text-xs text-muted-foreground">较上月 +12%</p>
        </CardContent>
      </Card>
    </div>
  )
}
