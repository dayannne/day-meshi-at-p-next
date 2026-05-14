import type { GoogleMapStatusContent } from "./types";

type GoogleMapStatusMessageProps = GoogleMapStatusContent;

export function GoogleMapStatusMessage({ title, message }: GoogleMapStatusMessageProps) {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-50">
      <div className="rounded-md border border-slate-200 bg-white px-4 py-3 text-center shadow-sm">
        <p className="text-sm font-semibold text-slate-900">{title}</p>
        <p className="mt-1 text-xs text-slate-500">{message}</p>
      </div>
    </div>
  );
}
