#!/bin/bash
# ==========================================
# MAXTER - Fast Installer Entry Point
# ==========================================
# Version 27.2.B7
# Author: Mahendra Mali (Max)
# Branch: Max

set -euo pipefail

# --- 1. Variables ---
REPO_URL="https://raw.githubusercontent.com/mahendraplus/MAXTER/Max"
LOG_FILE="$HOME/.maxter_install.log"

# --- 2. Clean Start ---
clear
echo "--- MAXTER Installer ---"
echo "Initializing setup..."

# --- 3. Remote execution logic ---
# This ensures that when someone curls this file, it grabs the actual setup logic.
# If running locally, it prioritizes the local setup.sh.
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
if [ -f "$SCRIPT_DIR/setup.sh" ]; then
    bash "$SCRIPT_DIR/setup.sh"
else
    bash <(curl -fsSL "$REPO_URL/setup.sh")
fi
