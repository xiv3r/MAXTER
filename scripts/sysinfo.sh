#!/bin/bash
# MAXTER // Version 27.2.B3
# System Diagnostics with Nerd Icons

# ── Colors ──────────────────────────────────────────
CYAN='\033[1;36m'
GREEN='\033[1;32m'
WHITE='\033[1;37m'
GRAY='\033[0;90m'
NC='\033[0m'
DIV="────────────────────────────────────────"

echo -e " ${CYAN}󱚥  System Diagnostics${NC}"
echo -e " ${GRAY}${DIV}${NC}"

printf "  %-15s : %s\n" "󰟀  OS" "$(uname -s)"
printf "  %-15s : %s\n" "󰒋  Kernel" "$(uname -r)"
printf "  %-15s : %s\n" "󰘚  Arch" "$(uname -m)"

# Hardware Info
printf "  %-15s : %s\n" "󰍛  RAM" "$(free -h 2>/dev/null | awk '/Mem:/ {print $3 "/" $2}' || echo "N/A")"
printf "  %-15s : %s\n" "󰋊  Disk" "$(df -h $HOME | tail -1 | awk '{print $3 "/" $2 " (" $5 ")"}' || echo "N/A")"
printf "  %-15s : %s\n" "󰻠  CPU Cores" "$(nproc 2>/dev/null || echo "N/A")"

if [ -d "/data/data/com.termux" ]; then
    printf "  %-15s : %s\n" "󰄖  Platform" "Termux (Android)"
fi

printf "  %-15s : %s\n" "󱆃  Shell" "$SHELL"
printf "  %-15s : %s\n" "󰅩  Zsh Version" "$(zsh --version | awk '{print $2}')"

# Check MAXTER
if [ -d "$HOME/MAXTER" ]; then
    printf "  %-15s : %s\n" "󰀼  MAXTER Dir" "Verified"
fi

echo -e " ${GRAY}${DIV}${NC}"
echo -e " ${WHITE}󰖟  mahendraplus.github.io${NC}"
echo -e " ${GRAY}󰮔  Support: ${WHITE}https://mahendraplus.github.io/maxlab/support/${NC}"
echo -e " ${GRAY}${DIV}${NC}"
read -p " Press Enter to return..."
