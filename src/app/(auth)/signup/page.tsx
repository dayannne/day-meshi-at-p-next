import { SignupForm } from "@/features/auth/components/SignupForm";

type SignupPageProps = {
  searchParams: Promise<{
    inviteCode?: string | string[];
  }>;
};

export default async function SignupPage({ searchParams }: SignupPageProps) {
  const { inviteCode } = await searchParams;
  const initialInviteCode = Array.isArray(inviteCode) ? inviteCode[0] : inviteCode;

  return (
    <main className="mx-auto max-w-sm p-6">
      <SignupForm initialInviteCode={initialInviteCode ?? ""} />
    </main>
  );
}
