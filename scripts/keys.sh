#!/bin/bash
# MAXTER v27.0 Termux Extra-Keys Manager

# ── Colors & Icons ──────────────────────────────────
CYAN='\033[1;36m'
GREEN='\033[1;32m'
BLUE='\033[1;34m'
RED='\033[1;31m'
WHITE='\033[1;37m'
GRAY='\033[0;90m'
NC='\033[0m'
DIV="────────────────────────────────────────"

# Helper: Detect Termux
is_termux() { [ -d "/data/data/com.termux/files/usr" ]; }

if ! is_termux; then
    echo -e " ${GRAY}[i] Extra-keys is a Termux-only feature.${NC}"
    echo -e " ${GRAY}[i] Skipping — not applicable on this system.${NC}"
    exit 0
fi

PROP_FILE="$HOME/.termux/termux.properties"

show_current() {
    echo -e " ${BLUE}[i] Termux detected — showing key config${NC}"
    echo ""
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

while true; do
    clear
    echo -e " ${CYAN}⌨ Termux Extra-Keys${NC}"
    echo -e " ${GRAY}${DIV}${NC}"
    
    show_current

    echo -e " ${WHITE}Options:${NC}"
    echo -e "  [1] View raw config"
    echo -e "  [2] Edit layout (opens editor)"
    echo -e "  [3] Reset to MAXTER default"
    echo -e "  [4] Apply & reload settings"
    echo -e "  [0] Back to dashboard"
    echo ""
    read -p " Enter choice (0-4): " opt
    
    case $opt in
        1) 
            grep "^extra-keys" "$PROP_FILE" || echo "Default"
            read -p "Press Enter..." ;;
        2) 
            ${EDITOR:-nano} "$PROP_FILE"
            ;;
        3)
            # Use the specified professional layout from notes
            sed -i "/^extra-keys =/d" "$PROP_FILE"
            echo "extra-keys = [['ESC','DRAWER','SHIFT','HOME','UP','END','PGUP'], ['TAB','CTRL','ALT','LEFT','DOWN','RIGHT','PGDN']]" >> "$PROP_FILE"
            echo -e " ${GREEN}[✓] Reset to MAXTER layout.${NC}"
            sleep 1
            ;;
        4)
            termux-reload-settings
            echo -e " ${GREEN}[✓] Reloaded.${NC}"
            sleep 1
            ;;
        0) break ;;
        *) echo "Invalid." ; sleep 1 ;;
    esac
done
