import { BottomNav } from "@/components/BottomNav";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-background relative shadow-xl overflow-hidden pb-16">
      {children}
      <BottomNav />
    </div>
  );
}
