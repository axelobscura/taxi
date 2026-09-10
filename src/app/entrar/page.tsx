import { redirect } from "next/navigation";
import { currentUser } from "@/lib/auth";
import AuthForm from "./AuthForm";

export const metadata = { title: "Entrar · TAXI_MEX" };

export default async function EntrarPage() {
  if (await currentUser()) redirect("/flota");
  return <AuthForm />;
}
