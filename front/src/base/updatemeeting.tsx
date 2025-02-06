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
import { updateMeetingRoom, findMeetingRoom } from "@/interfaces";

export interface UpdateMeetingRoom {
  id: number;
  name: string;
  capacity: number;
  location: string;
  equipment: string;
  description: string;
}

interface UpdateMeetingProps {
  onUpdateSuccess: () => void;
}

export function UpdateMeeting({ onUpdateSuccess }: UpdateMeetingProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<UpdateMeetingRoom>();

  const fetchMeetingRoom = useCallback(async (id: number) => {
    setIsLoading(true);
    try {
      const response = await findMeetingRoom(id);
      if (response.status === 200) {
        const meetingRoom = response.data;
        setValue("name", meetingRoom.name);
        setValue("capacity", meetingRoom.capacity);
        setValue("location", meetingRoom.location);
        setValue("equipment", meetingRoom.equipment);
        setValue("description", meetingRoom.description);
      } else {
        throw new Error("获取会议室信息失败");
      }
    } catch (e) {
      console.error(e);
      toast.error("获取会议室信息失败");
    } finally {
      setIsLoading(false);
    }
  }, [setValue]);

  const handleUpdate = useCallback(
    async (data: UpdateMeetingRoom) => {
      setIsLoading(true);
      try {
        const response = await updateMeetingRoom(data);
        if (response.status === 200 || response.status === 204) {
          toast.success("更新成功");
          reset();
          setOpen(false);
          onUpdateSuccess();
        } else {
          throw new Error("更新失败");
        }
      } catch (e) {
        console.error(e);
        toast.error("更新失败");
      } finally {
        setIsLoading(false);
      }
    },
    [reset, onUpdateSuccess]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-yellow-600 hover:bg-yellow-500 text-white font-bold">
          更新会议室
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">更新会议室</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleUpdate)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id" className="text-right">
                会议室ID
              </Label>
              <Input
                id="id"
                type="number"
                className="col-span-3"
                {...register("id", { 
                  required: "会议室ID是必填的",
                  valueAsNumber: true,
                  validate: (value) => value > 0 || "ID必须大于0"
                })}
                onBlur={(e) => {
                  const id = parseInt(e.target.value);
                  if (id > 0) {
                    fetchMeetingRoom(id);
                  }
                }}
              />
              {errors.id && (
                <p className="text-red-500 col-span-4 text-right">
                  {errors.id.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                会议室名称
              </Label>
              <Input
                id="name"
                className="col-span-3"
                {...register("name", { required: "会议室名称是必填的" })}
              />
              {errors.name && (
                <p className="text-red-500 col-span-4 text-right">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="capacity" className="text-right">
                容纳人数
              </Label>
              <Input
                id="capacity"
                type="number"
                className="col-span-3"
                {...register("capacity", { 
                  required: "容纳人数是必填的",
                  valueAsNumber: true,
                  validate: (value) => value > 0 || "容纳人数必须大于0"
                })}
              />
              {errors.capacity && (
                <p className="text-red-500 col-span-4 text-right">
                  {errors.capacity.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                位置
              </Label>
              <Input
                id="location"
                className="col-span-3"
                {...register("location", { required: "位置是必填的" })}
              />
              {errors.location && (
                <p className="text-red-500 col-span-4 text-right">
                  {errors.location.message}
                </p>
              )}
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="equipment" className="text-right">
                设备
              </Label>
              <Input
                id="equipment"
                className="col-span-3"
                {...register("equipment")}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                描述
              </Label>
              <Input
                id="description"
                className="col-span-3"
                {...register("description")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "更新中..." : "更新"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

