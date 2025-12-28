import BottomNav from "@/components/BottomNav";
import Navbar from "@/components/Navbar";

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
