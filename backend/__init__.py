import os

# Enable fast rust-based downloads for HuggingFace by default
os.environ.setdefault("HF_HUB_ENABLE_HF_TRANSFER", "1")
