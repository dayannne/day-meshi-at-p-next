import { connection } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";

export async function HealthyEnvironment() {
  await connection();

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("healthy_environment")
    .select("environment")
    .single();

  if (error) {
    return (
      <section className="rounded-md border border-red-200 bg-red-50 p-4 text-red-900">
        <h2 className="text-lg font-semibold">Environment Check</h2>
        <p className="mt-2 text-sm">Database connection failed.</p>
      </section>
    );
  }

  return (
    <section className="rounded-md border border-stone-200 bg-white p-4 text-stone-950">
      <h2 className="text-lg font-semibold">Environment Check</h2>
      <p className="mt-2 text-sm">Current environment: {data.environment}</p>
    </section>
  );
}
