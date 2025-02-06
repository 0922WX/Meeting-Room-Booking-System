
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"


export function UserSearchForm() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          用户名
        </label>
        <Input
          id="username"
          placeholder="输入用户名"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="nickname" className="text-sm font-medium">
          昵称
        </label>
        <Input
          id="nickname"
          placeholder="输入昵称"
          className="w-full"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          邮箱
        </label>
        <Input
          id="email"
          type="email"
          placeholder="输入邮箱"
          className="w-full"
        />
      </div>
      <div className="flex items-end">
        <Button className=" text-white w-full">
          提交用户
        </Button>
      </div>
    </div>
  )
}

