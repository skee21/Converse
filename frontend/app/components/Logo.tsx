import { cn } from "../lib/utils";

export default function Logo({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      role="img"
      aria-label="Converse Logo"
      {...props}
      className={cn("relative flex items-center", className)}
    >
      <span className="font-medium text-[28px] leading-none tracking-tight fill-current">
        Converse
      </span>
    </div>
  );
}
