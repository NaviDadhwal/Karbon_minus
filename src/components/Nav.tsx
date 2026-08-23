"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart } from "lucide-react";
import { useProject } from "@/context/ProjectContext";
import { AllDemosLoadedError } from "@/lib/demo-templates";
import { useTheme } from "@/context/ThemeContext";
import { notifyError, notifySuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export function Nav({
  projectId,
  minimal,
}: {
  projectId?: string;
  /** Landing: logo only (no theme toggle, no nav links) */
  minimal?: boolean;
}) {
  const pathname = usePathname();
  const { loadDemo, materials } = useProject();
  const { theme, toggleTheme } = useTheme();
  const [isCartOpen, setIsCartOpen] = useState(false);

  const base = projectId ? `/project/${projectId}` : "";

  const links = projectId
    ? [
        { href: `${base}`, label: "Overview" },
        { href: `${base}/materials`, label: "Materials" },
        { href: `${base}/report`, label: "Report" },
      ]
    : [];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[var(--nav-bg)] shadow-[0_8px_32px_-12px_rgba(0,0,0,0.35)] backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--nav-bg)] dark:border-white/[0.08] dark:shadow-[0_8px_40px_-12px_rgba(0,0,0,0.5)]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-accent"
          >
            <Image
              src="/Logo.png"
              alt=""
              width={36}
              height={36}
              className="h-9 w-9 shrink-0 object-contain brightness-75 contrast-125 dark:brightness-100 dark:contrast-100"
              priority
            />
            <span className="font-serif text-lg tracking-tight">
              Karbon Minus
            </span>
          </Link>
          {minimal && (
            <div className="ml-auto flex flex-wrap items-center justify-end gap-3 text-sm">
              <Link
                href="/projects"
                className="text-foreground transition-colors hover:text-accent"
              >
                Your projects
              </Link>
            </div>
          )}
          {!minimal && (
            <nav className="flex flex-wrap items-center gap-4 text-sm md:gap-5">
              <Link
                href="/projects"
                className={cn(
                  "relative pb-1 text-foreground transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-accent after:transition-transform after:duration-300 hover:text-accent hover:after:scale-x-100",
                  pathname === "/projects" &&
                    "font-medium text-accent after:scale-x-100",
                )}
              >
                Projects
              </Link>
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "relative pb-1 text-foreground transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-accent after:transition-transform after:duration-300 hover:text-accent hover:after:scale-x-100",
                    pathname === l.href &&
                      "font-medium text-accent after:scale-x-100",
                  )}
                >
                  {l.label}
                </Link>
              ))}
              {!projectId && (
                <button
                  type="button"
                  onClick={() => {
                    void (async () => {
                      try {
                        const { name } = await loadDemo();
                        notifySuccess("Demo project loaded", name);
                      } catch (e) {
                        if (e instanceof AllDemosLoadedError) {
                          notifyError("No new demos left", e.message);
                        } else {
                          notifyError("Could not load demo", "Please try again.");
                        }
                      }
                    })();
                  }}
                  className="rounded border border-accent-border px-2 py-1 text-accent hover:bg-accent-bg-hover"
                >
                  Load demo
                </button>
              )}

              {/* Real-time Top-Right Cart Button */}
              <button
                type="button"
                onClick={() => setIsCartOpen(true)}
                aria-label={`Open Procurement Cart with ${materials.length} items`}
                className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-accent/40 bg-accent/15 hover:bg-accent/25 text-foreground transition-all duration-200 shadow-[0_0_15px_rgba(23,207,151,0.2)] group"
              >
                <ShoppingCart className="w-4 h-4 text-accent transition-transform group-hover:scale-110" />
                <span className="font-semibold text-xs text-foreground">Cart</span>
                <span
                  className={cn(
                    "inline-flex items-center justify-center text-[11px] font-extrabold font-mono px-2 py-0.5 rounded-full",
                    materials.length > 0
                      ? "bg-accent text-black shadow-sm"
                      : "bg-white/15 text-muted",
                  )}
                >
                  {materials.length}
                </span>
                {materials.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-accent animate-ping opacity-75" />
                )}
              </button>

              {/* Auth Controls */}
              {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
                <>
                  <SignedIn>
                    <div className="flex items-center gap-2">
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-8 h-8 rounded-full border border-accent/40",
                          },
                        }}
                      />
                    </div>
                  </SignedIn>
                  <SignedOut>
                    <Link
                      href="/sign-in"
                      className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-foreground transition"
                    >
                      Sign in
                    </Link>
                  </SignedOut>
                </>
              ) : (
                <Link
                  href="/sign-in"
                  className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-foreground transition"
                >
                  Sign in
                </Link>
              )}

              {/* Dark/Light Theme Toggle */}
              <button
                type="button"
                role="switch"
                aria-checked={theme === "dark"}
                onClick={toggleTheme}
                aria-label={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                className={cn(
                  "relative inline-flex h-7 w-12 items-center rounded-full border border-border-strong/90 bg-white/45 p-0.5 transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-transparent",
                  theme === "dark" && "border-accent-border/70 bg-accent/40",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.25)] transition-transform duration-300",
                    theme === "dark" && "translate-x-5 bg-slate-50",
                  )}
                >
                  <span
                    aria-hidden
                    className="text-[11px] leading-none text-accent"
                  >
                    {theme === "dark" ? "☾" : "☀"}
                  </span>
                </span>
              </button>
            </nav>
          )}
        </div>
      </header>

      {/* Floating Bottom-Right Quick Cart Action Button (Accessible across all project pages) */}
      {!minimal && (
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          aria-label={`Open Procurement Cart (${materials.length} items)`}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 rounded-full bg-accent text-black font-bold text-sm shadow-[0_8px_30px_rgba(23,207,151,0.45)] hover:scale-105 active:scale-95 transition-all duration-300 group border border-black/10 backdrop-blur-md"
        >
          <div className="relative">
            <ShoppingCart className="w-5 h-5 transition-transform group-hover:scale-110" />
            {materials.length > 0 && (
              <span className="absolute -top-2 -right-2.5 min-w-[18px] h-[18px] px-1 rounded-full bg-black text-accent text-[10px] flex items-center justify-center font-black font-mono shadow-sm">
                {materials.length}
              </span>
            )}
          </div>
          <span className="tracking-tight">View Cart ({materials.length})</span>
        </button>
      )}

      {/* Global Real-Time Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}

