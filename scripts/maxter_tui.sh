#!/bin/bash
# ==========================================
# MAXTER PREMIUM DASHBOARD (Command-Driven)
# ==========================================

# ── Colors ──────────────────────────────────────────
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'
GRAY='\033[0;90m'
NC='\033[0m'

# ── Bold / Style ─────────────────────────────────────
BOLD_CYAN='\033[1;36m'
BOLD_WHITE='\033[1;37m'
BOLD_GREEN='\033[1;32m'
BOLD_RED='\033[1;31m'
BOLD='\033[1m'
DIM='\033[2m'

# ── Icons ────────────────────────────────────────────
ICON_OK="[✓]"
ICON_FAIL="[×]"
ICON_INFO="[i]"
ICON_DONE="[★]"
ARROW="➜"

# ── Dividers ──────────────────────────────────────────
DIV="────────────────────────────────────────"

# --- Logic ---
is_termux() { [ -d "/data/data/com.termux/files/usr" ]; }

show_help() {
    echo -e "${BOLD_CYAN}MAXTER DASHBOARD${NC} ${DIM}v26.0${NC}"
    echo -e "${GRAY}${DIV}${NC}"
    echo -e " ${BOLD_WHITE}Usage:${NC} maxter <command> [args]"
    echo ""
    echo -e " ${BOLD}Management:${NC}"
    echo -e "   update          Sync repo and update configs"
    echo -e "   uninstall       Remove MAXTER completely"
    echo ""
    echo -e " ${BOLD}Customization:${NC}"
    echo -e "   color           Show premium color picker"
    echo -e "   color <name>    Apply a specific color theme"
    echo -e "   keys            Show current Termux extra-keys"
    echo ""
    echo -e " ${BOLD}Development:${NC}"
    echo -e "   react <name>    Bootstrap React project (Vite)"
    echo -e "   vue <name>      Bootstrap Vue project (Vite)"
    echo ""
    echo -e " ${BOLD}System:${NC}"
    echo -e "   info            Show system diagnostics"
    echo -e "   help            Show this menu"
    echo -e "${GRAY}${DIV}${NC}"
}

# --- Color Picker ---
show_colors() {
    echo -e " ${BOLD_WHITE}Premium Color Themes${NC}"
    echo -e "${GRAY}${DIV}${NC}"
    
    # List of bundled color themes (from ~/.termux/colors.properties)
    # Since we want it command driven, we'll offer some presets
    declare -A themes
    themes["Matrix"]="background:#000000;foreground:#00ff00;cursor:#00ff00"
    themes["Ocean"]="background:#0f111a;foreground:#46bdff;cursor:#46bdff"
    themes["Rose"]="background:#1a141a;foreground:#f58ab2;cursor:#f58ab2"
    themes["Dracula"]="background:#282a36;foreground:#f8f8f2;cursor:#6272a4"
    themes["Industrial"]="background:#0a0a0a;foreground:#39ff14;cursor:#39ff14"
    themes["Nord"]="background:#2e3440;foreground:#d8dee9;cursor:#88c0d0"

    if [ -z "$1" ]; then
        for name in "${!themes[@]}"; do
            echo -e " ${BOLD_GREEN}${ARROW}${NC} ${BOLD}${name}${NC}"
        done
        echo ""
        echo -e " ${DIM}Use 'maxter color <name>' to apply.${NC}"
    else
        local selected=$1
        # Case insensitive check
        for name in "${!themes[@]}"; do
            if [[ "${name,,}" == "${selected,,}" ]]; then
                echo -e " ${CYAN}${ICON_INFO}${NC} Applying ${BOLD}${name}${NC} theme..."
                if is_termux; then
                    # Write to colors.properties
                    echo -e "${themes[$name]}" | tr ';' '\n' > ~/.termux/colors.properties
                    termux-reload-settings
                    echo -e " ${BOLD_GREEN}${ICON_OK}${NC} Theme updated successfully."
                else
                    echo -e " ${RED}${ICON_FAIL}${NC} Themes currently only supported on Termux."
                fi
                return
            fi
        done
        echo -e " ${BOLD_RED}${ICON_FAIL}${NC} Theme '${selected}' not found."
    fi
}

# --- Command Router ---
case "${1:-help}" in
    help) show_help ;;
    info) 
        echo -e " ${BOLD_WHITE}System Info${NC}"
        echo -e "${GRAY}${DIV}${NC}"
        uname -a
        [ -n "$TERMUX_VERSION" ] && echo "Termux: $TERMUX_VERSION"
        echo "Shell: $SHELL"
        ;;
    update)
        echo -e " ${CYAN}${ICON_INFO}${NC} Syncing with repository..."
        cd ~/MAXTER && git pull origin Max && bash setup.sh
        ;;
    uninstall)
        if [ -f ~/MAXTER/scripts/uninstall.sh ]; then
            bash ~/MAXTER/scripts/uninstall.sh
        else
            echo -e " ${RED}${ICON_FAIL}${NC} Uninstaller missing."
        fi
        ;;
    color) show_colors "$2" ;;
    keys)
        if is_termux; then
            echo -e " ${BOLD_WHITE}Termux Extra-Keys${NC}"
            echo -e "${GRAY}${DIV}${NC}"
            grep "extra-keys =" ~/.termux/termux.properties | sed "s/extra-keys = //"
        else
            echo -e " ${RED}${ICON_FAIL}${NC} Only available on Termux."
        fi
        ;;
    react)
        local name=${2:-my-react-app}
        echo -e " ${BOLD_BLUE}${ICON_INFO}${NC} Scaffolding React + Vite..."
        npm create vite@latest "$name" -- --template react
        ;;
    vue)
        local name=${2:-my-vue-app}
        echo -e " ${BOLD_BLUE}${ICON_INFO}${NC} Scaffolding Vue + Vite..."
        npm create vite@latest "$name" -- --template vue
        ;;
    *)
        echo -e " ${BOLD_RED}${ICON_FAIL}${NC} Unknown command: $1"
        echo -e " ${DIM}Type 'maxter help' for usage.${NC}"
        exit 1
        ;;
esac
