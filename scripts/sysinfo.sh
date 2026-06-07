#!/bin/bash
# MAXTER v27.0 System Diagnostics

# ── Colors ──────────────────────────────────────────
CYAN='\033[1;36m'
GREEN='\033[1;32m'
WHITE='\033[1;37m'
GRAY='\033[0;90m'
NC='\033[0m'
DIV="────────────────────────────────────────"

echo -e " ${CYAN}📊 System Diagnostics${NC}"
echo -e " ${GRAY}${DIV}${NC}"

printf "  %-15s : %s\n" "OS" "$(uname -s)"
printf "  %-15s : %s\n" "Kernel" "$(uname -r)"
printf "  %-15s : %s\n" "Arch" "$(uname -m)"

if [ -d "/data/data/com.termux" ]; then
    printf "  %-15s : %s\n" "Platform" "Termux (Android)"
fi

printf "  %-15s : %s\n" "Shell" "$SHELL"
printf "  %-15s : %s\n" "Zsh Version" "$(zsh --version | awk '{print $2}')"

# Check MAXTER
if [ -d "$HOME/MAXTER" ]; then
    printf "  %-15s : %s\n" "MAXTER Dir" "Verified"
fi

echo -e " ${GRAY}${DIV}${NC}"
read -p " Press Enter to return..."
