from fastapi import APIRouter, HTTPException, Header, BackgroundTasks
from config import supabase
from models import MatchRequest, MatchResponse
from services.matchmaking import add_to_queue, remove_from_queue
from services.grading import grade_conversation
from routers.auth import get_user_id
from typing import Optional

router = APIRouter()


# ── Find Match ──
@router.post("/find", response_model=MatchResponse)
async def find_match(
    req: MatchRequest,
    authorization: Optional[str] = Header(None),
):
    user_id = get_user_id(authorization)

    result = await add_to_queue(user_id, req.language, req.mode)

    if result:
        return MatchResponse(
            match_id=result["match_id"],
            waiting=False,
            opponent_id=result["opponent_id"],
            language=result["language"],
            mode=result["mode"],
        )
    else:
        return MatchResponse(
            waiting=True,
            language=req.language,
            mode=req.mode,
        )


# ── Get Match ──
@router.get("/{match_id}")
async def get_match(
    match_id: str,
    authorization: Optional[str] = Header(None),
):
    get_user_id(authorization)  # Validate token

    result = (
        supabase.table("matches")
        .select("*")
        .eq("id", match_id)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Match not found")

    return result.data[0]


# ── End Match ──
@router.post("/{match_id}/end")
async def end_match(
    match_id: str,
    background_tasks: BackgroundTasks,
    authorization: Optional[str] = Header(None),
):
    user_id = get_user_id(authorization)

    # Verify match exists and user is part of it
    result = (
        supabase.table("matches")
        .select("*")
        .eq("id", match_id)
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=404, detail="Match not found")

    match = result.data[0]
    if user_id not in (match["user1_id"], match["user2_id"]):
        raise HTTPException(status_code=403, detail="Not a participant in this match")

    if match["status"] == "completed":
        raise HTTPException(status_code=400, detail="Match already ended")

    # Update match status
    supabase.table("matches").update({
        "status": "completed",
        "ended_at": "now()",
    }).eq("id", match_id).execute()

    # Trigger grading in background
    background_tasks.add_task(grade_conversation, match_id)

    return {"message": "Match ended, grading in progress"}
