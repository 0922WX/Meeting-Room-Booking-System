import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function MainLeft() {
  return (
    <div className="w-full h-full justify-center items-center flex">
      <div className="w-3/5 h-2/5 flex flex-col justify-around ">
        <div>
          <div className="font-bold">
            <h1 className="pb-2">这是一个</h1>
            <h1>会议预订系统.</h1>
          </div>
        </div>
        <h3 className="font-semibold">基于nest,react,shadcn设计与实现</h3>
        <Link to="/login">
          <Button className="w-4/5 rounded-none font-medium tracking-widest hover:bg-gray-700">
            快&nbsp; 速&nbsp; 开&nbsp; 始
          </Button>
        </Link>
      </div>
    </div>
  );
}
