#!/bin/bash

# ==========================================
# MAXTER ZSH INSTALLER (Refined & Organized)
# ==========================================

# --- 1. Variables & UI Configuration ---

MAXTER_REPO="https://github.com/mahendraplus/MAXTER"
OMZ_INSTALLER="https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh"
P10K_REPO="https://github.com/romkatv/powerlevel10k.git"
SYNTAX_HIGHLIGHT_REPO="https://github.com/zsh-users/zsh-syntax-highlighting.git"
AUTOSUGGEST_REPO="https://github.com/zsh-users/zsh-autosuggestions"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Symbols
ICON_LOAD="[•.•]"
ICON_OK="[✓]"
ICON_FAIL="[×]"

# Paths
REPO_DIR="$HOME/MAXTER"
CONFIG_DIR="$REPO_DIR/configs"
ASSETS_DIR="$REPO_DIR/assets"
SCRIPTS_DIR="$REPO_DIR/scripts"

# --- 2. Helper Functions ---

msg_load() {
    echo -e "${BLUE}${ICON_LOAD} ${NC}$1..."
}

msg_ok() {
    echo -e "${GREEN}${ICON_OK} ${NC}$1"
}

msg_fail() {
    echo -e "${RED}${ICON_FAIL} ${NC}$1"
}

msg_warn() {
    echo -e "${YELLOW}[!] ${NC}$1"
}

run_task() {
    local task_name="$1"
    shift
    local cmd="$@"

    echo -ne "${BLUE}${ICON_LOAD} ${NC}${task_name}...\r"
    
    if eval "$cmd" > /dev/null 2>&1; then
        echo -ne "\033[2K\r" 
        msg_ok "$task_name"
    else
        echo -ne "\033[2K\r"
        msg_fail "$task_name failed!"
        return 1
    fi
}

# --- 3. Pre-Installation Check & Cleanup ---

cleanup_maxter() {
    msg_warn "Removing existing MAXTER configuration..."
    
    rm -rf "$HOME/.oh-my-zsh"
    rm -rf "$HOME/.zsh-syntax-highlighting"
    # Don't remove REPO_DIR if we are running from it!
    # But if we are reinstalling, we might want a fresh clone.
    # For now, let's just clean the destination configs.
    rm -f "$HOME/.zshrc"
    rm -f "$HOME/.p10k.zsh"
    
    if grep -q "exec zsh" "$HOME/.bashrc" 2>/dev/null; then
        sed -i '/exec zsh/d' "$HOME/.bashrc"
        msg_ok "Restored clean .bashrc"
    fi

    msg_ok "Cleanup complete."
}

# Check if we are running inside the cloned repo
if [ -d ".git" ] && [[ $(git remote get-url origin 2>/dev/null) == *"$MAXTER_REPO"* ]]; then
    REPO_DIR=$(pwd)
    CONFIG_DIR="$REPO_DIR/configs"
    ASSETS_DIR="$REPO_DIR/assets"
    SCRIPTS_DIR="$REPO_DIR/scripts"
fi

if [ -d "$HOME/.oh-my-zsh" ]; then
    msg_warn "Oh-My-Zsh is already installed."
    echo -ne "${YELLOW}Do you want to reinstall? (y/n): ${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        cleanup_maxter
    else
        msg_ok "Proceeding with existing Oh-My-Zsh..."
    fi
fi

# --- 4. OS Detection ---

msg_load "Detecting Operating System"

if [ -d "/data/data/com.termux/files/usr" ]; then
    OS="Termux"
    INSTALL_CMD="pkg install -y"
    UPDATE_CMD="pkg update -y && pkg upgrade -y -o Dpkg::Options::=\"--force-confdef\" -o Dpkg::Options::=\"--force-confold\""
    termux-setup-storage
elif [ -f "/etc/debian_version" ]; then
    OS="Debian/Ubuntu"
    export DEBIAN_FRONTEND=noninteractive
    INSTALL_CMD="sudo apt install -y"
    UPDATE_CMD="sudo apt update && sudo apt upgrade -y"
elif [ -f "/etc/arch-release" ]; then
    OS="Arch"
    INSTALL_CMD="sudo pacman -S --noconfirm"
    UPDATE_CMD="sudo pacman -Syu --noconfirm"
else
    OS="Unknown"
    INSTALL_CMD="sudo apt install -y"
    UPDATE_CMD="sudo apt update"
fi

msg_ok "System Detected: $OS"

# --- 5. System Update & Packages ---

run_task "Updating System Packages" "$UPDATE_CMD"
run_task "Installing Dependencies (git, zsh, curl, wget, unzip)" "$INSTALL_CMD git zsh curl wget unzip"

# --- 6. Install Oh My Zsh ---

if [ ! -d "$HOME/.oh-my-zsh" ]; then
    echo -ne "${BLUE}${ICON_LOAD} ${NC}Downloading and Installing Oh My Zsh...\r"
    sh -c "$(curl -fsSL $OMZ_INSTALLER)" "" --unattended > /dev/null 2>&1
    
    if [ -d "$HOME/.oh-my-zsh" ]; then
        echo -ne "\033[2K\r"
        msg_ok "Oh My Zsh Installed"
    else
        echo -ne "\033[2K\r"
        msg_fail "Oh My Zsh Installation Failed"
        exit 1
    fi
fi

# --- 7. Install Plugins & Themes ---

ZSH_CUSTOM="${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}"

if [ ! -d "$ZSH_CUSTOM/themes/powerlevel10k" ]; then
    run_task "Downloading Powerlevel10k Theme" "git clone --depth=1 $P10K_REPO $ZSH_CUSTOM/themes/powerlevel10k"
fi

if [ ! -d "$HOME/.zsh-syntax-highlighting" ]; then
    run_task "Downloading Syntax Highlighting" "git clone --depth=1 $SYNTAX_HIGHLIGHT_REPO $HOME/.zsh-syntax-highlighting"
fi

if [ ! -d "$ZSH_CUSTOM/plugins/zsh-autosuggestions" ]; then
    run_task "Downloading Auto-Suggestions" "git clone $AUTOSUGGEST_REPO $ZSH_CUSTOM/plugins/zsh-autosuggestions"
fi

# --- 8. MAXTER Configuration ---

# If we are NOT in the repo, clone it
if [ ! -d "$REPO_DIR" ]; then
    run_task "Cloning MAXTER Repository" "git clone $MAXTER_REPO $HOME/MAXTER"
    REPO_DIR="$HOME/MAXTER"
    CONFIG_DIR="$REPO_DIR/configs"
fi

msg_load "Applying Configuration Files"
cp -f "$CONFIG_DIR/zsh/.p10k.zsh" "$HOME/.p10k.zsh"
cp -f "$CONFIG_DIR/zsh/.zshrc" "$HOME/.zshrc"

# Safety: Ensure syntax highlighting is sourced
if ! grep -q "zsh-syntax-highlighting.zsh" "$HOME/.zshrc"; then
    echo "source $HOME/.zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> "$HOME/.zshrc"
fi
msg_ok "Configuration Applied"

# --- 9. Termux Specifics ---

if [ "$OS" == "Termux" ]; then
    msg_load "Applying Termux Settings"
    
    mkdir -p "$HOME/.termux"
    cp -f "$CONFIG_DIR/termux/termux.properties" "$HOME/.termux/termux.properties"
    cp -f "$CONFIG_DIR/termux/colors.properties" "$HOME/.termux/colors.properties"
    cp -f "$ASSETS_DIR/font.ttf" "$HOME/.termux/font.ttf"
    
    # Remove MOTD
    rm -f "/data/data/com.termux/files/usr/etc/motd"
    touch "/data/data/com.termux/files/usr/etc/motd"
    
    # Reload settings
    termux-reload-settings
    msg_ok "Termux Settings Applied"
fi

# --- 10. Set Default Shell & Finish ---

msg_load "Changing default shell to Zsh"

if [ "$OS" == "Termux" ]; then
    chsh -s zsh
else
    sudo chsh -s "$(which zsh)" $(whoami) > /dev/null 2>&1
fi

msg_ok "Default shell updated"

echo ""
echo -e "${GREEN}=======================================${NC}"
echo -e "${GREEN}   MAXTER INSTALLATION SUCCESSFUL!     ${NC}"
echo -e "${GREEN}=======================================${NC}"
echo "Restart your terminal or type 'zsh' to start."
echo ""

# Launch Zsh immediately
exec zsh -l
