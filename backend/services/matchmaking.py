from config import supabase
from typing import Optional
import asyncio

# In-memory matchmaking queue
# Structure: { language: [{ user_id, mode }] }
waiting_queue: dict[str, list[dict]] = {}
queue_lock = asyncio.Lock()


async def add_to_queue(
    user_id: str, language: str, mode: str
) -> Optional[dict]:
    """
    Add user to the matchmaking queue.
    Returns match info dict if paired, None if waiting.
    """
    async with queue_lock:
        if language not in waiting_queue:
            waiting_queue[language] = []

        # Check if someone is waiting for the same language and mode
        for i, waiter in enumerate(waiting_queue[language]):
            if waiter["mode"] == mode and waiter["user_id"] != user_id:
                # Found a match — pair them
                partner = waiting_queue[language].pop(i)

                # Create match record in Supabase
                result = (
                    supabase.table("matches")
                    .insert({
                        "user1_id": partner["user_id"],
                        "user2_id": user_id,
                        "language": language,
                        "mode": mode,
                        "status": "active",
                    })
                    .execute()
                )

                match_data = result.data[0]
                return {
                    "match_id": match_data["id"],
                    "opponent_id": partner["user_id"],
                    "language": language,
                    "mode": mode,
                }

        # No partner found — check if user is already in queue
        for waiter in waiting_queue[language]:
            if waiter["user_id"] == user_id:
                return None  # Already waiting

        # Add to queue
        waiting_queue[language].append({"user_id": user_id, "mode": mode})
        return None


async def remove_from_queue(user_id: str):
    """Remove a user from all queues."""
    async with queue_lock:
        for language in waiting_queue:
            waiting_queue[language] = [
                w for w in waiting_queue[language] if w["user_id"] != user_id
            ]
