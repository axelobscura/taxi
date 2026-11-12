import { redirect } from "next/navigation";
import { currentUser, userCount } from "@/lib/auth";
import AuthForm from "./AuthForm";

export const metadata = {
  title: "Entrar",
  robots: { index: false, follow: false },
};

export default async function EntrarPage() {
  if (await currentUser()) redirect("/flota");
  const firstAccount = (await userCount()) === 0;
  return <AuthForm firstAccount={firstAccount} />;
}
