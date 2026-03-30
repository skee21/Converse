from pydantic import BaseModel
from typing import Optional


# ── Auth ──
class RegisterRequest(BaseModel):
    email: str
    password: str
    username: str
    native_language: str


class LoginRequest(BaseModel):
    email: str
    password: str


# ── Profile ──
class ProfileUpdate(BaseModel):
    username: Optional[str] = None
    native_language: Optional[str] = None
    learning_language: Optional[str] = None
    is_contributor: Optional[bool] = None


class ProfileResponse(BaseModel):
    id: str
    username: Optional[str] = None
    native_language: Optional[str] = None
    learning_language: Optional[str] = None
    is_contributor: bool = False
    points: int = 0
    streak: int = 0
    rank: Optional[int] = None


# ── Matchmaking ──
class MatchRequest(BaseModel):
    language: str
    mode: str = "match"  # "match" or "duel"


class MatchResponse(BaseModel):
    match_id: Optional[str] = None
    waiting: bool = False
    opponent_id: Optional[str] = None
    language: str
    mode: str


# ── Grading ──
class GradeResponse(BaseModel):
    grammar: float
    vocabulary: float
    fluency: float
    overall: float
    feedback: str
    xp_earned: int
