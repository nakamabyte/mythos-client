import TopBar from "@/components/layout/TopBar";
import TradeNotifications from "@/components/layout/TradeNotifications";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <div className="flex flex-1">
        <main className="flex-1 w-full bg-canvas flex flex-col">
          {children}
        </main>
      </div>
      <TradeNotifications />
    </div>
  );
}
