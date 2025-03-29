import Link from "next/link";
import NavLinks from "@/app/ui/dashboard/nav-links";
import Logo from "@/app/ui/logo";
import LogoutButton from "./logoutButton";

export default async function SideNav() {
  return (
    <div className="flex h-full flex-col px-3 py-2 md:px-2 bg-gray-50 border border-gray-400">
      <Link
        className="mb-2 pt-6"
        href="/"
      >
        <div className="w-32 md:w-40">
          <Logo />
        </div>
      </Link>
      <div className="flex grow flex-row justify-between space-x-2 md:overflow-x-hidden md:flex-col md:space-x-0 md:space-y-2">
        <NavLinks />
        <div className="hidden h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
        <div>
          <LogoutButton />
        </div>
      </div>
    </div>
  );
}
