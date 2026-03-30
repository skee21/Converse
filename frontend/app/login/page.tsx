"use client";

import { useState } from "react";
import Link from "next/link";
import Logo from "../components/Logo";
import Button from "../components/Button";
import "./login.css";

const LANGUAGES = [
  { value: "english", label: "English" },
  { value: "spanish", label: "Spanish" },
  { value: "french", label: "French" },
  { value: "german", label: "German" },
  { value: "japanese", label: "Japanese" },
  { value: "chinese", label: "Chinese (Mandarin)" },
  { value: "arabic", label: "Arabic" },
  { value: "portuguese", label: "Portuguese" },
  { value: "korean", label: "Korean" },
  { value: "hindi", label: "Hindi" },
  { value: "urdu", label: "Urdu" },
];

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

type Step = "auth" | "onboarding";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<Step>("auth");
  const [showPassword, setShowPassword] = useState(false);

  // Stored after successful signup
  const [signupData, setSignupData] = useState<{
    accessToken: string;
    userId: string;
    nativeLanguage: string;
  } | null>(null);

  // Onboarding state
  const [learningLanguage, setLearningLanguage] = useState("");
  const [isContributor, setIsContributor] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const formData = new FormData(form);

    if (!isSignUp) {
      // Login
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;

      try {
        const res = await fetch("http://localhost:8000/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (res.ok && data.access_token) {
          localStorage.setItem("access_token", data.access_token);
          localStorage.setItem("user_id", data.user_id);
          window.location.href = "/main";
        } else {
          setError(data.detail || "Invalid email or password");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      }
    } else {
      // Signup
      const email = formData.get("email") as string;
      const password = formData.get("password") as string;
      const username = formData.get("fullname") as string;
      const nativeLanguage = formData.get("nativeLanguage") as string;

      try {
        const res = await fetch("http://localhost:8000/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            password,
            username,
            native_language: nativeLanguage,
          }),
        });
        const data = await res.json();
        if (res.ok && data.user_id) {
          setSignupData({
            accessToken: data.access_token,
            userId: data.user_id,
            nativeLanguage,
          });
          setStep("onboarding");
        } else {
          setError(data.detail || "Registration failed");
        }
      } catch {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  const handleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!learningLanguage) {
      setError("Please select a language to learn");
      return;
    }

    if (!signupData) return;

    try {
      const res = await fetch("http://localhost:8000/auth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${signupData.accessToken}`,
        },
        body: JSON.stringify({
          learning_language: learningLanguage,
          is_contributor: isContributor,
        }),
      });

      if (res.ok) {
        localStorage.setItem("access_token", signupData.accessToken);
        localStorage.setItem("user_id", signupData.userId);
        window.location.href = "/main";
      } else {
        const data = await res.json();
        setError(data.detail || "Failed to save preferences");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  // Get native language label for contributor question
  const nativeLangLabel = signupData
    ? LANGUAGES.find((l) => l.value === signupData.nativeLanguage)?.label || signupData.nativeLanguage
    : "";

  // Filter out native language from learning options
  const learningOptions = LANGUAGES.filter(
    (l) => l.value !== signupData?.nativeLanguage
  );

  // ── Onboarding Step ──
  if (step === "onboarding") {
    return (
      <div className="login-page">
        <nav className="login-nav">
          <Link href="/" aria-label="Home">
            <Logo className="h-[36px]" />
          </Link>
        </nav>

        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
              <h1 className="login-title">Almost There</h1>
              <p className="login-subtitle">
                Tell us about your language goals
              </p>
            </div>

            {error && <div className="login-error">{error}</div>}

            <form onSubmit={handleOnboarding} className="login-form">
              {/* Language to Learn */}
              <div className="login-field">
                <label htmlFor="learning-lang" className="login-label">
                  Which language do you want to learn?
                </label>
                <select
                  id="learning-lang"
                  className="login-input"
                  value={learningLanguage}
                  onChange={(e) => setLearningLanguage(e.target.value)}
                  required
                >
                  <option value="">Select a language</option>
                  {learningOptions.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Contributor Toggle */}
              <div className="onboarding-contributor">
                <div className="onboarding-contributor-text">
                  <p className="onboarding-contributor-title">
                    Become a Contributor
                  </p>
                  <p className="onboarding-contributor-desc">
                    Help others learn {nativeLangLabel} by chatting with learners.
                    You will earn Contribution Points (CP) for every session.
                  </p>
                </div>
                <button
                  type="button"
                  className={`onboarding-toggle ${isContributor ? "onboarding-toggle--active" : ""}`}
                  onClick={() => setIsContributor(!isContributor)}
                  aria-pressed={isContributor}
                >
                  <span className="onboarding-toggle-knob" />
                </button>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full justify-center py-[19px]"
              >
                Get Started
              </Button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ── Auth Step (Login / Sign Up) ──
  return (
    <div className="login-page">
      {/* Navigation */}
      <nav className="login-nav">
        <Link href="/" aria-label="Home">
          <Logo className="h-[36px]" />
        </Link>
        <Link href="/" className="login-back-link">
          Back to Home
        </Link>
      </nav>

      {/* Main Content */}
      <div className="login-container">
        <div className="login-card">
          {/* Header */}
          <div className="login-header">
            <h1 className="login-title">
              {isSignUp ? "Create Account" : "Welcome Back"}
            </h1>
            <p className="login-subtitle">
              {isSignUp
                ? "Join Converse and start practicing languages with real people"
                : "Sign in to continue your language journey"}
            </p>
          </div>

          {/* Toggle Tabs */}
          <div className="login-tabs">
            <button
              className={`login-tab ${!isSignUp ? "login-tab--active" : ""}`}
              onClick={() => { setIsSignUp(false); setError(""); setShowPassword(false); }}
              type="button"
            >
              Log In
            </button>
            <button
              className={`login-tab ${isSignUp ? "login-tab--active" : ""}`}
              onClick={() => { setIsSignUp(true); setError(""); setShowPassword(false); }}
              type="button"
            >
              Sign Up
            </button>
          </div>

          {/* Error Message */}
          {error && <div className="login-error">{error}</div>}

          {/* Form */}
          <form onSubmit={handleSubmit} className="login-form">
            {isSignUp && (
              <div className="login-field">
                <label htmlFor="fullname" className="login-label">
                  Full Name
                </label>
                <input
                  id="fullname"
                  name="fullname"
                  type="text"
                  autoComplete="name"
                  placeholder="Enter your full name"
                  className="login-input"
                  required
                />
              </div>
            )}

            <div className="login-field">
              <label htmlFor="email" className="login-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="Enter your email"
                className="login-input"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="password" className="login-label">
                Password
              </label>
              <div className="login-password-wrapper">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  placeholder={isSignUp ? "Create a password" : "Enter your password"}
                  className="login-input login-input--password"
                  required
                />
                <button
                  type="button"
                  className="login-eye-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            {isSignUp && (
              <div className="login-field">
                <label htmlFor="native-lang" className="login-label">
                  Native Language
                </label>
                <select
                  id="native-lang"
                  name="nativeLanguage"
                  className="login-input"
                  required
                >
                  <option value="">Select your native language</option>
                  {LANGUAGES.map((lang) => (
                    <option key={lang.value} value={lang.value}>
                      {lang.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {!isSignUp && (
              <div className="login-actions-row">
                <label className="login-remember">
                  <input type="checkbox" name="remember" />
                  <span>Remember me</span>
                </label>
                <button type="button" className="login-forgot">
                  Forgot password?
                </button>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full justify-center py-[19px]"
            >
              {isSignUp ? "Create Account" : "Log In"}
            </Button>
          </form>

          {/* Footer */}
          <p className="login-footer-text">
            {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              type="button"
              className="login-switch"
              onClick={() => { setIsSignUp(!isSignUp); setError(""); }}
            >
              {isSignUp ? "Log In" : "Sign Up"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
