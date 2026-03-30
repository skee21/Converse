import json
from config import supabase, gemini_model


GRADING_PROMPT = """You are an expert language tutor. Analyze this conversation between a language learner and a native speaker.

Grade the LEARNER's performance on a scale of 0 to 10 for each category:
- grammar: correctness of grammar and sentence structure
- vocabulary: range and appropriateness of vocabulary used
- fluency: natural flow and coherence of responses
- overall: overall language proficiency demonstrated

Also provide brief, constructive feedback (2-3 sentences max).

Calculate XP earned as: overall_score * 10.

Respond ONLY with valid JSON in this exact format, no markdown:
{"grammar": 0.0, "vocabulary": 0.0, "fluency": 0.0, "overall": 0.0, "feedback": "...", "xp_earned": 0}

Here is the conversation transcript:
"""


async def grade_conversation(match_id: str):
    """
    Background task: fetch chat history, grade via Gemini, update user points.
    """
    try:
        # 1. Get match details
        match_result = (
            supabase.table("matches")
            .select("*")
            .eq("id", match_id)
            .execute()
        )

        if not match_result.data:
            return

        match = match_result.data[0]

        # 2. Fetch messages
        messages_result = (
            supabase.table("messages")
            .select("*")
            .eq("match_id", match_id)
            .order("created_at")
            .execute()
        )

        if not messages_result.data or len(messages_result.data) < 2:
            return  # Not enough messages to grade

        # 3. Get user profiles to identify who is the learner
        user1_profile = (
            supabase.table("profiles")
            .select("*")
            .eq("id", match["user1_id"])
            .execute()
        )
        user2_profile = (
            supabase.table("profiles")
            .select("*")
            .eq("id", match["user2_id"])
            .execute()
        )

        # 4. Build transcript
        transcript_lines = []
        for msg in messages_result.data:
            role = "Learner" if msg["sender_id"] == match["user1_id"] else "Native Speaker"
            transcript_lines.append(f"{role}: {msg['content']}")

        transcript = "\n".join(transcript_lines)

        # 5. Send to Gemini
        prompt = GRADING_PROMPT + transcript
        response = gemini_model.generate_content(prompt)

        # 6. Parse response
        response_text = response.text.strip()
        # Remove markdown code block markers if present
        if response_text.startswith("```"):
            response_text = response_text.split("\n", 1)[1]
            response_text = response_text.rsplit("```", 1)[0]
            response_text = response_text.strip()

        grade = json.loads(response_text)

        # 7. Update both users' points
        for user_id in [match["user1_id"], match["user2_id"]]:
            profile = (
                supabase.table("profiles")
                .select("points")
                .eq("id", user_id)
                .execute()
            )

            if profile.data:
                current_points = profile.data[0].get("points", 0)
                new_points = current_points + grade.get("xp_earned", 0)

                supabase.table("profiles").update({
                    "points": new_points,
                }).eq("id", user_id).execute()

        # 8. Update match status
        supabase.table("matches").update({
            "status": "graded",
        }).eq("id", match_id).execute()

    except json.JSONDecodeError:
        # Gemini returned invalid JSON — mark as completed without grading
        supabase.table("matches").update({
            "status": "completed",
        }).eq("id", match_id).execute()

    except Exception as e:
        # Log error but don't crash the server
        print(f"Grading error for match {match_id}: {e}")
