// features/review/components/PriceSelector.tsx
import { TagButton } from "@/components/ui/TagButton";
import { PRICE_LEVELS } from "@/components/google-maps/constants";

interface PriceSelectorProps {
  value: number | null;
  isFilter?: boolean;
  required?: boolean;
  onChange: (value: number) => void;
}

export function PriceSelector({
  value,
  isFilter = false,
  required = false,
  onChange,
}: PriceSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="bg-neutral h-5 w-1.5 rounded-full" /> {/* 縦線 */}
        <h3 className="text-sm font-bold text-slate-950">
          価格帯{(isFilter || required) && <span className="text-red-500"> *</span>}
        </h3>
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
