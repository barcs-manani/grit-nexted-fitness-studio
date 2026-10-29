import { DashboardClient } from "@/components/account/DashboardClient";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AccountSettingsDashboard(){
    const accountInfo = await getCurrentUser();
    if (!accountInfo) redirect("/");

    return <DashboardClient accountInfo={accountInfo} />
}