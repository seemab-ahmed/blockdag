import { Header } from "@/component/Header";
import { SideBar } from "@/component/SideBar";


export default function DashboardLayout({ children }) {
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