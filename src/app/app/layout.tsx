import TopBar from "@/components/layout/TopBar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <TopBar />
      <div className="flex flex-1">
        <main className="flex-1 w-full bg-canvas">
          <div className="max-w-[1200px] mx-auto p-6 md:p-10 lg:p-12">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
