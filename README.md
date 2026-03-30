# Converse

Converse is a real-time language learning platform that connects users looking to practice languages together. It pairs learners who speak complementary languages and evaluates their live conversations to provide actionable feedback and track progress over time.

## Architecture & Technology Stack

- **Frontend:** Next.js (App Router), React, standard CSS
- **Backend:** Python, FastAPI, WebSockets
- **Database & Authentication:** Supabase (PostgreSQL, Client/Admin Auth)
- **AI Engine:** Google Gemini API for post-match conversational grading

## Features

- **User Accounts and Onboarding:** Secure sign up via Supabase Auth. Users can specify their native language, select a language to learn, and optionally sign up as contributors to earn Contribution Points (CP).
- **Profile and Statistics Dashboard:** A comprehensive view tracking a user's total XP, daily streaks, global leaderboard rank, and current language proficiencies.
- **Live Matchmaking:** A queue system that pairs users into real-time conversation rooms based on their selected languages and desired practice mode.
- **WebSocket Chat System:** Peer-to-peer messaging between matched users ensuring minimal latency during language practice sessions.
- **AI Conversation Grading:** At the conclusion of a match, an automated background task passes the chat history to the Gemini API, returning structural feedback (Grammar, Vocabulary, Fluency) and adjusting the users' XP accordingly.

## Prerequisites

To run this application locally, you will need:
- Node.js (v18 or higher) and npm
- Python 3.10+
- A Supabase Project (Database URL, Anon Key, and SQL Service Role configured)
- Google Gemini API Key

## Setup and Installation

### 1. Database Configuration
You must configure your Supabase instance to hold the correct schema.
Run the necessary migrations or execute the SQL queries in your Supabase SQL editor to create the `profiles`, `matches`, and `messages` tables. Ensure that `profiles` includes the `is_contributor` and `learning_language` columns. 

### 2. Backend Setup
Navigate into the backend directory and set up the Python environment.

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Backend ENV
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_gemini_api_key
```

Start the FastAPI development server:
```bash
uvicorn main:app --reload --port 8000
```
The backend API will run on http://localhost:8000.

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies.

```bash
cd frontend
npm install
```

Start the Next.js development server:
```bash
npm run dev
```
The frontend application will be available at http://localhost:3000.

## Project Structure
- **/frontend:** Contains the Next.js web application, CSS styles, static assets, and client-side components.
- **/backend:** Contains the FastAPI implementation, WebSockets controllers, background tasks for Gemini, Supabase clients, Pydantic models, and API routers.
