#!/bin/bash
# ==========================================
# MAXTER Settings TUI (Premium Dashboard)
# ==========================================

# Colors
CYAN='\033[1;36m'
YELLOW='\033[1;33m'
GREEN='\033[1;32m'
RED='\033[1;31m'
NC='\033[0m'

# Helper to check for Termux
is_termux() {
    [ -d "/data/data/com.termux/files/usr" ]
}

while true; do
    clear
    echo -e "${CYAN}"
    echo "  __  __   _   __  __ _____ _____ ____  "
    echo " |  \/  | /_\  \ \/ /|_   _| ____|  _ \ "
    echo " | |\/| |/ _ \  \  /   | | |  _| | |_) |"
    echo " | |  | / ___ \ /  \   | | | |___|  _ < "
    echo " |_|  |_/_/   \_/_/\_\  |_| |_____|_| \_\\"
    echo -e "${NC}"
    echo -e " ${YELLOW}--- Ultimate Settings Dashboard ---${NC}"
    echo ""
    echo -e " [1] Edit .zshrc           [2] Edit .p10k.zsh"
    
    if is_termux; then
        echo -e " [3] Termux Keys           [4] UI Colors"
    else
        echo -e " [3] Edit Configs (Linux)  [4] System Info"
    fi
    
    echo -e " [5] React (Vite) Workflow [6] Vue (Vite) Workflow"
    echo -e " [7] Update Maxter         [8] Uninstall Maxter"
    echo -e " [0] Exit"
    echo ""
    read -p " Select Option: " opt
    
    case $opt in
        1) ${EDITOR:-nano} ~/.zshrc ;;
        2) ${EDITOR:-nano} ~/.p10k.zsh ;;
        3) 
            if is_termux; then
                ${EDITOR:-nano} ~/.termux/termux.properties && termux-reload-settings
            else
                echo "Feature coming soon for Desktop Linux."
                sleep 1
            fi
            ;;
        4) 
            if is_termux; then
                ${EDITOR:-nano} ~/.termux/colors.properties && termux-reload-settings
            else
                neofetch || screenfetch || uname -a
                read -p "Press enter to continue..."
            fi
            ;;
        5) 
            echo -e "${GREEN}Launching React (Vite) Dev Environment...${NC}"
            read -p "Enter project name: " pname
            npm create vite@latest "${pname:-my-react-app}" -- --template react
            ;;
        6) 
            echo -e "${GREEN}Launching Vue (Vite) Dev Environment...${NC}"
            read -p "Enter project name: " pname
            npm create vite@latest "${pname:-my-vue-app}" -- --template vue
            ;;
        7) 
            echo -e "${YELLOW}Updating MAXTER...${NC}"
            cd "$HOME/MAXTER" && git pull && bash install.sh
            break
            ;;
        8)
            if [ -f "$HOME/MAXTER/scripts/uninstall.sh" ]; then
                bash "$HOME/MAXTER/scripts/uninstall.sh"
                break
            else
                echo -e "${RED}Uninstall script not found!${NC}"
                sleep 2
            fi
            ;;
        0) clear; break ;;
        *) echo -e "${RED}Invalid option.${NC}" ; sleep 1 ;;
    esac
done
