'use client';
import { Header } from "../../component/Header";
import { SideBar } from "../../component/SideBar";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";

export default function DashboardLayout({ children }) {
  useAuthRedirect();
  return (
      <div className="__className_ee1788">
        <main data-sidebar="deactive">
          <div className="style_main__zYIqd">
            <SideBar />
            <div className="style_wrapper__OhGxi">
              <Header />
              {children}
            </div>
          </div>
        </main>
      </div>
  );
}