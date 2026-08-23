"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingCart, Menu, X, Sparkles } from "lucide-react";
import { useProject } from "@/context/ProjectContext";
import { AllDemosLoadedError } from "@/lib/demo-templates";
import { useTheme } from "@/context/ThemeContext";
import { notifyError, notifySuccess } from "@/lib/toast";
import { cn } from "@/lib/utils";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CreditBadge } from "@/components/subscription/CreditBadge";
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-accent shrink-0"
          >
            <Image
              src="/Logo.png"
              alt=""
              width={34}
              height={34}
              className="h-8 w-8 sm:h-9 sm:w-9 shrink-0 object-contain brightness-75 contrast-125 dark:brightness-100 dark:contrast-100"
              priority
            />
            <span className="font-serif text-base sm:text-lg tracking-tight">
              Karbon Minus
            </span>
          </Link>

          {minimal ? (
            <div className="ml-auto flex items-center justify-end gap-3 text-sm">
              <Link
                href="/pricing"
                className="text-foreground transition-colors hover:text-accent"
              >
                Pricing
              </Link>
              <Link
                href="/projects"
                className="text-foreground transition-colors hover:text-accent"
              >
                Your projects
              </Link>
            </div>
          ) : (
            <>
              {/* Desktop Navigation (md and up) */}
              <nav className="hidden md:flex items-center gap-4 text-sm lg:gap-5">
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

                <Link
                  href="/pricing"
                  className={cn(
                    "relative pb-1 text-foreground transition-colors duration-300 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-left after:scale-x-0 after:rounded-full after:bg-accent after:transition-transform after:duration-300 hover:text-accent hover:after:scale-x-100",
                    pathname === "/pricing" &&
                      "font-medium text-accent after:scale-x-100",
                  )}
                >
                  Pricing
                </Link>

                {/* Real-time Credits Badge */}
                <CreditBadge size="sm" />

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
                    className="rounded border border-accent-border px-2 py-1 text-xs text-accent hover:bg-accent-bg-hover transition"
                  >
                    Load demo
                  </button>
                )}

                {/* Top-Right Cart Button */}
                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  aria-label={`Open Procurement Cart with ${materials.length} items`}
                  className="relative inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-accent/40 bg-accent/15 hover:bg-accent/25 text-foreground transition-all duration-200 shadow-[0_0_15px_rgba(23,207,151,0.2)] group"
                >
                  <ShoppingCart className="w-3.5 h-3.5 text-accent transition-transform group-hover:scale-110" />
                  <span className="font-semibold text-xs text-foreground">Cart</span>
                  <span
                    className={cn(
                      "inline-flex items-center justify-center text-[10px] font-extrabold font-mono px-1.5 py-0.2 rounded-full",
                      materials.length > 0
                        ? "bg-accent text-black shadow-sm"
                        : "bg-white/15 text-muted",
                    )}
                  >
                    {materials.length}
                  </span>
                  {materials.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-accent animate-ping opacity-75" />
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
                              avatarBox: "w-7 h-7 rounded-full border border-accent/40",
                            },
                          }}
                        />
                      </div>
                    </SignedIn>
                    <SignedOut>
                      <Link
                        href="/sign-in"
                        className="px-2.5 py-1 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-foreground transition"
                      >
                        Sign in
                      </Link>
                    </SignedOut>
                  </>
                ) : (
                  <Link
                    href="/sign-in"
                    className="px-2.5 py-1 rounded-lg border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-semibold text-foreground transition"
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
                    "relative inline-flex h-6 w-11 items-center rounded-full border border-border-strong/90 bg-white/45 p-0.5 transition-colors duration-300 focus:outline-none",
                    theme === "dark" && "border-accent-border/70 bg-accent/40",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.25)] transition-transform duration-300",
                      theme === "dark" && "translate-x-5 bg-slate-50",
                    )}
                  >
                    <span
                      aria-hidden
                      className="text-[9px] leading-none text-accent"
                    >
                      {theme === "dark" ? "☾" : "☀"}
                    </span>
                  </span>
                </button>
              </nav>

              {/* Mobile Right Bar (Cart, Credit, Mobile Hamburger) */}
              <div className="flex md:hidden items-center gap-2">
                <CreditBadge size="sm" />

                <button
                  type="button"
                  onClick={() => setIsCartOpen(true)}
                  aria-label="Open Cart"
                  className="relative p-2 rounded-xl bg-accent/15 border border-accent/40 text-accent transition"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {materials.length > 0 && (
                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-accent text-black text-[9px] font-black font-mono flex items-center justify-center">
                      {materials.length}
                    </span>
                  )}
                </button>

                {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
                  <SignedIn>
                    <UserButton
                      afterSignOutUrl="/"
                      appearance={{
                        elements: {
                          avatarBox: "w-7 h-7 rounded-full border border-accent/40",
                        },
                      }}
                    />
                  </SignedIn>
                ) : null}

                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  aria-label="Toggle navigation menu"
                  className="p-2 rounded-xl bg-white/5 border border-white/10 text-foreground hover:bg-white/10 transition"
                >
                  {isMobileMenuOpen ? (
                    <X className="w-5 h-5 text-accent" />
                  ) : (
                    <Menu className="w-5 h-5 text-foreground" />
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        {/* Mobile Dropdown Menu Panel */}
        {!minimal && isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/10 bg-[var(--nav-bg)] px-4 py-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
            <div className="grid grid-cols-2 gap-2 text-sm font-medium">
              <Link
                href="/projects"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "p-2.5 rounded-xl border border-white/10 bg-white/5 text-foreground hover:bg-white/10 transition",
                  pathname === "/projects" && "border-accent/40 text-accent bg-accent/10",
                )}
              >
                Projects
              </Link>
              <Link
                href="/pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "p-2.5 rounded-xl border border-white/10 bg-white/5 text-foreground hover:bg-white/10 transition",
                  pathname === "/pricing" && "border-accent/40 text-accent bg-accent/10",
                )}
              >
                Pricing
              </Link>
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "p-2.5 rounded-xl border border-white/10 bg-white/5 text-foreground hover:bg-white/10 transition col-span-2 sm:col-span-1",
                    pathname === l.href && "border-accent/40 text-accent bg-accent/10",
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
              {!projectId && (
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-accent/40 bg-accent/10 text-xs font-semibold text-accent hover:bg-accent/20 transition"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Load Demo Project</span>
                </button>
              )}

              {/* Theme toggle */}
              <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-muted">Theme</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={theme === "dark"}
                  onClick={toggleTheme}
                  className={cn(
                    "relative inline-flex h-6 w-11 items-center rounded-full border border-border-strong/90 bg-white/45 p-0.5 transition-colors duration-300",
                    theme === "dark" && "border-accent-border/70 bg-accent/40",
                  )}
                >
                  <span
                    className={cn(
                      "inline-flex h-4 w-4 items-center justify-center rounded-full bg-white shadow-sm transition-transform duration-300",
                      theme === "dark" && "translate-x-5 bg-slate-50",
                    )}
                  >
                    <span className="text-[9px] text-accent">
                      {theme === "dark" ? "☾" : "☀"}
                    </span>
                  </span>
                </button>
              </div>

              {/* Sign in if signed out */}
              {process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ? (
                <SignedOut>
                  <Link
                    href="/sign-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-foreground"
                  >
                    Sign in
                  </Link>
                </SignedOut>
              ) : (
                <Link
                  href="/sign-in"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="px-3 py-1.5 rounded-xl border border-white/15 bg-white/5 text-xs font-semibold text-foreground"
                >
                  Sign in
                </Link>
              )}
            </div>
          </div>
        )}
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
          <span className="tracking-tight hidden sm:inline">View Cart ({materials.length})</span>
        </button>
      )}

      {/* Global Real-Time Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
}
