import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const invoices = [
  {
    invoice: "INV001",
    paymentStatus: "Paid",
    totalAmount: "$250.00",
    paymentMethod: "Credit Card",
    action: <a href="">操作</a>,
  },
  {
    invoice: "INV002",
    paymentStatus: "Pending",
    totalAmount: "$150.00",
    paymentMethod: "PayPal",
    action: <a href="">操作</a>,
  },
  {
    invoice: "INV003",
    paymentStatus: "Unpaid",
    totalAmount: "$350.00",
    paymentMethod: "Bank Transfer",
    action: <a href="">操作</a>,
  },
  {
    invoice: "INV004",
    paymentStatus: "Paid",
    totalAmount: "$450.00",
    paymentMethod: "Credit Card",
    action: <a href="">操作</a>,
  },
  {
    invoice: "INV005",
    paymentStatus: "Paid",
    totalAmount: "$550.00",
    paymentMethod: "PayPal",
    action: <a href="">操作</a>,
  },
  {
    invoice: "INV006",
    paymentStatus: "Pending",
    totalAmount: "$200.00",
    paymentMethod: "Bank Transfer",
    action: <a href="">操作</a>,
  },
  {
    invoice: "INV007",
    paymentStatus: "Unpaid",
    totalAmount: "$300.00",
    paymentMethod: "Credit Card",
    action: <a href="">操作</a>,
  },
];

export function MeetingList() {
  return (
    <div className="space-y-4 ">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-black text-lg">名称</TableHead>
            <TableHead className="text-black text-lg">容纳人数</TableHead>
            <TableHead className="text-black text-lg">位置</TableHead>
            <TableHead className="text-black text-lg">设备</TableHead>
            <TableHead className="text-black text-lg">描述</TableHead>
            <TableHead className="text-black text-lg">添加时间</TableHead>
            <TableHead className="text-black text-lg">上次更新时间</TableHead>
            <TableHead className="text-black text-lg">预定状态</TableHead>
            <TableHead className="text-black text-lg">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {invoices.map((invoice) => (
            <TableRow key={invoice.invoice}>
              <TableCell>{invoice.invoice}</TableCell>
              <TableCell>{invoice.paymentStatus}</TableCell>
              <TableCell>{invoice.paymentMethod}</TableCell>
              <TableCell>{invoice.totalAmount}</TableCell>
              <TableCell>{invoice.action}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
