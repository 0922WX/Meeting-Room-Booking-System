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
import { deleteMeetingRoom } from "@/interfaces";

export interface DeleteMeetingRoom {
  id: number;
}

interface DeleteMeetingProps {
  onDeleteSuccess: () => void;
}

export function DeleteMeeting({ onDeleteSuccess }: DeleteMeetingProps) {
  const [open, setOpen] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeleteMeetingRoom>();

  const handleDelete = useCallback(
    async (data: DeleteMeetingRoom) => {
      try {
        const response = await deleteMeetingRoom(data.id);
        console.log(response);
        if (response.status === 200 || response.status === 204) {
          toast.success("删除成功");
          reset();
          setOpen(false);
          onDeleteSuccess();
        } else {
          throw new Error("删除失败");
        }
      } catch (e) {
        console.error(e);
        toast.error("删除失败");
      }
    },
    [reset, onDeleteSuccess]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-700 hover:bg-red-500 text-white font-bold">
          删除会议室
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-center">删除会议室</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleDelete)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="id" className="text-right col-span-1">
                会议室ID
              </Label>
              <Input
                id="id"
                type="number"
                className="col-span-3"
                {...register("id", { required: "会议室ID是必填的" })}
              />
              {errors.id && (
                <p className="text-red-500 col-span-4 text-right">
                  {errors.id.message}
                </p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">删除</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

