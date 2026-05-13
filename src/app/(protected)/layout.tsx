import { requireActiveUser } from "@/features/auth/access";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  await requireActiveUser();

  return children;
}
