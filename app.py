import streamlit as st
from supabase import create_client, Client
import os

# --- Page Config ---
st.set_page_config(
    page_title="Cyber Guardian Arena",
    page_icon="🛡️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# --- Global Styles (Background + Glow) ---
st.markdown(
    """
    <style>
    body {
        background-image: url("https://copilot.microsoft.com/th/id/BCO.b42da7ce-80db-4657-bcb4-3909c1f792f4.png");
        background-size: cover;
        background-attachment: fixed;
        background-position: center;
        color: white;
    }
    .hero h1 {
        font-size: 3em;
        text-shadow: 0 0 10px #00f, 0 0 20px #0ff;
    }
    </style>
    """,
    unsafe_allow_html=True
)

# --- Hero Section ---
st.markdown(
    """
    <div class="hero" style="text-align:center; padding:40px; background:rgba(15,32,39,0.8); border-radius:10px;">
        <h1>🛡️ Cyber Guardian Arena</h1>
        <p style="font-size:1.2em;">Gamify your cybersecurity learning — play, compete, and protect!</p>
    </div>
    """,
    unsafe_allow_html=True
)

# --- Supabase Setup ---
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://nssdnrsscffhochlqhwd.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "sb_publishable_AvmyuXV-_NUugAKs3Ok4EQ_2w_66F-U")
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- Session State ---
if "user" not in st.session_state:
    st.session_state.user = None
if "score" not in st.session_state:
    st.session_state.score = 0
if "page" not in st.session_state:
    st.session_state.page = None

# --- Authentication ---
def login(email, password):
    try:
        user = supabase.auth.sign_in_with_password({"email": email, "password": password})
        st.session_state.user = user
        return True
    except Exception as e:
        st.error(f"Login failed: {e}")
        return False

def signup(email, password):
    try:
        user = supabase.auth.sign_up({"email": email, "password": password})
        st.success("Signup successful! Please log in.")
    except Exception as e:
        st.error(f"Signup failed: {e}")

# --- Game Logic ---
questions = [
    {"q": "What is phishing?", "options": ["A cyber attack", "A sport", "A cooking style"], "answer": "A cyber attack"},
    {"q": "Strong passwords should include?", "options": ["Only letters", "Letters, numbers & symbols", "Your name"], "answer": "Letters, numbers & symbols"},
    {"q": "What does HTTPS mean?", "options": ["Secure website", "Unsecure website", "Gaming site"], "answer": "Secure website"},
]

def play_game():
    st.header("🎮 Cyber Guardian Arena Quiz")
    st.session_state.score = 0

    # Loop through all questions
    for i, q in enumerate(questions):
        st.write(f"Q{i+1}: {q['q']}")
        choice = st.radio(
            "Choose:",
            q["options"],
            index=None,   # <-- prevents auto-selection
            key=f"q{i}"
        )
        if choice == q["answer"]:
            st.session_state.score += 1

    # Show final score
    st.success(f"Your score: {st.session_state.score}")

    # Save score to Supabase if user is logged in
    if st.session_state.user:
        try:
            supabase.table("scores").insert({
                "email": st.session_state.user.user.email,
                "score": st.session_state.score
            }).execute()
        except Exception as e:
            st.error("⚠️ Could not save score to Supabase.")
            st.caption(f"Debug info: {e}")

# --- Leaderboard ---
def show_leaderboard():
    st.header("🏆 Leaderboard")
    try:
        # Try to fetch scores from Supabase
        data = supabase.table("scores").select("*").order("score", desc=True).limit(10).execute()

        # If data exists, display it
        if data and hasattr(data, "data") and data.data:
            for row in data.data:
                email = row.get("email", "Unknown")
                score = row.get("score", "N/A")
                st.write(f"{email} → {score} points")
        else:
            st.info("No scores yet. Play the game to appear on the leaderboard!")

    except Exception as e:
        # Graceful error handling
        st.error("⚠️ Unable to load leaderboard. Please check if the 'scores' table exists in Supabase.")
        st.caption(f"Debug info: {e}")


# --- Homepage Features with Buttons ---
col1, col2, col3 = st.columns(3)
with col1:
    if st.button("🎮 Play"):
        st.session_state.page = "Play"
with col2:
    if st.button("🏆 Complete"):
        st.session_state.page = "Leaderboard"
with col3:
    if st.button("👤 Profile"):
        st.session_state.page = "Profile"

st.markdown("---")
st.success("👉 Use the sidebar to Login/Signup and start playing!")

# --- Sidebar UI ---
if st.session_state.user:
    st.sidebar.success(f"Logged in as {st.session_state.user.user.email}")
    choice = st.sidebar.radio("Menu", ["Play Game", "Leaderboard", "Logout"])
    if choice == "Play Game":
        st.session_state.page = "Play"
    elif choice == "Leaderboard":
        st.session_state.page = "Leaderboard"
    elif choice == "Logout":
        st.session_state.user = None
        st.session_state.score = 0
        st.session_state.page = None
        st.sidebar.info("Logged out.")
else:
    st.sidebar.header("Login / Signup")
    email = st.sidebar.text_input("Email")
    password = st.sidebar.text_input("Password", type="password")
    if st.sidebar.button("Login"):
        login(email, password)
    if st.sidebar.button("Signup"):
        signup(email, password)

# --- Page Routing ---
if st.session_state.page == "Play":
    play_game()
elif st.session_state.page == "Leaderboard":
    show_leaderboard()
elif st.session_state.page == "Profile":
    st.info("Profile page coming soon!")

def show_profile():
    st.header("👤 My Profile")

    if st.session_state.user:
        user_email = st.session_state.user.user.email

        # Layout: avatar + email side by side
        col1, col2 = st.columns([1, 3])
        with col1:
            st.image(
                "https://img.icons8.com/fluency/96/user-shield.png",  # cyber‑themed avatar
                width=80
            )
        with col2:
            st.write(f"**Email:** {user_email}")

        # Fetch scores from Supabase
        try:
            data = supabase.table("scores").select("*").eq("email", user_email).order("created_at", desc=True).execute()

            if data and hasattr(data, "data") and data.data:
                st.subheader("📊 My Scores")
                st.table(data.data)  # shows all past scores in a table

                # Extra: show total games played
                st.write(f"**Total Games Played:** {len(data.data)}")

            else:
                st.info("No scores recorded yet. Play the quiz to add your first score!")

        except Exception as e:
            st.error("⚠️ Unable to load profile details.")
            st.caption(f"Debug info: {e}")

    else:
        st.warning("You need to log in to view your profile.")
def show_compete():
    st.header("⚔️ Compete")

    if st.session_state.user:
        user_email = st.session_state.user.user.email

        # Fetch all scores from Supabase
        try:
            data = supabase.table("scores").select("*").order("score", desc=True).execute()

            if data and hasattr(data, "data") and data.data:
                st.subheader("🏆 Global Leaderboard")
                st.table(data.data)  # shows all players' scores

                # Highlight current user's rank
                user_scores = [row for row in data.data if row.get("email") == user_email]
                if user_scores:
                    best_score = max(row.get("score", 0) for row in user_scores)
                    rank = next((i+1 for i, row in enumerate(data.data) if row.get("email") == user_email), None)

                    st.markdown(f"🎯 **Your Best Score:** {best_score}")
                    if rank:
                        st.markdown(f"🥇 **Your Current Rank:** #{rank}")
                else:
                    st.info("You haven’t played yet. Play the quiz to join the competition!")

            else:
                st.info("No competition data yet. Be the first to play!")

        except Exception as e:
            st.error("⚠️ Unable to load competition details.")
            st.caption(f"Debug info: {e}")

    else:
        st.warning("You need to log in to view competition results.")
