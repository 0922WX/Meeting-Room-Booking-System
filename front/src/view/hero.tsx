import MainLeft from "@/base/mainLeft";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div className="grid grid-cols-2 grid-rows-10 h-screen w-screen">
      <nav className="row-span-1 bg-white border-black border-2 w-screen flex justify-between  items-center">
        <h1 className="text-center p-3 font-bold">会议室预订系统-后台管理</h1>
        <div className="flex justify-around items-center border-black border-l-2 h-full w-1/6">
          <div className="border-black border-r-2 w-full h-full text-c flex items-center justify-center text-lg select-none cursor-pointer">
            <Link to="/login">登录</Link>
          </div>
        </div>
      </nav>
      <div className="col-span-1 row-start-2 row-span-9 bg-[#14a49a] border-r-2 border-black ">
        <MainLeft />
      </div>
      <div className="col-span-1 row-start-2 row-span-9 bg-[#fe955b] flex justify-center items-center">
        <div className="w-3/5 h-3/5  bg-[#14a49a] rounded-full border-black border-4">
          <div className="bg-[#14a49a] rounded-full border-black border-4 w-12 h-6"></div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
