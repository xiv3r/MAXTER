#!/bin/bash
# MAXTER v27.0 Interactive Color Selector with Live Preview

# ── Colors & Nerd Icons ─────────────────────────────
CYAN='\033[1;36m'
GREEN='\033[1;32m'
RED='\033[1;31m'
WHITE='\033[1;37m'
GRAY='\033[0;90m'
NC='\033[0m'

# Nerd Icons
ICON_PALETTE="🎨" # Using standard for now, but script assumes NF terminal
ARROW="" 
ICON_SAVE=""
ICON_BACK="󰌍"
DIV="────────────────────────────────────────"

# Load Definitions
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/themes/definitions.sh"

# Theme Categories
DARK_THEMES=("Matrix" "Dracula" "Nord" "Monokai" "Gruvbox Dark" "Tokyo Night" "Catppuccin" "One Dark" "Solarized Dark" "Cyberpunk")
LIGHT_THEMES=("Solarized Light" "Catppuccin Latte" "GitHub Light")
SPECIAL_THEMES=("Rose" "Ocean" "Industrial" "Sunset" "Forest" "Candy" "Midnight")

ALL_THEMES=("${DARK_THEMES[@]}" "${LIGHT_THEMES[@]}" "${SPECIAL_THEMES[@]}")

current_pos=0
total_themes=${#ALL_THEMES[@]}

# Backup original theme
ORIGINAL_THEME=""
if [ -f ~/.termux/colors.properties ]; then
    ORIGINAL_THEME=$(cat ~/.termux/colors.properties)
fi

# Helper: Detect Termux
is_termux() { [ -d "/data/data/com.termux/files/usr" ]; }

apply_preview() {
    local theme_name="${ALL_THEMES[$current_pos]}"
    local theme_data="${THEMES[$theme_name]}"
    
    if is_termux; then
        echo -e "${theme_data}" | tr ';' '\n' > ~/.termux/colors.properties
        termux-reload-settings
    fi
}

save_theme() {
    echo -e "\n ${GREEN}check  Theme Saved!${NC}"
    sleep 1
}

discard_changes() {
    if is_termux; then
        if [ -n "$ORIGINAL_THEME" ]; then
            echo "$ORIGINAL_THEME" > ~/.termux/colors.properties
        else
            rm -f ~/.termux/colors.properties
        fi
        termux-reload-settings
    fi
    echo -e "\n ${RED}󰆴  Changes Discarded${NC}"
    sleep 1
}

draw_menu() {
    clear
    echo -e " ${CYAN}󱓞  Live Theme Preview${NC}"
    echo -e " ${GRAY}${DIV}${NC}"
    
    echo -e " ${WHITE}[ Dark ]${GRAY}─────────────────────────────${NC}"
    for i in "${!DARK_THEMES[@]}"; do
        if [ "$current_pos" -eq "$i" ]; then
            echo -e "  ${GREEN}${ARROW} ${DARK_THEMES[$i]}${NC}"
        else
            echo -e "    ${DARK_THEMES[$i]}"
        fi
    done

    echo -e " ${WHITE}[ Light ]${GRAY}────────────────────────────${NC}"
    local offset=${#DARK_THEMES[@]}
    for i in "${!LIGHT_THEMES[@]}"; do
        local idx=$((i + offset))
        if [ "$current_pos" -eq "$idx" ]; then
            echo -e "  ${GREEN}${ARROW} ${LIGHT_THEMES[$i]}${NC}"
        else
            echo -e "    ${LIGHT_THEMES[$i]}"
        fi
    done

    echo -e " ${WHITE}[ Special ]${GRAY}──────────────────────────${NC}"
    offset=$((offset + ${#LIGHT_THEMES[@]}))
    for i in "${!SPECIAL_THEMES[@]}"; do
        local idx=$((i + offset))
        if [ "$current_pos" -eq "$idx" ]; then
            echo -e "  ${GREEN}${ARROW} ${SPECIAL_THEMES[$i]}${NC}"
        else
            echo -e "    ${SPECIAL_THEMES[$i]}"
        fi
    done

    echo -e " ${GRAY}${DIV}${NC}"
    echo -e " ${GRAY}↑↓ Navigate   ${WHITE}Enter${GRAY} Save   ${RED}q${GRAY} Discard${NC}"
}

# Main Loop
while true; do
    draw_menu
    apply_preview
    read -rsn1 key
    case "$key" in
        $'\x1b') # Multi-character escape
            read -rsn2 key
            case "$key" in
                "[A") # Up
                    current_pos=$(( (current_pos - 1 + total_themes) % total_themes ))
                    ;;
                "[B") # Down
                    current_pos=$(( (current_pos + 1) % total_themes ))
                    ;;
            esac
            ;;
        "") # Enter
            save_theme
            break
            ;;
        "q")
            discard_changes
            break
            ;;
    esac
done
