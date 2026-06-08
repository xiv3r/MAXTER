#!/bin/bash
# ==========================================
# MAXTER PREMIUM DASHBOARD (v27.0)
# ==========================================
# Fully Interactive TUI with Arrow Navigation

# ── Colors & Nerd Icons ─────────────────────────────
CYAN='\033[1;36m'
WHITE='\033[1;37m'
BOLD='\033[1m'
DIM='\033[2m'
GRAY='\033[0;90m'
NC='\033[0m'
GREEN='\033[1;32m'
RED='\033[1;31m'
BLUE='\033[1;34m'
YELLOW='\033[1;33m'

# Icons
ICON_UP="󰚰"
ICON_DEL="󰆴"
ICON_COLOR="󰏘"
ICON_KEYS="󰌌"
ICON_INFO="󰋼"
ICON_HELP="󰘥"
ICON_GLOBE="󰖟"
ICON_SUPPORT="󰮔"
ICON_EXIT="󰈆"
ARROW="󰁔"
DIV="────────────────────────────────────────"

# --- Logic ---
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$HOME/MAXTER"

detect_system() {
    if [ -d "/data/data/com.termux" ]; then
        SYSTEM="termux"
    elif [ "$(uname)" = "Darwin" ]; then
        SYSTEM="macos"
    elif [ -f "/etc/arch-release" ]; then
        SYSTEM="arch"
    elif [ -f "/etc/debian_version" ]; then
        SYSTEM="debian"
    else
        SYSTEM="linux"
    fi
}

detect_system
OPTIONS=("Update" "Color Selector" "System Info" "Help" "Uninstall" "Exit")
ICONS=("$ICON_UP" "$ICON_COLOR" "$ICON_INFO" "$ICON_HELP" "$ICON_DEL" "$ICON_EXIT")
ACTIONS=("update" "color" "info" "help" "uninstall" "exit")

if [ "$SYSTEM" == "termux" ]; then
    # Insert Keys option at index 2
    OPTIONS=("Update" "Color Selector" "Extra Keys" "System Info" "Help" "Uninstall" "Exit")
    ICONS=("$ICON_UP" "$ICON_COLOR" "$ICON_KEYS" "$ICON_INFO" "$ICON_HELP" "$ICON_DEL" "$ICON_EXIT")
    ACTIONS=("update" "color" "keys" "info" "help" "uninstall" "exit")
fi

current_pos=0
total_options=${#OPTIONS[@]}

draw_menu() {
    clear
    echo -e "${BOLD}${CYAN}󰀼  MAXTER${NC} ${DIM}v27.0${NC}             ${GRAY}System: ${BOLD}${SYSTEM} $(uname -m)${NC}"
    echo -e "${GRAY}${DIV}${NC}"
    
    for i in "${!OPTIONS[@]}"; do
        if [ "$current_pos" -eq "$i" ]; then
            printf " ${GREEN}${ARROW}${NC} ${BOLD}${WHITE}%-2s %-20s${NC} ${GREEN}󰄬${NC}\n" "${ICONS[$i]}" "${OPTIONS[$i]}"
        else
            printf "    ${GRAY}%-2s %-20s${NC}\n" "${ICONS[$i]}" "${OPTIONS[$i]}"
        fi
    done

    echo -e "${GRAY}${DIV}${NC}"
    echo -e " ${GRAY}↑↓ Navigate   ${WHITE}Enter${GRAY} Select   ${RED}q${GRAY} Exit${NC}"
    echo -e " ${ICON_GLOBE} ${DIM}mahendraplus.github.io${NC}"
}

run_action() {
    local action=$1
    case "$action" in
        update)
            echo -e "\n ${BLUE}${ICON_UP}${NC} Syncing configurations..."
            cd "$REPO_DIR" && git pull origin Max && bash setup.sh
            echo -e "\n ${GRAY}Press any key to return...${NC}"
            read -n 1
            ;;
        color)
            bash "$SCRIPT_DIR/color_selector.sh"
            ;;
        keys)
            bash "$SCRIPT_DIR/keys.sh"
            ;;
        info)
            clear
            bash "$SCRIPT_DIR/sysinfo.sh" 2>/dev/null || uname -a
            echo -e "\n ${GRAY}Press any key to return...${NC}"
            read -n 1
            ;;
        help)
            clear
            echo -e " ${BOLD}${CYAN}${ICON_HELP} MAXTER Usage Guide${NC}"
            echo -e " ${GRAY}${DIV}${NC}"
            echo -e " ${WHITE}Commands:${NC}"
            echo -e "   ${CYAN}maxter${NC}          Open this menu"
            echo -e "   ${CYAN}maxter color${NC}    Directly open color selector"
            echo -e "   ${CYAN}maxter update${NC}   Update without menu"
            echo -e "\n ${WHITE}Shortcuts:${NC}"
            echo -e "   ${GRAY}Arrow Keys${NC}      Navigation"
            echo -e "   ${GRAY}Enter${NC}           Confirm selection"
            echo -e "   ${GRAY}q${NC}               Quick exit"
            echo -e "\n ${GRAY}Press any key to return...${NC}"
            read -n 1
            ;;
        uninstall)
            echo -e "\n ${RED}${ICON_DEL}${NC} Starting uninstallation..."
            bash "$SCRIPT_DIR/uninstall.sh"
            exit 0
            ;;
        exit)
            clear
            exit 0
            ;;
    esac
}

# Check if arguments are passed for non-interactive use
if [ $# -gt 0 ]; then
    case "$1" in
        update|color|keys|info|help|uninstall)
            run_action "$1"
            exit 0
            ;;
        *)
            echo "Unknown command: $1"
            exit 1
            ;;
    esac
fi

# Main Loop
while true; do
    draw_menu
    read -rsn1 key
    case "$key" in
        $'\x1b') # Multi-character escape
            read -rsn2 key
            case "$key" in
                "[A"|"[D") # Up or Left
                    current_pos=$(( (current_pos - 1 + total_options) % total_options ))
                    ;;
                "[B"|"[C") # Down or Right
                    current_pos=$(( (current_pos + 1) % total_options ))
                    ;;
            esac
            ;;
        "") # Enter
            run_action "${ACTIONS[$current_pos]}"
            ;;
        "q")
            clear
            exit 0
            ;;
    esac
done
