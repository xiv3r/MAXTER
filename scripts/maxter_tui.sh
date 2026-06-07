#!/bin/bash
# ==========================================
# MAXTER PREMIUM DASHBOARD (v27.0)
# ==========================================

# ── Colors & Nerd Icons ─────────────────────────────
CYAN='\033[1;36m'
WHITE='\033[1;37m'
BOLD='\033[1m'
DIM='\033[2m'
GRAY='\033[0;90m'
NC='\033[0m'
GREEN='\033[1;32m'
RED='\033[1;31m'

ICON_UP="󰚰"
ICON_DEL="󰆴"
ICON_COLOR="󰏘"
ICON_KEYS="󰌌"
ICON_INFO="󰋼"
ICON_HELP="󰘥"
ICON_GLOBE="󰖟"
ICON_SUPPORT="󰮔"
DIV="────────────────────────────────────────"

# --- Logic ---
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

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

show_help() {
    detect_system
    clear
    echo -e "${BOLD}${CYAN}󰀼  MAXTER${NC} ${DIM}v27.0${NC}             ${GRAY}System: ${BOLD}${SYSTEM} $(uname -m)${NC}"
    echo -e "${GRAY}${DIV}${NC}"
    
    # ── Management ────────────────────────────────────
    echo -e " ${BOLD}${WHITE}󰒓  Management${NC}"
    echo -e "   ${GREEN}update${NC}          ${ICON_UP}  Sync repo & update"
    echo -e "   ${RED}uninstall${NC}       ${ICON_DEL}  Remove MAXTER"
    echo ""
    
    # ── Customization ──────────────────────────────────
    echo -e " ${BOLD}${WHITE}󰃢  Customization${NC}"
    echo -e "   ${CYAN}color${NC}           ${ICON_COLOR}  Interactive selector"
    if [ "$SYSTEM" == "termux" ]; then
        echo -e "   ${CYAN}keys${NC}            ${ICON_KEYS}  Manage extra-keys  *"
    fi
    echo ""
    
    # ── Information ────────────────────────────────────
    echo -e "   ${WHITE}info${NC}            ${ICON_INFO}  System diagnostics"
    echo -e "   ${WHITE}help${NC}            ${ICON_HELP}  Usage guide"
    echo ""
    
    # ── Social / Support ───────────────────────────────
    echo -e " ${ICON_GLOBE}  ${WHITE}mahendraplus.github.io${NC}"
    echo -e " ${ICON_SUPPORT}  ${GRAY}Support: ${DIM}https://mahendraplus.github.io/maxlab/support/${NC}"
    
    if [ "$SYSTEM" == "termux" ]; then
        echo -e "${GRAY}${DIV}${NC}"
        echo -e " ${DIM}* Termux only feature${NC}"
    fi
    echo -e "${GRAY}${DIV}${NC}"
}

# --- Command Router ---
case "${1:-help}" in
    help) show_help ;;
    info) 
        bash "$SCRIPT_DIR/sysinfo.sh" 2>/dev/null || uname -a
        ;;
    update)
        cd ~/MAXTER && git pull origin Max && bash setup.sh
        ;;
    uninstall)
        bash "$SCRIPT_DIR/uninstall.sh"
        ;;
    color)
        if [ -n "$2" ]; then
            source "$SCRIPT_DIR/themes/definitions.sh"
            for name in "${!THEMES[@]}"; do
                if [[ "${name,,}" == "${2,,}" ]]; then
                    if [ -d "/data/data/com.termux" ]; then
                        echo -e "${THEMES[$name]}" | tr ';' '\n' > ~/.termux/colors.properties
                        termux-reload-settings
                        echo "Applied $name"
                    else
                        echo "Direct apply only on Termux. Theme data: ${THEMES[$name]}"
                    fi
                    exit 0
                fi
            done
            echo "Theme $2 not found."
        else
            bash "$SCRIPT_DIR/color_selector.sh"
        fi
        ;;
    keys)
        bash "$SCRIPT_DIR/keys.sh"
        ;;
    *)
        echo -e "Unknown command: $1"
        exit 1
        ;;
esac
