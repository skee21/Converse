import os
from dotenv import load_dotenv
from supabase import create_client, Client
import google.generativeai as genai

load_dotenv()

# Supabase
SUPABASE_URL: str = os.getenv("supabase_id", "")
SUPABASE_KEY: str = os.getenv("supabase_api", "")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# Gemini
GEMINI_API_KEY: str = os.getenv("gemini_api", "")
genai.configure(api_key=GEMINI_API_KEY)
gemini_model = genai.GenerativeModel("gemini-2.0-flash")

# CORS
FRONTEND_URL = os.getenv("frontend_url", "http://localhost:3000")
