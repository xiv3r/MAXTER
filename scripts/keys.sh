#!/bin/bash
# ==========================================
# MAXTER // Version 27.3.B10
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
ARROW="󰁔"
DIV="────────────────────────────────────────"

# Helper: Detect Termux
is_termux() { [ -d "/data/data/com.termux/files/usr" ]; }

if ! is_termux; then
    echo -e " ${GRAY}[i] Extra-keys is a Termux-only feature.${NC}"
    exit 0
fi

PROP_FILE="$HOME/.termux/termux.properties"

show_current() {
    echo -e " ${WHITE}Current Layout:${NC}"
    local keys_line=$(grep "^extra-keys =" "$PROP_FILE")
    if [ -z "$keys_line" ]; then
        echo -e "  ${GRAY}No custom keys found (Default).${NC}"
    else
        # Very simple extraction for display
        local r1=$(echo "$keys_line" | sed -E "s/.*\[\s*\[(.*)\],\s*\[(.*)\].*/\1/")
        local r2=$(echo "$keys_line" | sed -E "s/.*\[\s*\[(.*)\],\s*\[(.*)\].*/\2/")
        echo -e "  Row 1: ${CYAN}${r1//\'/}${NC}"
        echo -e "  Row 2: ${CYAN}${r2//\'/}${NC}"
    fi
    echo ""
}

OPTIONS=("View Raw Config" "Edit Layout" "Reset to MAXTER" "Apply & Reload" "Back")
ACTIONS=("view" "edit" "reset" "reload" "back")
current_pos=0
total_options=${#OPTIONS[@]}

draw_menu() {
    clear
    echo -e " ${CYAN}⌨ Termux Extra-Keys${NC}"
    echo -e " ${GRAY}${DIV}${NC}"
    
    show_current

    echo -e " ${WHITE}Options:${NC}"
    for i in "${!OPTIONS[@]}"; do
        if [ "$current_pos" -eq "$i" ]; then
            echo -e "  ${GREEN}${ARROW}${NC} ${BOLD}${WHITE}${OPTIONS[$i]}${NC}"
        else
            echo -e "     ${GRAY}${OPTIONS[$i]}${NC}"
        fi
    done

    echo -e "${GRAY}${DIV}${NC}"
    echo -e " ${GRAY}↑↓ Navigate   ${WHITE}Enter${GRAY} Select   ${RED}q${GRAY} Back${NC}"
}

run_action() {
    case "$1" in
        view)
            echo -e "\n${WHITE}Raw configuration:${NC}"
            grep "^extra-keys" "$PROP_FILE" || echo "Default"
            echo -e "\n${GRAY}Press any key...${NC}"
            read -n 1
            ;;
        edit)
            ${EDITOR:-nano} "$PROP_FILE"
            ;;
        reset)
            sed -i "/^extra-keys =/d" "$PROP_FILE"
            echo "extra-keys = [['ESC','DRAWER','SHIFT','HOME','UP','END','PGUP'], ['TAB','CTRL','ALT','LEFT','DOWN','RIGHT','PGDN']]" >> "$PROP_FILE"
            echo -e "\n ${GREEN}[✓] Reset to MAXTER layout.${NC}"
            sleep 1
            ;;
        reload)
            termux-reload-settings
            echo -e "\n ${GREEN}[✓] Settings reloaded.${NC}"
            sleep 1
            ;;
        back)
            exit 0
            ;;
    esac
}

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
            [ "${ACTIONS[$current_pos]}" == "back" ] && break
            ;;
        "q")
            break
            ;;
    esac
done
