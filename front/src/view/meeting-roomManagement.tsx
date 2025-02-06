/* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AddMeeting } from "@/base/addmeeting";
import { useCallback, useState, useMemo } from "react";
import { meetingRoomList } from "@/interfaces";
import toast, { Toaster } from "react-hot-toast";
import {
  useReactTable,
  getCoreRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from "@tanstack/react-table";
import { DeleteMeeting } from "@/base/deletemeeting";
import { UpdateMeeting } from "@/base/updatemeeting";

interface SearchMeetingRoom {
  name: string;
  capacity: number;
  equipment: string;
  location: string;
}

export interface MeetingRoomSearchResult {
  id: number;
  name: string;
  capacity: number;
  location: string;
  equipment: string;
  description: string;
  isBooked: boolean;
  createTime: Date;
  updateTime: Date;
}

function MeetingRoomManagement() {
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [meetingRoomResult, setMeetingRoomResult] = useState<Array<MeetingRoomSearchResult>>([]);
  const [searchParams, setSearchParams] = useState<SearchMeetingRoom>({
    name: '',
    capacity: 0,
    equipment: '',
    location: '',
  });

  const columnHelper = createColumnHelper<MeetingRoomSearchResult>();

  const columns = useMemo(
    () => [
      columnHelper.accessor('id', {
        cell: info => info.getValue(),
        header: () => 'ID',
      }),
      columnHelper.accessor('name', {
        cell: info => info.getValue(),
        header: () => '会议室名称',
      }),
      columnHelper.accessor('capacity', {
        cell: info => info.getValue(),
        header: () => '容纳人数',
      }),
      columnHelper.accessor('location', {
        cell: info => info.getValue(),
        header: () => '位置',
      }),
      columnHelper.accessor('equipment', {
        cell: info => info.getValue(),
        header: () => '设备',
      }),
      columnHelper.accessor('description', {
        cell: info => info.getValue(),
        header: () => '描述',
      }),
      columnHelper.accessor('isBooked', {
        cell: info => info.getValue() ? '已预订' : '可用',
        header: () => '状态',
      }),
      columnHelper.accessor('createTime', {
        cell: info => info.getValue().toLocaleString(),
        header: () => '创建时间',
      }),
      columnHelper.accessor('updateTime', {
        cell: info => info.getValue().toLocaleString(),
        header: () => '更新时间',
      }),
    ],
    [columnHelper]
  );

  const table = useReactTable({
    data: meetingRoomResult,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: Math.ceil(meetingRoomResult.length / pageSize),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    onPaginationChange: updater => {
      if (typeof updater === 'function') {
        const newState = updater({ pageIndex, pageSize });
        setPageIndex(newState.pageIndex);
        setPageSize(newState.pageSize);
      }
    },
  });

  const searchMeetingRoom = useCallback(async () => {
    try {
      const res = await meetingRoomList(
        searchParams.name,
        searchParams.capacity,
        searchParams.equipment,
        pageIndex + 1,
        pageSize
      );

      const { data } = res.data;
      if (res.status === 201 || res.status === 200) {
        setMeetingRoomResult(
          data.meetingRooms.map((item: MeetingRoomSearchResult) => ({
            ...item,
            createTime: new Date(item.createTime),
            updateTime: new Date(item.updateTime),
          }))
        );
      } else {
        toast.error(data || '系统繁忙，请稍后再试');
      }
    } catch (error) {
      toast.error('获取数据时发生错误');
    }
  }, [searchParams, pageIndex, pageSize]);

  const handleDeleteSuccess = useCallback(() => {
    searchMeetingRoom();
  }, [searchMeetingRoom]);

  const handleUpdateSuccess = useCallback(() => {
    searchMeetingRoom();
  }, [searchMeetingRoom]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            会议室名称
          </label>
          <Input
            name="name"
            value={searchParams.name}
            onChange={handleInputChange}
            className="w-full rounded-none"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="capacity" className="text-sm font-medium">
            容纳人数
          </label>
          <Input
            name="capacity"
            type="number"
            value={searchParams.capacity || ''}
            onChange={handleInputChange}
            className="w-full rounded-none"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="location" className="text-sm font-medium">
            位置
          </label>
          <Input
            name="location"
            value={searchParams.location}
            onChange={handleInputChange}
            className="w-full rounded-none"
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="equipment" className="text-sm font-medium">
            设备
          </label>
          <Input
            name="equipment"
            value={searchParams.equipment}
            onChange={handleInputChange}
            className="w-full rounded-none"
          />
        </div>
        <div className="flex items-end space-x-3">
          <Button
            className="text-white font-semibold"
            onClick={searchMeetingRoom}
          >
            搜索会议室
          </Button>
          <AddMeeting />
          <UpdateMeeting onUpdateSuccess={handleUpdateSuccess} />
          <DeleteMeeting onDeleteSuccess={handleDeleteSuccess} />
        </div>
      </div>
      <div className="mt-4 bg-white border-2 border-black overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th key={header.id} className="px-4 py-2 text-left">
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map(row => (
              <tr key={row.id}>
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="px-4 py-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <div>
          <span>第 {pageIndex + 1} 页，共 {table.getPageCount()} 页</span>
        </div>
        <div className="space-x-2">
          <Button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            上一页
          </Button>
          <Button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            下一页
          </Button>
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default MeetingRoomManagement;

