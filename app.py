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

# --- Features Section with Icons ---
col1, col2, col3 = st.columns(3)
with col1:
    st.image("https://img.icons8.com/fluency/96/controller.png", width=60)
    st.subheader("🎮 Play")
    st.write("Interactive cybersecurity quiz challenges.")
with col2:
    st.image("https://img.icons8.com/fluency/96/trophy.png", width=60)
    st.subheader("🏆 Compete")
    st.write("Earn points and climb the leaderboard.")
with col3:
    st.image("https://img.icons8.com/fluency/96/user-shield.png", width=60)
    st.subheader("👤 Profile")
    st.write("Track your progress and achievements.")

st.markdown("---")
st.success("👉 Use the sidebar to Login/Signup and start playing!")

# --- Supabase Setup ---
SUPABASE_URL = os.getenv("SUPABASE_URL", "https://nssdnrsscffhochlqhwd.supabase.co")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "sb_publishable_AvmyuXV-_NUugAKs3Ok4EQ_2w_66F-U")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- Session State ---
if "user" not in st.session_state:
    st.session_state.user = None
if "score" not in st.session_state:
    st.session_state.score = 0

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
    for i, q in enumerate(questions):
        st.write(f"Q{i+1}: {q['q']}")
        choice = st.radio("Choose:", q["options"], key=f"q{i}")
        if choice == q["answer"]:
            st.session_state.score += 1
    st.success(f"Your score: {st.session_state.score}")

    # Save score to Supabase
    if st.session_state.user:
        supabase.table("scores").insert({
            "email": st.session_state.user.user.email,
            "score": st.session_state.score
        }).execute()

# --- Leaderboard ---
def show_leaderboard():
    st.header("🏆 Leaderboard")
    data = supabase.table("scores").select("*").order("score", desc=True).limit(10).execute()
    if data.data:
        for row in data.data:
            st.write(f"{row['email']} → {row['score']} points")
    else:
        st.info("No scores yet.")

# --- Sidebar UI ---
if st.session_state.user:
    st.sidebar.success(f"Logged in as {st.session_state.user.user.email}")
    choice = st.sidebar.radio("Menu", ["Play Game", "Leaderboard", "Logout"])
    if choice == "Play Game":
        play_game()
    elif choice == "Leaderboard":
        show_leaderboard()
    elif choice == "Logout":
        st.session_state.user = None
        st.session_state.score = 0
        st.sidebar.info("Logged out.")
else:
    st.sidebar.header("Login / Signup")
    email = st.sidebar.text_input("Email")
    password = st.sidebar.text_input("Password", type="password")
    if st.sidebar.button("Login"):
        login(email, password)
    if st.sidebar.button("Signup"):
        signup(email, password)
