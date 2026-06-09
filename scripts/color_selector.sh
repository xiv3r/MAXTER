#!/bin/bash
# MAXTER // Version 27.3.B8
# Interactive Color Selector with Live Preview

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
PREMIUM_THEMES=("Night Owl" "Synthwave 84" "Ayu Dark" "Ayu Mirage" "Ayu Light" "Material Dark" "Material Oceanic" "Material Palenight" "Material Deep Ocean" "Tokyo Night Storm" "Tokyo Night Moon" "Tokyo Night Light" "One Light" "Dracula Pro" "Dracula Pro Alucard" "Horizon" "Andromeda" "Aurora" "Cobalt2" "Darcula" "Deep Space" "Eva Dark" "Eva Light" "Flatland" "Glacier" "Hopscotch" "Iceberg" "Moonlight" "Nova" "Oceanic Next" "Panda" "Radical" "Seti" "Shades of Purple" "Snazzy" "Spacegray" "Tomorrow Night" "Twilight" "Winter is Coming" "Xcode Dark" "Zenburn" "Rosé Pine" "Rosé Pine Moon" "Rosé Pine Dawn" "Kanagawa" "Everforest Dark" "Everforest Light" "Gruvbox Material" "Sonokai" "Onedark Pro" "Vuesion" "Breeze")

ALL_THEMES=("${DARK_THEMES[@]}" "${LIGHT_THEMES[@]}" "${SPECIAL_THEMES[@]}" "${PREMIUM_THEMES[@]}")

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
    echo -e " ${CYAN}󱓞  Live Theme Preview (${current_pos}/${total_themes})${NC}"
    echo -e " ${GRAY}${DIV}${NC}"
    
    # Preview Block for non-Termux
    if ! is_termux; then
        local theme_name="${ALL_THEMES[$current_pos]}"
        local theme_data="${THEMES[$theme_name]}"
        local bg=$(echo "$theme_data" | grep -o "background:#[0-9a-fA-F]*" | cut -d'#' -f2)
        local fg=$(echo "$theme_data" | grep -o "foreground:#[0-9a-fA-F]*" | cut -d'#' -f2)
        echo -e "  Preview: [ BG:#$bg FG:#$fg ]"
        echo -e "  ${WHITE}Note: Live preview only active on Termux.${NC}"
        echo -e " ${GRAY}${DIV}${NC}"
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
            echo -e "  ${GREEN}${ARROW} ${theme_name}${NC}"
        else
            echo -e "    ${theme_name}"
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
