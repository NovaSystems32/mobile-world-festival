import Sidebar from "@/components/admin/Sidebar";
import { getUnreadCount } from "@/lib/actions/contact";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const unread = await getUnreadCount();

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "#0D1525" }}
    >
      <Sidebar unreadMessages={unread} />
      <main className="flex-1 overflow-auto min-w-0">{children}</main>
    </div>
  );
}
