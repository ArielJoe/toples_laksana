import { redirect } from "next/navigation";

import { getAdminSession } from "@/lib/auth";
import LoginPageContent from "./LoginPageContent";

export default async function LoginPage() {
  const session = await getAdminSession();

  if (session) {
    redirect("/admin");
  }

  return <LoginPageContent />;
}
