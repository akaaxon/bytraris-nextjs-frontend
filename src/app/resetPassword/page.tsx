// app/resetPassword/page.tsx
import { redirect } from "next/navigation";
import ResetPasswordForm from "../../components/ResetPasswordForm";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token;

  if (!token) {
    redirect("/");
  }

  return <ResetPasswordForm token={token} />;
}
