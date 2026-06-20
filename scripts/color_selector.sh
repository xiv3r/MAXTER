#!/bin/bash
# MAXTER // Version 27.4.B8
# Interactive Color Selector with Modular Themes

# ── Colors & Nerd Icons ─────────────────────────────
CYAN='\033[1;36m'
GREEN='\033[1;32m'
RED='\033[1;31m'
WHITE='\033[1;37m'
GRAY='\033[0;90m'
NC='\033[0m'
BOLD='\033[1m'
DIM='\033[2m'

# Nerd Icons
ICON_PALETTE="󰏘"
ARROW="󰁔" 
ICON_SAVE="󰆓"
ICON_BACK="󰌌"
DIV="────────────────────────────────────────"

# Load Utilities
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
THEME_DIR="$SCRIPT_DIR/themes"
source "$SCRIPT_DIR/utils.sh"
VERSION=$(get_version)

# Helper: Detect Termux
is_termux() { [ -d "/data/data/com.termux/files/usr" ] && ! [ -f /etc/os-release ]; }

# Load all themes from directory
load_themes() {
    ALL_THEMES=()
    THEME_FILES=()
    for f in "$THEME_DIR"/*.properties; do
        [ -f "$f" ] || continue
        # Extract display name from comment or filename
        local name=$(grep "# Theme:" "$f" | cut -d: -f2 | xargs)
        if [ -z "$name" ]; then
            name=$(basename "$f" .properties | tr '_' ' ' | sed 's/\b\(.\)/\u\1/g')
        fi
        ALL_THEMES+=("$name")
        THEME_FILES+=("$f")
    done
    total_themes=${#ALL_THEMES[@]}
}

load_themes
current_pos=0

# Backup original theme
ORIGINAL_THEME=""
if is_termux && [ -f ~/.termux/colors.properties ]; then
    ORIGINAL_THEME=$(cat ~/.termux/colors.properties)
fi

apply_preview() {
    local theme_file="${THEME_FILES[$current_pos]}"
    if is_termux; then
        cp -f "$theme_file" ~/.termux/colors.properties
        termux-reload-settings 2>/dev/null || true
    fi
}

save_theme() {
    echo -e "\n ${GREEN}󰄬${NC} ${BOLD}Theme Saved!${NC}"
    sleep 1
}

discard_changes() {
    if is_termux; then
        if [ -n "$ORIGINAL_THEME" ]; then
            echo "$ORIGINAL_THEME" > ~/.termux/colors.properties
        else
            rm -f ~/.termux/colors.properties
        fi
        termux-reload-settings 2>/dev/null || true
    fi
    echo -e "\n ${RED}󰆴${NC} ${GRAY}Changes Discarded${NC}"
    sleep 1
}

draw_menu() {
    clear

    echo -e "${CYAN}${ICON_PALETTE}  Live Theme Preview (${current_pos}/${total_themes})${NC}"
    echo -e "${GRAY}${DIV}${NC}"
    
    # Preview Block for non-Termux
    if ! is_termux; then
        local theme_file="${THEME_FILES[$current_pos]}"
        local bg=$(grep "background=" "$theme_file" | cut -d= -f2)
        local fg=$(grep "foreground=" "$theme_file" | cut -d= -f2)
        echo -e "  Preview: [ BG:${bg} FG:${fg} ]"
        echo -e "  ${WHITE}Note: Live preview only active on Termux.${NC}"
        echo -e "${GRAY}${DIV}${NC}"
    fi

    # Sliding Window Logic
    local max_visible=12
    local half_window=$((max_visible / 2))
    local start_idx=$((current_pos - half_window))
    
    if [ "$start_idx" -lt 0 ]; then
        start_idx=0
    elif [ "$((start_idx + max_visible))" -gt "$total_themes" ]; then
        start_idx=$((total_themes - max_visible))
    fi
    
    [ "$start_idx" -lt 0 ] && start_idx=0

    for (( i=0; i<max_visible; i++ )); do
        local idx=$((start_idx + i))
        if [ "$idx" -ge "$total_themes" ]; then break; fi
        
        local theme_name="${ALL_THEMES[$idx]}"
        
        if [ "$current_pos" -eq "$idx" ]; then
            printf " ${GREEN}${ARROW} ${BOLD}${WHITE}%-30s${NC} ${GREEN}󰄬${NC}\n" "$theme_name"
        else
            printf "    %-30s\n" "$theme_name"
        fi
    done

    echo -e "${GRAY}${DIV}${NC}"
    echo -e " ${GRAY}↑↓ Navigate   ${WHITE}Enter${GRAY} Select   ${RED}q${GRAY} Exit${NC}"
    echo -e " ${CYAN}󰖟  mahendraplus.github.io${NC}"
    echo -e " ${GRAY}󰮔  Support: ${WHITE}https://mahendraplus.github.io/maxlab/support/${NC}"
    echo -e "${GRAY}${DIV}${NC}"
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
                "[A"|"[D") # Up or Left
                    current_pos=$(( (current_pos - 1 + total_themes) % total_themes ))
                    ;;
                "[B"|"[C") # Down or Right
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
