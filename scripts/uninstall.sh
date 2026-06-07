#!/bin/bash
# ==========================================
# MAXTER UNINSTALLER
# ==========================================

RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m'

echo -e "${RED}Warning: This will remove MAXTER and revert your shell to Bash.${NC}"
read -p "Are you sure? (y/n): " confirm

if [[ "$confirm" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo "Removing MAXTER configuration..."
    
    # Remove configs
    rm -f "$HOME/.zshrc"
    rm -f "$HOME/.p10k.zsh"
    rm -rf "$HOME/.oh-my-zsh"
    rm -rf "$HOME/.zsh-syntax-highlighting"
    
    # Restore termux defaults if applicable
    if [ -d "$HOME/.termux" ]; then
        rm -f "$HOME/.termux/termux.properties"
        rm -f "$HOME/.termux/colors.properties"
        rm -f "$HOME/.termux/font.ttf"
    fi

    # Change shell back to bash
    echo "Changing shell back to Bash..."
    if [ -d "/data/data/com.termux/files/usr" ]; then
        chsh -s bash
    else
        sudo chsh -s "$(which bash)" "$(whoami)"
    fi

    echo -e "${GREEN}MAXTER has been uninstalled.${NC}"
    echo "Please restart your terminal."
else
    echo "Uninstall aborted."
fi
