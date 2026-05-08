import { HealthyEnvironment } from "@/features/healthy/components/healthy-environment";

// このコンポーネントがどの種類のデータベースに接続されているかを確認できます。
export default function HealthyPage() {
  return (
    <div className="min-h-screen bg-stone-50 p-6">
        <HealthyEnvironment />
    </div>
  );
}
