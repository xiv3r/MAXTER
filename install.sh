#!/bin/bash
# ==========================================
# MAXTER - Fast Installer Entry Point
# ==========================================
# This script handles both local execution and remote piping via curl.

# --- 1. Environment Setup ---
DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$HOME/MAXTER"
REPO_URL="https://github.com/mahendraplus/MAXTER"
BRANCH="Max"

# --- 2. Remote execution check ---
# If running via curl, we need to clone the repo first.
if [[ "$DIR" == "/dev/fd"* ]] || [[ "$DIR" == "/tmp"* ]] || [ ! -f "$DIR/setup.sh" ]; then
    echo "--- MAXTER Remote Installer ---"
    
    # Check for git
    if ! command -v git &> /dev/null; then
        echo "Git not found. Installing dependencies..."
        if [ -d "/data/data/com.termux/files/usr" ]; then
            pkg update -y && pkg install -y git
        elif [ -f "/etc/debian_version" ]; then
            sudo apt update && sudo apt install -y git
        elif [ -f "/etc/arch-release" ]; then
            sudo pacman -S --noconfirm git
        elif [ -f "/etc/fedora-release" ]; then
            sudo dnf install -y git
        fi
    fi

    # Clone or update repo
    if [ -d "$REPO_DIR" ]; then
        echo "Updating MAXTER repository..."
        cd "$REPO_DIR" && git pull origin "$BRANCH"
    else
        echo "Cloning MAXTER repository ($BRANCH branch)..."
        git clone -b "$BRANCH" "$REPO_URL" "$REPO_DIR"
    fi
    
    # Run the setup script from the repo
    bash "$REPO_DIR/setup.sh" "$@"
    exit 0
fi

# --- 3. Local execution ---
# If we are already in the repo, just run setup.sh.
if [ -f "$DIR/setup.sh" ]; then
    bash "$DIR/setup.sh" "$@"
else
    echo "Error: setup.sh not found in $DIR"
    exit 1
fi
