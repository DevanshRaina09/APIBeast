import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-[#0f1117]">
      <Sidebar />
      <main className="flex-1 transition-all duration-300 ease-in-out">
        {children}
      </main>
    </div>
  );
}
