"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Lock, User, Globe, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { login } from "@/lib/api/auth";

type Lang = "en" | "ja";

const labels: Record<Lang, {
  title: string;
  subtitle: string;
  username: string;
  password: string;
  signIn: string;
  signingIn: string;
  usernamePlaceholder: string;
  passwordPlaceholder: string;
}> = {
  en: {
    title: "Aizo Billing",
    subtitle: "Order Management System",
    username: "Username",
    password: "Password",
    signIn: "Sign In",
    signingIn: "Signing in...",
    usernamePlaceholder: "Enter your username",
    passwordPlaceholder: "Enter your password",
  },
  ja: {
    title: "Aizo Billing",
    subtitle: "注文管理システム",
    username: "ユーザー名",
    password: "パスワード",
    signIn: "ログイン",
    signingIn: "ログイン中...",
    usernamePlaceholder: "ユーザー名を入力",
    passwordPlaceholder: "パスワードを入力",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<Lang>("en");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const t = labels[lang];

  // Redirect if already logged in
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.token) {
          router.push("/");
        }
      } catch {
        // invalid data, stay on login
      }
    }
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      toast.error(lang === "en" ? "Please fill in all fields" : "すべてのフィールドを入力してください");
      return;
    }

    setIsLoading(true);
    try {
      const data = await login({ username, password });
      if (data.success) {
        localStorage.setItem("user", JSON.stringify(data));
        toast.success(lang === "en" ? "Welcome back!" : "おかえりなさい！");
        router.push("/");
      } else {
        toast.error(lang === "en" ? "Invalid credentials" : "認証情報が無効です");
      }
    } catch {
      toast.error(lang === "en" ? "Login failed. Please try again." : "ログインに失敗しました。もう一度お試しください。");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4">
      {/* Gradient mesh background */}
      <div className="pointer-events-none absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/60 to-slate-100" />
        {/* Radial blob top-left */}
        <div
          className="absolute -left-[20%] -top-[10%] h-[600px] w-[600px] rounded-full opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(191,219,254,0.6) 0%, transparent 70%)",
          }}
        />
        {/* Radial blob bottom-right */}
        <div
          className="absolute -bottom-[15%] -right-[15%] h-[700px] w-[700px] rounded-full opacity-35"
          style={{
            background:
              "radial-gradient(circle, rgba(199,210,254,0.5) 0%, transparent 70%)",
          }}
        />
        {/* Radial blob center-top */}
        <div
          className="absolute left-[40%] top-[10%] h-[500px] w-[500px] rounded-full opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(165,180,252,0.4) 0%, transparent 65%)",
          }}
        />
      </div>

      {/* Login card */}
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-xl"
      >
        {/* Language toggle */}
        <div className="absolute right-6 top-6 flex items-center gap-1">
          <Globe className="mr-1 h-3.5 w-3.5 text-slate-400" />
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
              lang === "en"
                ? "bg-slate-900 text-white"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            EN
          </button>
          <button
            type="button"
            onClick={() => setLang("ja")}
            className={`rounded px-2 py-0.5 text-xs font-medium transition-colors ${
              lang === "ja"
                ? "bg-slate-900 text-white"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            日本語
          </button>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-bold tracking-tight text-slate-900">
            {t.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">{t.subtitle}</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="username"
              className="text-sm font-medium text-slate-700"
            >
              {t.username}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="username"
                type="text"
                placeholder={t.usernamePlaceholder}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10"
                autoComplete="username"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="password"
              className="text-sm font-medium text-slate-700"
            >
              {t.password}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                id="password"
                type="password"
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
                autoComplete="current-password"
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t.signingIn}
              </>
            ) : (
              t.signIn
            )}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
