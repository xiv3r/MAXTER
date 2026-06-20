#!/bin/bash
# ==========================================
# MAXTER // Version 27.4.B8
# ==========================================
# Termux Extra-Keys Manager (Interactive)

# ── Colors & Icons ──────────────────────────────────
CYAN='\033[1;36m'
GREEN='\033[1;32m'
BLUE='\033[1;34m'
RED='\033[1;31m'
WHITE='\033[1;37m'
GRAY='\033[0;90m'
NC='\033[0m'
BOLD='\033[1m'
DIM='\033[2m'
ARROW="󰁔"
DIV="────────────────────────────────────────"

# ── Logic ──────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/utils.sh"
VERSION=$(get_version)

# Helper: Detect Termux
is_termux() { [ -d "/data/data/com.termux/files/usr" ]; }

if ! is_termux; then
    echo -e " ${GRAY}[i] Extra-keys is a Termux-only feature.${NC}"
    exit 0
fi

PROP_FILE="$HOME/.termux/termux.properties"

show_current() {
    local pad="$1"
    echo -e "${pad}${WHITE}Current Layout:${NC}"
    local keys_line=$(grep "^extra-keys =" "$PROP_FILE")
    if [ -z "$keys_line" ]; then
        echo -e "${pad}  ${GRAY}No custom keys found (Default).${NC}"
    else
        local r1=$(echo "$keys_line" | sed -E "s/.*\[\s*\[(.*)\],\s*\[(.*)\].*/\1/")
        local r2=$(echo "$keys_line" | sed -E "s/.*\[\s*\[(.*)\],\s*\[(.*)\].*/\2/")
        echo -e "${pad}  Row 1: ${CYAN}${r1//\'/}${NC}"
        echo -e "${pad}  Row 2: ${CYAN}${r2//\'/}${NC}"
    fi
    echo ""
}

OPTIONS=("View Raw Config" "Edit Layout" "Reset to MAXTER" "Apply & Reload" "Back")
ACTIONS=("view" "edit" "reset" "reload" "back")
current_pos=0
total_options=${#OPTIONS[@]}

draw_menu() {
    clear
    local term_width=$(tput cols 2>/dev/null || echo 40)
    local padding=$(( (term_width - 40) / 2 ))
    [ $padding -lt 0 ] && padding=0
    local pad_str=$(printf '%*s' "$padding" "")

    echo -e "${pad_str}${BOLD}${CYAN}󰌌  Extra Keys Manager${NC} ${DIM}v$VERSION${NC}"
    echo -e "${pad_str}${GRAY}${DIV}${NC}"
    
    show_current "$pad_str"

    for i in "${!OPTIONS[@]}"; do
        if [ "$current_pos" -eq "$i" ]; then
            printf "${pad_str} ${GREEN}${ARROW}${NC} ${BOLD}${WHITE}%-30s${NC} ${GREEN}󰄬${NC}\n" "${OPTIONS[$i]}"
        else
            printf "${pad_str}    ${GRAY}%-30s${NC}\n" "${OPTIONS[$i]}"
        fi
    done

    echo -e "${pad_str}${GRAY}${DIV}${NC}"
    echo -e "${pad_str} ${GRAY}↑↓ Navigate   ${WHITE}Enter${GRAY} Select   ${RED}q${GRAY} Exit${NC}"
    echo -e "${pad_str} ${CYAN}󰖟  mahendraplus.github.io${NC}"
    echo -e "${pad_str} ${GRAY}󰮔  Support: ${WHITE}https://mahendraplus.github.io/maxlab/support/${NC}"
    echo -e "${pad_str}${GRAY}${DIV}${NC}"
}

run_action() {
    case "$1" in
        view)
            echo -e "\n${WHITE}Raw configuration:${NC}"
            grep "^extra-keys =" "$PROP_FILE" || echo "No config found."
            echo -ne "\nPress any key to return..."
            read -n 1
            ;;
        edit)
            ${EDITOR:-nano} "$PROP_FILE"
            ;;
        reset)
            local default_keys="extra-keys = [['ESC','/','-','HOME','UP','END','PGUP'],['TAB','CTRL','ALT','LEFT','DOWN','RIGHT','PGDN']]"
            sed -i "/^extra-keys =/d" "$PROP_FILE"
            echo "$default_keys" >> "$PROP_FILE"
            echo -e "\n ${GREEN}󰄬${NC} Reset to MAXTER defaults."
            sleep 1
            ;;
        reload)
            termux-reload-settings
            echo -e "\n ${BLUE}󰑐${NC} Settings reloaded."
            sleep 1
            ;;
        back)
            exit 0
            ;;
    esac
}

while true; do
    draw_menu
    read -rsn1 key
    case "$key" in
        $'\x1b')
            read -rsn2 key
            case "$key" in
                "[A") current_pos=$(( (current_pos - 1 + total_options) % total_options )) ;;
                "[B") current_pos=$(( (current_pos + 1) % total_options )) ;;
            esac
            ;;
        "")
            run_action "${ACTIONS[$current_pos]}"
            ;;
        "q")
            exit 0
            ;;
    esac
done
