import { HealthyEnvironment } from "@/app/_components/healthy-environment";

// このページは、データベース環境のヘルスチェック用ページです。
// このコンポーネントがどの種類のデータベースに接続されているかを確認できます。
export default function HealthyPage() {
  return (
    <div className="min-h-screen bg-stone-50 p-6">
        <HealthyEnvironment />
    </div>
  );
}
