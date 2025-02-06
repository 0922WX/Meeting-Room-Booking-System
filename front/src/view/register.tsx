/* eslint-disable @typescript-eslint/no-unused-vars */
import { useForm } from "react-hook-form";
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
import { registerCaptcha, register } from "@/interfaces";
import toast, { Toaster } from "react-hot-toast";

export interface RegisterUser {
  username: string;
  nickName: string;
  password: string;
  confirmPassword: string;
  email: string;
  captcha: string;
}

export default function Register() {
  const navigate = useNavigate();
  const {
    register: registerField,
    handleSubmit,
    setError,
    getValues,
    formState: { errors },
  } = useForm<RegisterUser>();

  async function sendCaptcha() {
    const address = getValues("email");
    if (!address) {
      return toast.error("邮箱不能为空");
    }
    const res = await registerCaptcha(address);
    await console.log(res);
    await console.log(address);
    if (res.status === 200 || res.status === 201) {
      toast.success("验证码发送成功！");
    } else {
      toast.error(res.data.message || "验证码发送失败，请稍后再试");
    }
  }

  const onSubmit = async (data: RegisterUser) => {
    if (data.password !== data.confirmPassword) {
      setError("confirmPassword", { message: "密码不匹配" });
      return;
    }
    try {
      const res = await register(data);
      if (res.status === 201 || res.status === 200) {
        toast.success("注册成功！");
        // 注册成功后跳转到登录页面
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(res.data.message || "注册失败，请稍后再试");
      }
    } catch (error) {
      console.error("注册失败:", error);
      toast.error("注册失败，请稍后再试");
    }
  };

  return (
    <main className="flex flex-col items-center justify-center w-screen h-screen bg-[#fe955b]">
      <Card className="w-full max-w-md mx-auto border-2 border-black rounded-none p-4 bg-[#14a49a] flex flex-col">
        <CardHeader></CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-2">
              <Link
                to={"/"}
                className="text-2xl block -translate-y-7 text-[white]"
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
              {errors.username && (
                <p className="text-red-500">{errors.username.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="nickName" className="text-2xl">
                昵称
              </Label>
              <Input
                className="w-full rounded-none border-2 border-black"
                {...registerField("nickName", { required: "昵称必填" })}
              />
              {errors.nickName && (
                <p className="text-red-500">{errors.nickName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-2xl">
                密码
              </Label>
              <Input
                className="w-full rounded-none border-2 border-black"
                type="password"
                {...registerField("password", { required: "密码必填" })}
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-2xl">
                确认密码
              </Label>
              <Input
                className="w-full rounded-none border-2 border-black"
                type="password"
                {...registerField("confirmPassword", {
                  required: "确认密码必填",
                })}
              />
              {errors.confirmPassword && (
                <p className="text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-2xl">
                邮箱
              </Label>
              <Input
                className="w-full rounded-none border-2 border-black"
                type="email"
                {...registerField("email", {
                  required: "邮箱必填",
                  pattern: { value: /^\S+@\S+$/, message: "邮箱格式不正确" },
                })}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="captcha" className="text-2xl">
                验证码
              </Label>
              <Input
                className="w-full rounded-none border-2 border-black"
                {...registerField("captcha", { required: "验证码必填" })}
              />
              {errors.captcha && (
                <p className="text-red-500">{errors.captcha.message}</p>
              )}
              <Button
                type="button"
                className="mt-2 w-full rounded-none font-normal text-xl"
                onClick={sendCaptcha}
              >
                发送验证码
              </Button>
            </div>
            <Button
              type="submit"
              className="w-full rounded-none font-normal text-2xl"
            >
              注册
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center text-xl">
          <Link to="/login" className="text-xl">
            登录
          </Link>
        </CardFooter>
      </Card>
      <Toaster />
    </main>
  );
}
