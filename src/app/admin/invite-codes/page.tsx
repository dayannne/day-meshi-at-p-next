import { redirect } from "next/navigation";

import { getAdminAccess } from "@/features/admin/invite-codes/auth";
import { InviteCodeIssuer } from "@/features/admin/invite-codes/components/InviteCodeIssuer";

export default async function AdminInviteCodesPage() {
  const adminAccess = await getAdminAccess();

  if (!adminAccess.ok && adminAccess.reason === "unauthenticated") {
    redirect("/login");
  }

  if (!adminAccess.ok) {
    redirect("/home/places");
  }

  return (
    <main className="mx-auto max-w-2xl p-6">
      <InviteCodeIssuer />
    </main>
  );
}
