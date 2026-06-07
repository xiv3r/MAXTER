#!/bin/bash
# MAXTER v27.0 Interactive Color Selector

# ── Colors & Icons ──────────────────────────────────
CYAN='\033[1;36m'
GREEN='\033[1;32m'
WHITE='\033[1;37m'
GRAY='\033[0;90m'
NC='\033[0m'
ARROW="▶"
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

# Helper: Detect Termux
is_termux() { [ -d "/data/data/com.termux/files/usr" ]; }

apply_theme() {
    local theme_name="${ALL_THEMES[$current_pos]}"
    local theme_data="${THEMES[$theme_name]}"
    
    if is_termux; then
        echo -e "${theme_data}" | tr ';' '\n' > ~/.termux/colors.properties
        termux-reload-settings
        echo -e "\n ${GREEN}[✓] Applied ${theme_name}${NC}"
        sleep 1
    else
        echo -e "\n ${GRAY}[i] Direct theme application only supported on Termux.${NC}"
        echo -e " ${GRAY}Theme Data: ${theme_data}${NC}"
        sleep 2
    fi
}

draw_menu() {
    clear
    echo -e " ${CYAN}🎨 Color Themes${NC}"
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
    echo -e " ${GRAY}↑↓ Navigate   Enter to Apply   q Quit${NC}"
}

# Main Loop
while true; do
    draw_menu
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
            apply_theme
            break
            ;;
        "q")
            break
            ;;
    esac
done
