#!/bin/bash
# ==========================================
# MAXTER // Version 27.4.B3
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
ICON_RESET="󰦛"
ICON_EXIT="󰀚"
ARROW="󰁔"
DIV="────────────────────────────────────────"

# --- Logic ---
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/utils.sh"
VERSION=$(get_version)

check_for_updates() {
    # Only check if in an interactive TTY
    [[ -t 1 ]] || return
    
    local remote_version_file="https://raw.githubusercontent.com/mahendraplus/MAXTER/Max/version.properties"
    local local_version_file="$REPO_DIR/version.properties"
    
    if [ ! -f "$local_version_file" ]; then return; fi
    
    # Fetch remote version (silently, 2s timeout)
    local remote_props=$(curl -s --connect-timeout 2 "$remote_version_file")
    if [ -z "$remote_props" ]; then return; fi
    
    local r_main=$(echo "$remote_props" | grep "MAIN=" | cut -d'=' -f2)
    local r_minor=$(echo "$remote_props" | grep "MINOR=" | cut -d'=' -f2)
    local r_build=$(echo "$remote_props" | grep "BUILD=" | cut -d'=' -f2)
    
    local l_main=$(grep "MAIN=" "$local_version_file" | cut -d'=' -f2)
    local l_minor=$(grep "MINOR=" "$local_version_file" | cut -d'=' -f2)
    local l_build=$(grep "BUILD=" "$local_version_file" | cut -d'=' -f2)
    
    local update_available=false
    if [ "$r_main" -gt "$l_main" ]; then update_available=true;
    elif [ "$r_main" -eq "$l_main" ] && [ "$r_minor" -gt "$l_minor" ]; then update_available=true;
    elif [ "$r_main" -eq "$l_main" ] && [ "$r_minor" -eq "$l_minor" ] && [ "$r_build" -gt "$l_build" ]; then update_available=true;
    fi
    
    if [ "$update_available" = true ]; then
        local r_ver="$r_main.$r_minor.B$r_build"
        echo -e "\n ${YELLOW}󰚰  Update Available: ${BOLD}${r_ver}${NC}"
        echo -ne " ${GRAY}Do you want to update now? (y/n): ${NC}"
        read -n 1 update_choice
        echo ""
        if [[ "$update_choice" =~ ^[Yy]$ ]]; then
            run_action "update"
        fi
    fi
}

detect_system() {
    if [ -d "/data/data/com.termux" ] && ! [ -f /etc/os-release ]; then
        SYSTEM="termux"
    elif [ "$(uname)" = "Darwin" ]; then
        SYSTEM="macos"
    elif [ -f "/etc/os-release" ]; then
        . /etc/os-release
        case "$ID" in
            debian|ubuntu|kali|pop|mint|linuxmint|alpine) SYSTEM="$ID" ;;
            *) SYSTEM="linux" ;;
        esac
    else
        SYSTEM="linux"
    fi
}

detect_system

if [ "$SYSTEM" == "termux" ]; then
    OPTIONS=("Update" "Color Selector" "P10k Themes" "Extra Keys" "System Info" "Reset to Default" "Support" "Help" "Uninstall" "Exit")
    ICONS=("$ICON_UP" "$ICON_COLOR" "" "$ICON_KEYS" "$ICON_INFO" "$ICON_RESET" "$ICON_SUPPORT" "$ICON_HELP" "$ICON_DEL" "$ICON_EXIT")
    ACTIONS=("update" "color" "p10k_theme" "keys" "info" "reset" "support" "help" "uninstall" "exit")
else
    OPTIONS=("Update" "P10k Themes" "System Info" "Reset to Default" "Support" "Help" "Uninstall" "Exit")
    ICONS=("$ICON_UP" "" "$ICON_INFO" "$ICON_RESET" "$ICON_SUPPORT" "$ICON_HELP" "$ICON_DEL" "$ICON_EXIT")
    ACTIONS=("update" "p10k_theme" "info" "reset" "support" "help" "uninstall" "exit")
fi

current_pos=0
total_options=${#OPTIONS[@]}

draw_menu() {
    clear
    local system_display=$(echo "$SYSTEM" | awk '{print toupper(substr($0,1,1))tolower(substr($0,2))}')
    echo -e "${BOLD}${CYAN}󰀼  MAXTER${NC} ${DIM}Version $VERSION${NC}"
    echo -e "${GRAY}System: ${BOLD}${system_display} $(uname -m)${NC}"
    echo -e "${GRAY}${DIV}${NC}"
    
    for i in "${!OPTIONS[@]}"; do
        if [ "$current_pos" -eq "$i" ]; then
            printf " ${GREEN}${ARROW}${NC} ${BOLD}${WHITE}%-2s %-25s${NC} ${GREEN}󰄬${NC}\n" "${ICONS[$i]}" "${OPTIONS[$i]}"
        else
            printf "    ${GRAY}%-2s %-25s${NC}\n" "${ICONS[$i]}" "${OPTIONS[$i]}"
        fi
    done

    echo -e "${GRAY}${DIV}${NC}"
    echo -e " ${GRAY}↑↓ Navigate   ${WHITE}Enter${GRAY} Select   ${RED}q${GRAY} Exit${NC}"
    echo -e " ${ICON_GLOBE} ${DIM}mahendraplus.github.io${NC}"
    echo -e "${GRAY}${DIV}${NC}"
}

run_action() {
    local action=$1
    case "$action" in
        update)
            echo -e "\n ${BLUE}${ICON_UP}${NC} Syncing configurations..."
            cd "$REPO_DIR" && git pull origin Max && bash "$REPO_DIR/setup.sh"
            echo -e "\n ${GRAY}Press any key to return...${NC}"
            read -n 1
            ;;
        color)
            bash "$SCRIPT_DIR/color_selector.sh"
            ;;
        p10k_theme)
            bash "$SCRIPT_DIR/p10k_theme_selector.sh"
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
        reset)
            echo -e "\n ${YELLOW}${ICON_RESET}${NC} Resetting configurations to default..."
            echo -ne " ${GRAY}All custom themes and settings will be replaced. Continue? (y/n): ${NC}"
            read -n 1 confirm_reset
            echo ""
            if [[ "$confirm_reset" =~ ^[Yy]$ ]]; then
                bash "$REPO_DIR/setup.sh" --reset
            else
                echo -e " ${GRAY}Reset cancelled.${NC}"
                sleep 1
            fi
            ;;
        support)
            clear
            echo -e " ${BOLD}${CYAN}${ICON_SUPPORT} MAXTER Support${NC}"
            echo -e " ${GRAY}${DIV}${NC}"
            echo -e " ${WHITE}Need help or want to report a bug?${NC}"
            echo -e " Visit our support portal:"
            echo -e " ${CYAN}https://mahendraplus.github.io/maxlab/support/${NC}"
            echo -e "\n ${WHITE}Other ways to get help:${NC}"
            echo -e "   - GitHub Issues: ${GRAY}github.com/mahendraplus/MAXTER/issues${NC}"
            echo -e "   - Portfolio: ${GRAY}mahendraplus.github.io${NC}"
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
check_for_updates
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
