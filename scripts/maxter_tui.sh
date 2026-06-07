#!/bin/bash
# ==========================================
# MAXTER PREMIUM DASHBOARD (v27.0)
# ==========================================

# ── Colors ──────────────────────────────────────────
CYAN='\033[1;36m'
WHITE='\033[1;37m'
BOLD='\033[1m'
DIM='\033[2m'
GRAY='\033[0;90m'
NC='\033[0m'

# ── Icons ────────────────────────────────────────────
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
    echo -e "${BOLD}${CYAN}MAXTER${NC} ${DIM}v27.0${NC}                    ${GRAY}System: ${BOLD}${SYSTEM} $(uname -m)${NC}"
    echo -e "${GRAY}${DIV}${NC}"
    echo -e " ${BOLD}${WHITE}Usage:${NC} maxter <command> [args]"
    echo ""
    echo -e " ${BOLD}Customization:${NC}"
    echo -e "   color           Interactive theme selector"
    echo -e "   color <name>    Apply theme directly"
    
    if [ "$SYSTEM" == "termux" ]; then
        echo -e "   keys            Manage Termux extra-keys  *"
    fi
    
    echo ""
    echo -e " ${BOLD}Management:${NC}"
    echo -e "   update          Sync repo and update configs"
    echo -e "   uninstall       Remove MAXTER completely"
    echo ""
    echo -e " ${BOLD}System:${NC}"
    echo -e "   info            Show system diagnostics"
    echo -e "   help            Show this menu"
    
    if [ "$SYSTEM" == "termux" ]; then
        echo ""
        echo -e " ${DIM}* Termux only${NC}"
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
            # Direct application logic
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
