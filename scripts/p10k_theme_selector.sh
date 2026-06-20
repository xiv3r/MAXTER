#!/bin/bash
# MAXTER // Version 27.4.B3
# Interactive Powerlevel10k Theme Selector

# ── Colors & Icons ──────────────────────────────────
CYAN='\033[1;36m'
GREEN='\033[1;32m'
RED='\033[1;31m'
WHITE='\033[1;37m'
GRAY='\033[0;90m'
NC='\033[0m'
BOLD='\033[1m'
DIM='\033[2m'

ICON_PALETTE="󰏘"
ARROW="󰁔" 
ICON_SAVE="󰆓"
ICON_BACK="󰌌"
DIV="────────────────────────────────────────"

# Load Utilities
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
source "$SCRIPT_DIR/utils.sh"
VERSION=$(get_version)

# Presets: Name | OS_ICON_FG | DIR_FG | DIR_ANCHOR_FG | DIR_SHORT_FG | VCS_CLEAN_FG | VCS_MODIFIED_FG | VCS_UNTRACKED_FG | VCS_VISUAL_COLOR | CHAR_OK | CHAR_ERR
PRESETS=(
    "Classic Teal|255|31|39|103|76|178|76|76|76|196"
    "Dracula Pro|212|141|141|61|117|215|117|117|212|196"
    "Nord Frost|109|110|111|244|151|180|151|151|109|196"
    "Gruvbox Warm|214|142|108|244|142|172|142|142|214|167"
    "Tokyo Night|111|120|73|243|120|179|120|120|111|196"
    "Cyberpunk|199|220|199|242|220|205|220|220|199|196"
    "Matrix Neon|82|40|82|238|40|46|40|40|82|196"
    "Solarized Dark|33|37|64|241|64|124|64|64|33|196"
    "Solarized Light|136|124|33|244|124|166|124|124|136|124"
    "Ayu Dark|208|37|37|244|150|216|150|150|208|196"
    "Rose Pine|224|116|116|245|224|223|224|224|224|196"
    "Monokai Retro|197|148|81|243|148|186|148|148|197|196"
    "Candy Pastel|218|117|218|248|117|200|117|117|218|196"
    "Neon Blue|39|45|39|240|45|43|45|45|39|196"
    "Forest Fern|71|72|28|243|72|100|72|72|71|196"
    "Sunset Glow|202|208|125|242|208|162|208|208|202|196"
    "Lavender fields|147|105|147|243|105|140|105|105|147|196"
    "Everforest Earth|108|107|66|243|107|142|107|107|108|196"
    "Horizon Sun|203|209|167|242|209|203|209|209|203|196"
    "Deep Space|245|248|240|238|248|244|248|248|245|196"
    "Cybernet Neon|51|48|51|240|48|44|48|48|51|196"
    "Crimson Blood|160|196|160|244|196|124|196|196|160|196"
    "Gold Medal|220|214|220|244|214|178|214|214|220|196"
    "Sakura Blossom|213|219|213|245|219|211|219|219|213|196"
)

total_presets=${#PRESETS[@]}
current_pos=0

# Backup original p10k.zsh variables
P10K_FILE="$HOME/.p10k.zsh"
ORIG_OS_ICON_FG=""
if [ -f "$P10K_FILE" ]; then
    ORIG_OS_ICON_FG=$(grep "POWERLEVEL9K_OS_ICON_FOREGROUND=" "$P10K_FILE" | cut -d= -f2 | xargs || true)
fi

apply_theme() {
    local preset="${PRESETS[$current_pos]}"
    IFS='|' read -r name os_icon dir_fg dir_anchor dir_short vcs_clean vcs_mod vcs_untracked vcs_visual char_ok char_err <<< "$preset"
    
    if [ -f "$P10K_FILE" ]; then
        sed -i -E "s/(typeset -g POWERLEVEL9K_OS_ICON_FOREGROUND=)[0-9]*/\1$os_icon/" "$P10K_FILE"
        sed -i -E "s/(typeset -g POWERLEVEL9K_DIR_FOREGROUND=)[0-9]*/\1$dir_fg/" "$P10K_FILE"
        sed -i -E "s/(typeset -g POWERLEVEL9K_DIR_ANCHOR_FOREGROUND=)[0-9]*/\1$dir_anchor/" "$P10K_FILE"
        sed -i -E "s/(typeset -g POWERLEVEL9K_DIR_SHORTENED_FOREGROUND=)[0-9]*/\1$dir_short/" "$P10K_FILE"
        sed -i -E "s/(typeset -g POWERLEVEL9K_VCS_CLEAN_FOREGROUND=)[0-9]*/\1$vcs_clean/" "$P10K_FILE"
        sed -i -E "s/(typeset -g POWERLEVEL9K_VCS_UNTRACKED_FOREGROUND=)[0-9]*/\1$vcs_untracked/" "$P10K_FILE"
        sed -i -E "s/(typeset -g POWERLEVEL9K_VCS_MODIFIED_FOREGROUND=)[0-9]*/\1$vcs_mod/" "$P10K_FILE"
        sed -i -E "s/(typeset -g POWERLEVEL9K_VCS_VISUAL_IDENTIFIER_COLOR=)[0-9]*/\1$vcs_visual/" "$P10K_FILE"
        sed -i -E "s/(typeset -g POWERLEVEL9K_PROMPT_CHAR_OK_.*_FOREGROUND=)[0-9]*/\1$char_ok/" "$P10K_FILE"
        sed -i -E "s/(typeset -g POWERLEVEL9K_PROMPT_CHAR_ERROR_.*_FOREGROUND=)[0-9]*/\1$char_err/" "$P10K_FILE"
    fi
}

draw_menu() {
    clear
    local preset="${PRESETS[$current_pos]}"
    IFS='|' read -r name os_icon dir_fg dir_anchor dir_short vcs_clean vcs_mod vcs_untracked vcs_visual char_ok char_err <<< "$preset"

    # Display menus left-aligned
    echo -e "${CYAN}${ICON_PALETTE}  Powerlevel10k Prompt Theme Selector (${current_pos}/${total_presets})${NC}"
    echo -e "${GRAY}${DIV}${NC}"
    
    # Render Mock Prompt Preview
    local p_os="\033[38;5;${os_icon}m󰀼\033[39m"
    local p_dir="\033[38;5;${dir_anchor}m/root\033[38;5;${dir_fg}m/MAXTER\033[39m"
    local p_vcs="\033[38;5;246mon \033[38;5;${vcs_clean}m  Max\033[39m"
    local p_char="\033[38;5;${char_ok}m❯\033[39m"
    
    echo -e "  ${WHITE}${BOLD}Preview Prompt Style:${NC}"
    echo -e "  ╭─ $p_os  $p_dir  $p_vcs"
    echo -e "  ╰─ $p_char "
    echo -e "${GRAY}${DIV}${NC}"

    # Sliding Window List of Themes
    local max_visible=12
    local half_window=$((max_visible / 2))
    local start_idx=$((current_pos - half_window))
    
    if [ "$start_idx" -lt 0 ]; then
        start_idx=0
    elif [ "$((start_idx + max_visible))" -gt "$total_presets" ]; then
        start_idx=$((total_presets - max_visible))
    fi
    [ "$start_idx" -lt 0 ] && start_idx=0

    for (( i=0; i<max_visible; i++ )); do
        local idx=$((start_idx + i))
        if [ "$idx" -ge "$total_presets" ]; then break; fi
        
        local theme_entry="${PRESETS[$idx]}"
        local theme_name=$(echo "$theme_entry" | cut -d'|' -f1)
        
        if [ "$current_pos" -eq "$idx" ]; then
            printf " ${GREEN}${ARROW} ${BOLD}${WHITE}%-30s${NC} ${GREEN}󰄬${NC}\n" "$theme_name"
        else
            printf "    %-30s\n" "$theme_name"
        fi
    done

    echo -e "${GRAY}${DIV}${NC}"
    echo -e " ${GRAY}↑↓ Navigate   ${WHITE}Enter${GRAY} Save & Exit   ${RED}q${GRAY} Cancel${NC}"
    echo -e " ${CYAN}󰖟  mahendraplus.github.io${NC}"
    echo -e " ${GRAY}󰮔  Support: ${WHITE}https://mahendraplus.github.io/maxlab/support/${NC}"
    echo -e "${GRAY}${DIV}${NC}"
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
                    current_pos=$(( (current_pos - 1 + total_presets) % total_presets ))
                    ;;
                "[B"|"[C") # Down or Right
                    current_pos=$(( (current_pos + 1) % total_presets ))
                    ;;
            esac
            ;;
        "") # Enter
            apply_theme
            echo -e "\n ${GREEN}󰄬${NC} ${BOLD}Theme configuration saved!${NC}"
            echo -e " ${GRAY}Restart Zsh or run ${BOLD}source ~/.p10k.zsh${GRAY} to apply.${NC}"
            sleep 1.5
            break
            ;;
        "q")
            # If they cancel, restore original or exit
            echo -e "\n ${RED}󰆴${NC} ${GRAY}Cancelled${NC}"
            sleep 1
            break
            ;;
    esac
done
