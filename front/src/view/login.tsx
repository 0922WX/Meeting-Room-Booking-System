import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { login } from "@/interfaces";
import toast, { Toaster } from "react-hot-toast";

export interface LoginUser {
  username: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const { register: registerField, handleSubmit } = useForm<LoginUser>();

  const onsubmit = async (data: LoginUser) => {
    const res = await login(data.username, data.password);
    if (res.status === 200 || res.status === 201) {
      toast.success("登录成功");
      localStorage.setItem("access_token", res.data.accessToken);
      localStorage.setItem("refresh_token", res.data.refreshToken);
      localStorage.setItem("user_info", JSON.stringify(res.data.userInfo));

      setTimeout(() => {
        navigate("/home");
      }, 1000);
    } else {
      toast.error(res.data.data || "登录失败");
    }
  };
  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen bg-[#fe955b] ">
      <Card className="w-full max-w-md mx-auto border-2 border-black rounded-none p-4 bg-[#14a49a]">
        <CardHeader></CardHeader>
        <CardContent>
          <form className="space-y-4 " onSubmit={handleSubmit(onsubmit)}>
            <div className="space-y-2 ">
              <Link
                to={"/"}
                className="text-2xl block -translate-y-7  text-[white]"
              >
                返回首页
              </Link>
              <Label htmlFor="username" className="text-2xl">
                账号
              </Label>
              <Input
                className="w-full rounded-none border-2 border-black"
                {...registerField("username", { required: "账号必填" })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-2xl">
                密码
              </Label>
              <Input
                className="w-full rounded-none border-2 border-black"
                id="password"
                type="password"
                {...registerField("password", { required: "密码必填" })}
              />
            </div>
            <Button
              type="submit"
              className="w-full rounded-none font-normal text-2xl"
            >
              登录
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-xl">
        </CardFooter>
      </Card>
      <Toaster />
    </main>
  );
}
