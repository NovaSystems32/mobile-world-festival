import Sidebar from "@/components/admin/Sidebar";
import { getUnreadCount } from "@/lib/actions/contact";
import { getPendingOrdersCount } from "@/lib/actions/orders";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [unread, pendingOrders] = await Promise.all([
    getUnreadCount(),
    getPendingOrdersCount(),
  ]);

  return (
    <div
      className="flex min-h-screen"
      style={{ background: "#0D1525" }}
    >
      <Sidebar unreadMessages={unread} pendingOrders={pendingOrders} />
      <main className="flex-1 overflow-auto min-w-0">{children}</main>
    </div>
  );
}
