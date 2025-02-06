import { Sidebar } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export default function Home() {
  return (
    <div className="flex h-screen bg-gray-100 w-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}

