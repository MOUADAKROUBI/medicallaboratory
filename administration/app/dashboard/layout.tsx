import SideNav from "@/app/ui/dashboard/sidenav";
import { Footer } from "../ui/footer";
// import { Toast, ToastProvider } from "../../ui/toast";

export default function Layout({
  children,
}: {
  readonly children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      {/* <ToastProvider>
        <Toast /> */}
      <div className="flex-grow p-6 md:overflow-y-auto md:p-12">
        <div>{children}</div>
        <Footer />
      </div>
      {/* </ToastProvider> */}
    </div>
  );
}
