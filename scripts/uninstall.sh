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
    
    # Restore oldest backup (original user config) if it exists
    oldest_zshrc_bak=$(ls -tr $HOME/.zshrc.bak.* 2>/dev/null | head -n 1)
    if [ -n "$oldest_zshrc_bak" ]; then
        echo "Restoring oldest .zshrc backup: $oldest_zshrc_bak"
        cp "$oldest_zshrc_bak" "$HOME/.zshrc"
    fi

    oldest_p10k_bak=$(ls -tr $HOME/.p10k.zsh.bak.* 2>/dev/null | head -n 1)
    if [ -n "$oldest_p10k_bak" ]; then
        echo "Restoring oldest .p10k.zsh backup: $oldest_p10k_bak"
        cp "$oldest_p10k_bak" "$HOME/.p10k.zsh"
    fi

    # Clean up all backup files
    rm -f $HOME/.zshrc.bak.*
    rm -f $HOME/.p10k.zsh.bak.*
    rm -f $HOME/.zshrc.pre-oh-my-zsh

    echo "Removing MAXTER-specific plugins and themes..."
    rm -rf "$HOME/.oh-my-zsh"
    
    # Restore termux defaults if applicable
    if [ -d "$HOME/.termux" ]; then
        rm -f "$HOME/.termux/termux.properties"
        rm -f "$HOME/.termux/colors.properties"
        rm -f "$HOME/.termux/font.ttf"
    fi

    # Change shell back to bash
    echo "Changing shell back to Bash..."
    BASH_PATH=$(command -v bash || echo "/bin/bash")
    if [ -d "/data/data/com.termux/files/usr" ] && ! [ -f /etc/os-release ]; then
        chsh -s bash
    elif [ "$(id -u)" -eq 0 ] && [ -f /etc/passwd ]; then
        sed -i "s|^\($(whoami)\):\(.*\):[^:]*$|\1:\2:$BASH_PATH|" /etc/passwd
    else
        sudo chsh -s "$BASH_PATH" "$(whoami)" < /dev/null || chsh -s "$BASH_PATH" < /dev/null || true
    fi

    echo -e "${GREEN}MAXTER has been uninstalled.${NC}"
    echo "Please restart your terminal."
else
    echo "Uninstall aborted."
fi
