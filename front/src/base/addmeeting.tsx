import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { createMeetingRoom } from "@/interfaces";

export interface CreateMeetingRoom {
  name: string;
  capacity: number;
  location: string;
  equipment: string;
  description: string;
}

export function AddMeeting() {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateMeetingRoom>();

  const handleOk = useCallback(async (values: CreateMeetingRoom) => {
    try {
      values.description = values.description || '';
      values.equipment = values.equipment || '';

      const res = await createMeetingRoom(values);

      if (res.status === 201 || res.status === 200) {
        toast.success('创建成功');
        reset();
        setOpen(false);
      } else {
        toast.error(res.data.data || '创建失败');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('创建会议室时发生错误');
    }
  }, [reset]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="text-[#fe955b] font-bold">添加会议室</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">添加会议室</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleOk)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">会议室名称</Label>
              <Input id="name" className="col-span-3" {...register("name", { required: "会议室名称是必填的" })} />
              {errors.name && <p className="text-red-500 col-span-4 text-right">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">位置</Label>
              <Input id="location" className="col-span-3" {...register("location", { required: "位置是必填的" })} />
              {errors.location && <p className="text-red-500 col-span-4 text-right">{errors.location.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">容纳人数</Label>
              <Input id="capacity" type="number" className="col-span-3" {...register("capacity", { required: "容纳人数是必填的", min: 1 })} />
              {errors.capacity && <p className="text-red-500 col-span-4 text-right">{errors.capacity.message}</p>}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="equipment" className="text-right">设备</Label>
              <Input id="equipment" className="col-span-3" {...register("equipment")} />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">描述</Label>
              <Input id="description" className="col-span-3" {...register("description")} />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">添加</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

