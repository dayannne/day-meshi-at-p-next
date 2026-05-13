import { LoginForm } from "@/features/auth/components/LoginForm";

type LoginPageProps = {
  searchParams: Promise<{
    signup?: string | string[];
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const { signup } = await searchParams;
  const signupSuccess = signup === "success";

  return (
    <main className="mx-auto max-w-sm p-6">
      <LoginForm signupSuccess={signupSuccess} />
    </main>
  );
}
