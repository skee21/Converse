import { Profile } from "../page";

type ProfileViewProps = {
  profile: Profile;
  onMatch: () => void;
  onDuel: () => void;
};

const LEADERBOARD = [
  { rank: 1, name: "Sofia M.", xp: "8,240", isMe: false },
  { rank: 2, name: "Carlos R.", xp: "7,880", isMe: false },
  { rank: 3, name: "Yuki T.", xp: "6,550", isMe: false },
  { rank: 4, name: "Anna B.", xp: "5,110", isMe: false },
  { rank: 5, name: "Luis G.", xp: "4,920", isMe: false },
];

export default function ProfileView({ profile, onMatch, onDuel }: ProfileViewProps) {
  // Get initials for avatar (first char of word or first 2 chars)
  const getInitials = (name: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length > 1) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const capitalize = (str: string | null) => {
    if (!str) return "";
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="profile-layout">
      {/* Left Column */}
      <div>
        {/* Profile Card */}
        <div className="section-card" style={{ marginTop: 0 }}>
          <div className="profile-card-header">
            <div className="profile-avatar">{getInitials(profile.username)}</div>
            <div className="profile-info">
              <h2>{profile.username || "User"}</h2>
              <p>Converse Learner</p>
            </div>
          </div>
          <div className="profile-mini-stats">
            <div className="profile-mini-stat">
              <strong>#128</strong>
              <span>Rank</span>
            </div>
            <div className="profile-mini-stat">
              <strong>{profile.points}</strong>
              <span>XP</span>
            </div>
            <div className="profile-mini-stat">
              <strong>{profile.streak}</strong>
              <span>Day Streak</span>
            </div>
            <div className="profile-mini-stat">
              <strong>{profile.is_contributor ? "Yes" : "No"}</strong>
              <span>Contrib.</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="profile-actions-center">
          <button onClick={onMatch} className="main-btn main-btn--accent" type="button">
            Find a Match
          </button>
          <button onClick={onDuel} className="main-btn main-btn--primary" type="button">
            Duel
          </button>
        </div>

        {/* Languages */}
        <div className="section-card">
          <div className="section-title">
            <span>
              <span className="section-heading-chip">Languages</span>
            </span>
            <button className="section-title-edit" type="button">Edit</button>
          </div>

          <div className="lang-section-label">Native</div>
          <div className="lang-item">
            <div>
              <div className="lang-name">{capitalize(profile.native_language)}</div>
            </div>
            <span className="lang-badge">Native</span>
          </div>

          {profile.learning_language && (
            <>
              <div className="lang-section-label" style={{ marginTop: 24 }}>Learning</div>
              <div className="lang-item lang-item--col">
                <div className="lang-item-row">
                  <div>
                    <div className="lang-name">{capitalize(profile.learning_language)}</div>
                    <div className="lang-level">A1 &ndash; Beginner</div>
                  </div>
                  <span className="lang-pct">10%</span>
                </div>
                <div className="lang-progress">
                  <div className="lang-progress-bar" style={{ width: "10%" }} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Statistics */}
        <div className="section-card">
          <div className="section-title">
            <span className="section-heading-chip">Statistics</span>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{profile.streak}</div>
              <div className="stat-label">Day Streak</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{profile.points}</div>
              <div className="stat-label">Total XP</div>
            </div>
            <div className="stat-card stat-card--accent">
              <div className="stat-value">#128</div>
              <div className="stat-label">Global Rank</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{profile.is_contributor ? "Active" : "None"}</div>
              <div className="stat-label">Contributor</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column - Leaderboard */}
      <div className="leaderboard-sidebar">
        <div className="section-card" style={{ marginTop: 0 }}>
          <div className="section-title">
            <span className="section-heading-chip">Leaderboard</span>
          </div>
          {LEADERBOARD.map((entry) => (
            <div
              className={`leaderboard-entry ${entry.isMe ? "leaderboard-entry--me" : ""}`}
              key={entry.rank}
            >
              <div className={`leaderboard-rank ${entry.isMe ? "leaderboard-rank--me" : ""}`}>
                {entry.rank}
              </div>
              <div className="leaderboard-name">{entry.name}</div>
              <div className="leaderboard-xp">{entry.xp} XP</div>
            </div>
          ))}
          {/* Add ME to the bottom of the list dynamically */}
          <div className="leaderboard-entry leaderboard-entry--me">
            <div className="leaderboard-rank leaderboard-rank--me">128</div>
            <div className="leaderboard-name">{profile.username} (You)</div>
            <div className="leaderboard-xp">{profile.points} XP</div>
          </div>
        </div>
      </div>
    </div>
  );
}
