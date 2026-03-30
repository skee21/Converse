import { cn } from "../lib/utils";

export default function Attribution({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "w-full px-[100px] pr-[99px] max-xl:px-[60px] max-sm:px-[30px] max-w-[1440px] mx-auto",
        className
      )}
    >
      <div
        className={cn(
          "bg-[#292a32] text-white flex gap-x-[20px] gap-y-[10px] max-lg:flex-wrap justify-center items-center relative",
          "px-[20px] py-[15px]"
        )}
      >
        <p>Website by Skee</p>
      </div>
    </footer>
  );
}
