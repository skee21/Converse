from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from config import FRONTEND_URL
from routers import auth, matchmaking, chat

app = FastAPI(
    title="Converse API",
    description="Backend for the Converse language learning platform",
    version="1.0.0",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[FRONTEND_URL, "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(matchmaking.router, prefix="/match", tags=["Matchmaking"])
app.include_router(chat.router, tags=["Chat"])


@app.get("/")
async def health_check():
    return {"status": "ok", "service": "Converse API"}
