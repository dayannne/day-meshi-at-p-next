import { requireAdmin } from "@/features/auth/access";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return children;
}
