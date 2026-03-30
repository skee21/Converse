"use client";

import { cn } from "../lib/utils";
import LinkedInIcon from "@/app/assets/icons/linkedin.svg";
import FacebookIcon from "@/app/assets/icons/facebook.svg";
import TwitterIcon from "@/app/assets/icons/twitter.svg";
import Link from "next/link";
import Logo from "./Logo";

const navLinks = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How It Works" },
  { href: "#contact", label: "Contact" },
  { href: "/login", label: "Login" },
];

export default function Footer({ className }: { className?: string }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className={cn(
        "flex flex-col items-start px-[100px] pr-[99px] max-xl:px-[60px] max-sm:px-[30px] py-0 relative w-full max-w-[1440px] mx-auto",
        className
      )}
    >
      <div
        className={cn(
          "bg-[#191a23] flex flex-col items-start relative rounded-tl-[45px] rounded-tr-[45px] shrink-0 w-full",
          "gap-[50px] max-lg:gap-[40px] max-md:gap-[30px]",
          "px-[60px] max-lg:px-[40px] max-md:px-[30px]",
          "pb-[50px] pt-[55px] max-lg:pb-[40px] max-lg:pt-[40px] max-md:pb-[30px] max-md:pt-[40px]"
        )}
      >
        <div className="flex flex-col gap-[66px] max-lg:gap-[40px] items-start relative w-full">
          {/* Top section: Logo, Navigation, Social Icons */}
          <div className="flex justify-between items-center relative w-full gap-[20px] max-lg:flex-wrap">
            {/* Logo with white fill */}
            <Logo className="w-[180px] h-[30px] text-white" />

            {/* Navigation Links */}
            <div className="flex font-normal gap-[40.5px] max-xl:gap-[20px] items-start leading-[normal] relative shrink-0 text-[18px] text-white underline max-lg:w-full max-lg:order-1 flex-wrap">
              {navLinks.map(({ href, label }, index) => (
                <Link
                  key={index}
                  href={href}
                  className="[text-decoration-skip-ink:none] [text-underline-position:from-font] underline-offset-1 decoration-solid relative shrink-0"
                >
                  {label}
                </Link>
              ))}
            </div>

            {/* Social Icons */}
            <div className="h-[30px] relative shrink-0 flex gap-[20px] items-center">
              {[
                {
                  icon: LinkedInIcon,
                  href: ".",
                  label: "LinkedIn",
                },
                {
                  icon: FacebookIcon,
                  href: ".",
                  label: "Facebook",
                },
                {
                  icon: TwitterIcon,
                  href: ".",
                  label: "Twitter",
                },
              ].map(({ icon: Icon, href, label }, index) => (
                <Link
                  key={index}
                  href={href}
                  className="block max-w-none size-full"
                  aria-label={label}
                >
                  <Icon width={30} height={30} />
                </Link>
              ))}
            </div>
          </div>

          {/* Middle section: Contact Info + Contact Form */}
          <div
            className="flex gap-[30px] items-start justify-between relative shrink-0 w-full max-md:flex-col max-md:items-start"
            id="contact"
          >
            {/* Contact Information */}
            <div className="flex flex-col gap-[27px] items-start relative flex-1 max-lg:flex-2">
              <div className="flex flex-col items-start relative">
                <div className="bg-[#b9ff66] flex flex-col items-start px-[7px] py-0 relative rounded-[7px]">
                  <p className="font-medium leading-[normal] relative shrink-0 text-[20px] text-black">
                    Contact us:
                  </p>
                </div>
              </div>
              <div className="flex flex-col font-normal gap-[20px] items-start relative text-[18px] text-white">
                <p className="leading-[normal] relative">
                  Email: hello@converse.app
                </p>
                <p className="leading-[normal] relative">
                  Support: support@converse.app
                </p>
              </div>
            </div>

            {/* Contact Form */}
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-[20px] relative flex-1 max-w-[500px] max-md:max-w-none max-md:w-full"
            >
              <input
                type="text"
                name="name"
                placeholder="Name"
                autoComplete="name"
                className="w-full px-[20px] py-[14px] rounded-[14px] border border-white/30 bg-transparent text-white text-[16px] font-normal outline-none placeholder:text-white/50 focus:border-[#b9ff66] transition-colors"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                autoComplete="email"
                required
                suppressHydrationWarning
                className="w-full px-[20px] py-[14px] rounded-[14px] border border-white/30 bg-transparent text-white text-[16px] font-normal outline-none placeholder:text-white/50 focus:border-[#b9ff66] transition-colors"
              />
              <textarea
                name="message"
                placeholder="Message"
                required
                rows={3}
                className="w-full px-[20px] py-[14px] rounded-[14px] border border-white/30 bg-transparent text-white text-[16px] font-normal outline-none placeholder:text-white/50 focus:border-[#b9ff66] transition-colors resize-none"
              />
              <button
                type="submit"
                className="bg-[#b9ff66] text-black font-medium text-[18px] px-[35px] py-[16px] rounded-[14px] cursor-pointer hover:bg-[#a8e55a] transition-colors"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="h-0 relative shrink-0 w-full border-t xl:-mt-px border-white"></div>

        {/* Bottom section: Line and Copyright */}
        <div className="flex font-normal gap-x-[41px] gap-y-[10px] items-start relative text-[18px]/[28px] text-white w-full flex-wrap">
          <p className="relative">&copy; 2025 Converse. All Rights Reserved.</p>
          <Link
            href="."
            className="[text-decoration-skip-ink:none] [text-underline-position:from-font] decoration-solid relative underline"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  );
}
