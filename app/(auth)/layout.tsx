import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Navbar isAuth />
      <main className="grow bg-[#111]">{children}</main>
    </>
  );
}
