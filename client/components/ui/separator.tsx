// components/ui/separator.tsx
export function Separator({ className = "" }: { className?: string }) {
  return <div className={`w-full h-px bg-border ${className}`} />;
}
