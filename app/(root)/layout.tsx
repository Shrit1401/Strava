import Navbar from "@/components/Navbar";
import BottomNav from "@/components/BottomNav";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar />
      <main className="grow">{children}</main>
      <BottomNav />
    </>
  );
}
