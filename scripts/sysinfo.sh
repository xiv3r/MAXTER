#!/bin/bash
# MAXTER // Version 27.4.B5
# System Diagnostics with Centered TUI

# ── Colors ──────────────────────────────────────────
CYAN='\033[1;36m'
GREEN='\033[1;32m'
WHITE='\033[1;37m'
GRAY='\033[0;90m'
NC='\033[0m'
DIM='\033[2m'
DIV="────────────────────────────────────────"

# ── Logic ──────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/utils.sh"
VERSION=$(get_version)

clear
term_width=$(tput cols 2>/dev/null || echo 40)
padding=$(( (term_width - 40) / 2 ))
[ $padding -lt 0 ] && padding=0
pad_str=$(printf '%*s' "$padding" "")

echo -e "${pad_str}${CYAN}󱚥  System Diagnostics${NC} ${DIM}v$VERSION${NC}"
echo -e "${pad_str}${GRAY}${DIV}${NC}"

printf "${pad_str}  %-15s : %s\n" "󰟀  OS" "$(uname -s)"
printf "${pad_str}  %-15s : %s\n" "󰒋  Kernel" "$(uname -r)"
printf "${pad_str}  %-15s : %s\n" "󰘚  Arch" "$(uname -m)"

# Hardware Info
printf "${pad_str}  %-15s : %s\n" "󰍛  RAM" "$(free -h 2>/dev/null | awk '/Mem:/ {print $3 "/" $2}' || echo "N/A")"
printf "${pad_str}  %-15s : %s\n" "󰋊  Disk" "$(df -h $HOME | tail -1 | awk '{print $3 "/" $2 " (" $5 ")"}' || echo "N/A")"
printf "${pad_str}  %-15s : %s\n" "󰻠  CPU Cores" "$(nproc 2>/dev/null || echo "N/A")"

if [ -d "/data/data/com.termux" ]; then
    printf "${pad_str}  %-15s : %s\n" "󰄖  Platform" "Termux (Android)"
fi

printf "${pad_str}  %-15s : %s\n" "󱆃  Shell" "$SHELL"
printf "${pad_str}  %-15s : %s\n" "󰅩  Zsh Version" "$(zsh --version | awk '{print $2}')"

# Check MAXTER
if [ -d "$HOME/MAXTER" ]; then
    printf "${pad_str}  %-15s : %s\n" "󰀼  MAXTER Dir" "Verified"
fi

echo -e "${pad_str}${GRAY}${DIV}${NC}"
echo -e "${pad_str} ${WHITE}󰖟  mahendraplus.github.io${NC}"
echo -e "${pad_str} ${GRAY}󰮔  Support: ${WHITE}https://mahendraplus.github.io/maxlab/support/${NC}"
echo -e "${pad_str}${GRAY}${DIV}${NC}"
read -p " Press Enter to return..."
