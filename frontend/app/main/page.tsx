"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Logo from "../components/Logo";
import ProfileView from "./components/ProfileView";
import ChatWindow from "./components/ChatWindow";
import "./main.css";

export type Profile = {
  id: string;
  username: string;
  native_language: string;
  learning_language: string | null;
  points: number;
  streak: number;
  is_contributor: boolean;
};

export default function MainPage() {
  const router = useRouter();
  const [view, setView] = useState<"profile" | "chat">("profile");
  const [chatMode, setChatMode] = useState<"match" | "duel">("match");
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Profile | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    // Validate the token with the backend
    fetch("http://localhost:8000/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setIsAuthed(true);
        setLoading(false);
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("user_id");
        router.replace("/login");
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user_id");
    router.push("/login");
  };

  const handleMatch = () => {
    setChatMode("match");
    setView("chat");
  };

  const handleDuel = () => {
    setChatMode("duel");
    setView("chat");
  };

  const handleBack = () => {
    setView("profile");
  };

  if (loading || !isAuthed || !profile) {
    return (
      <div className="main-page" style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh" }}>
        <p style={{ fontSize: 18, color: "#888" }}>Loading...</p>
      </div>
    );
  }

  return (
    <div className="main-page">
      {/* Top Bar */}
      <nav className="main-nav">
        <Link href="/" aria-label="Home">
          <Logo className="h-[36px]" />
        </Link>
        <div className="main-nav-actions">
          <button
            onClick={handleMatch}
            className="main-btn main-btn--primary"
            type="button"
          >
            Find a Match
          </button>
          <button
            onClick={handleDuel}
            className="main-btn main-btn--outline"
            type="button"
          >
            Duel
          </button>
        </div>
        <button onClick={handleLogout} className="main-logout" type="button">
          Log Out
        </button>
      </nav>

      {/* Content */}
      <div className="main-content">
        {view === "profile" && (
          <ProfileView profile={profile} onMatch={handleMatch} onDuel={handleDuel} />
        )}
        {view === "chat" && (
          <ChatWindow mode={chatMode} onBack={handleBack} />
        )}
      </div>
    </div>
  );
}
