// features/review/components/PriceSelector.tsx
import { TagButton } from "@/components/ui/TagButton";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { PRICE_LEVELS } from "@/components/google-maps/constants";

interface PriceSelectorProps {
  value: number | null;
  isFilter?: boolean;
  onChange: (value: number) => void;
}

export function PriceSelector({ value, isFilter = false, onChange }: PriceSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="bg-neutral h-5 w-1.5 rounded-full" /> {/* 縦線 */}
        <h3 className="text-sm text-slate-950">価格帯</h3>
        {isFilter && <span className="text-red-500">*</span>}
      </div>
      <div className="flex flex-wrap gap-2">
        {PRICE_LEVELS.map((level) => (
          <TagButton
            key={level.value}
            tagColor={"neutral"}
            isActive={value === level.value}
            onClick={() => onChange?.(level.value)}
            className="h-auto rounded-full text-sm font-medium"
          >
            {level.label}
          </TagButton>
        ))}
      </div>
    </div>
  );
}
