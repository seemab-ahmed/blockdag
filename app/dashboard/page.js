'use client';
import { MainArea } from "../../component/MainArea";
import { useAuthRedirect } from "../../hooks/useAuthRedirect";

export default function DashboardHome() {
  useAuthRedirect();
  return <MainArea />;
}