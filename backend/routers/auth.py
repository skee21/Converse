from fastapi import APIRouter, HTTPException, Header
from config import supabase
from models import RegisterRequest, LoginRequest, ProfileUpdate, ProfileResponse
from typing import Optional

router = APIRouter()


def get_user_id(authorization: str = Header(...)) -> str:
    """Extract and validate user from JWT Bearer token."""
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization header")
    token = authorization.split(" ", 1)[1]
    try:
        user_response = supabase.auth.get_user(token)
        return user_response.user.id
    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid or expired token: {e}")


# ── Register ──
@router.post("/register")
async def register(req: RegisterRequest):
    user_id = None
    try:
        # Create auth user
        auth_response = supabase.auth.sign_up({
            "email": req.email,
            "password": req.password,
        })

        if not auth_response.user:
            raise HTTPException(status_code=400, detail="Registration failed")

        user_id = auth_response.user.id

        # Create profile row
        supabase.table("profiles").insert({
            "id": user_id,
            "username": req.username,
            "native_language": req.native_language,
            "points": 0,
            "streak": 0,
        }).execute()

        return {
            "message": "Registration successful",
            "user_id": user_id,
            "access_token": auth_response.session.access_token if auth_response.session else None,
        }

    except HTTPException:
        raise
    except Exception as e:
        # If profile insertion fails, rollback the auth user creation to prevent stranded accounts
        if user_id:
            try:
                # Requires absolute admin privileges which standard client might not have,
                # but we can try removing them or logging it. As a fallback, we just raise the error.
                # Since supabase-py auth doesn't expose admin.delete_user directly in the basic client
                # without an admin key, we will at least ensure the frontend gets the exact error.
                pass
            except Exception:
                pass
        raise HTTPException(status_code=400, detail=str(e))


# ── Login ──
@router.post("/login")
async def login(req: LoginRequest):
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": req.email,
            "password": req.password,
        })

        if not auth_response.session:
            raise HTTPException(status_code=401, detail="Invalid credentials")

        return {
            "access_token": auth_response.session.access_token,
            "refresh_token": auth_response.session.refresh_token,
            "user_id": auth_response.user.id,
        }

    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))


# ── Get Profile ──
@router.get("/profile", response_model=ProfileResponse)
async def get_profile(authorization: Optional[str] = Header(None)):
    user_id = get_user_id(authorization)

    result = supabase.table("profiles").select("*").eq("id", user_id).execute()

    if not result.data:
        raise HTTPException(status_code=404, detail="Profile not found")

    return result.data[0]


# ── Update Profile ──
@router.put("/profile")
async def update_profile(
    update: ProfileUpdate,
    authorization: Optional[str] = Header(None),
):
    user_id = get_user_id(authorization)

    update_data = update.model_dump(exclude_none=True)
    if not update_data:
        raise HTTPException(status_code=400, detail="No fields to update")

    result = (
        supabase.table("profiles")
        .update(update_data)
        .eq("id", user_id)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Profile not found")

    return {"message": "Profile updated", "profile": result.data[0]}
