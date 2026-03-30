from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from config import supabase
import json
from datetime import datetime, timezone

router = APIRouter()

# Active WebSocket connections: { match_id: { user_id: WebSocket } }
active_connections: dict[str, dict[str, WebSocket]] = {}


async def authenticate_ws(websocket: WebSocket) -> str | None:
    """Authenticate WebSocket via token query param."""
    token = websocket.query_params.get("token")
    if not token:
        return None
    try:
        user_response = supabase.auth.get_user(token)
        return user_response.user.id
    except Exception:
        return None


@router.websocket("/ws/chat/{match_id}")
async def chat_websocket(websocket: WebSocket, match_id: str):
    # Authenticate
    user_id = await authenticate_ws(websocket)
    if not user_id:
        await websocket.close(code=4001, reason="Unauthorized")
        return

    # Verify user is part of this match
    result = (
        supabase.table("matches")
        .select("*")
        .eq("id", match_id)
        .execute()
    )

    if not result.data:
        await websocket.close(code=4004, reason="Match not found")
        return

    match = result.data[0]
    if user_id not in (match["user1_id"], match["user2_id"]):
        await websocket.close(code=4003, reason="Not a participant")
        return

    # Accept connection
    await websocket.accept()

    # Register connection
    if match_id not in active_connections:
        active_connections[match_id] = {}
    active_connections[match_id][user_id] = websocket

    # Notify partner that user joined
    partner_id = (
        match["user2_id"] if user_id == match["user1_id"] else match["user1_id"]
    )
    if partner_id in active_connections.get(match_id, {}):
        try:
            await active_connections[match_id][partner_id].send_json({
                "type": "system",
                "content": "Your partner has connected.",
                "timestamp": datetime.now(timezone.utc).isoformat(),
            })
        except Exception:
            pass

    try:
        while True:
            # Receive message
            data = await websocket.receive_text()
            message = json.loads(data)
            content = message.get("content", "")

            if not content.strip():
                continue

            timestamp = datetime.now(timezone.utc).isoformat()

            # Save to Supabase
            supabase.table("messages").insert({
                "match_id": match_id,
                "sender_id": user_id,
                "content": content,
            }).execute()

            # Broadcast to partner
            if partner_id in active_connections.get(match_id, {}):
                try:
                    await active_connections[match_id][partner_id].send_json({
                        "type": "message",
                        "sender_id": user_id,
                        "content": content,
                        "timestamp": timestamp,
                    })
                except Exception:
                    pass

            # Echo back to sender with confirmation
            await websocket.send_json({
                "type": "message_sent",
                "content": content,
                "timestamp": timestamp,
            })

    except WebSocketDisconnect:
        # Clean up
        if match_id in active_connections:
            active_connections[match_id].pop(user_id, None)
            if not active_connections[match_id]:
                del active_connections[match_id]

        # Notify partner
        if partner_id in active_connections.get(match_id, {}):
            try:
                await active_connections[match_id][partner_id].send_json({
                    "type": "system",
                    "content": "Your partner has disconnected.",
                    "timestamp": datetime.now(timezone.utc).isoformat(),
                })
            except Exception:
                pass

    except Exception:
        # Clean up on any error
        if match_id in active_connections:
            active_connections[match_id].pop(user_id, None)
            if not active_connections[match_id]:
                del active_connections[match_id]
