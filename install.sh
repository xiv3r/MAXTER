#!/bin/bash

# ==========================================
# MAXTER ZSH INSTALLER (Refined)
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

# Function to run commands with a spinner/loading status
run_task() {
    local task_name="$1"
    shift
    local cmd="$@"

    echo -ne "${BLUE}${ICON_LOAD} ${NC}${task_name}...\r"
    
    # Run command and capture output/error just in case
    if eval "$cmd" > /dev/null 2>&1; then
        # Clear the line and print success
        echo -ne "\033[2K\r" 
        msg_ok "$task_name"
    else
        echo -ne "\033[2K\r"
        msg_fail "$task_name failed!"
        exit 1
    fi
}

# --- 3. Pre-Installation Check & Cleanup ---

cleanup_maxter() {
    msg_warn "Removing existing MAXTER configuration..."
    
    rm -rf "$HOME/.oh-my-zsh"
    rm -rf "$HOME/.zsh-syntax-highlighting"
    rm -rf "$HOME/MAXTER"
    rm -f "$HOME/.zshrc"
    rm -f "$HOME/.p10k.zsh"
    
    # Restore bashrc if it was previously tampered with (Termux fix)
    if grep -q "exec zsh" "$HOME/.bashrc" 2>/dev/null; then
        sed -i '/exec zsh/d' "$HOME/.bashrc"
        msg_ok "Restored clean .bashrc"
    fi

    msg_ok "Cleanup complete."
}

if [ -d "$HOME/MAXTER" ] || [ -d "$HOME/.oh-my-zsh" ]; then
    msg_warn "MAXTER or Oh-My-Zsh is already installed."
    echo -ne "${YELLOW}Do you want to reinstall? This will delete old configs. (y/n): ${NC}"
    read -r response
    if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
        cleanup_maxter
    else
        msg_ok "Installation aborted by user."
        exit 0
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
    # We use 'sh -c' to run the curl output, passing --unattended to prevent it from switching shell immediately
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

run_task "Downloading Powerlevel10k Theme" "git clone --depth=1 $P10K_REPO $ZSH_CUSTOM/themes/powerlevel10k"
run_task "Downloading Syntax Highlighting" "git clone --depth=1 $SYNTAX_HIGHLIGHT_REPO $HOME/.zsh-syntax-highlighting"
run_task "Downloading Auto-Suggestions" "git clone $AUTOSUGGEST_REPO $ZSH_CUSTOM/plugins/zsh-autosuggestions"

# --- 8. MAXTER Configuration ---

run_task "Cloning MAXTER Repository" "git clone $MAXTER_REPO $HOME/MAXTER"

msg_load "Applying Configuration Files"
cp -rf "$HOME/MAXTER/maxterm.p10k.zsh" "$HOME/.p10k.zsh"
cp -rf "$HOME/MAXTER/maxterm.zshrc" "$HOME/.zshrc"

# Safety: Ensure syntax highlighting is sourced
if ! grep -q "zsh-syntax-highlighting.zsh" "$HOME/.zshrc"; then
    echo "source $HOME/.zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> "$HOME/.zshrc"
fi
msg_ok "Configuration Applied"

# --- 9. Termux Specifics (THE FIX) ---

if [ "$OS" == "Termux" ]; then
    msg_load "Applying Termux Settings"
    
    mkdir -p "$HOME/.termux"
    cp -rf "$HOME/MAXTER/maxterm.termux.properties" "$HOME/.termux/termux.properties"
    cp -rf "$HOME/MAXTER/maxterm.colors.properties" "$HOME/.termux/colors.properties"
    cp -rf "$HOME/MAXTER/maxterm.font.ttf" "$HOME/.termux/font.ttf"
    
    # Remove MOTD
    rm -f "/data/data/com.termux/files/usr/etc/motd"
    touch "/data/data/com.termux/files/usr/etc/motd"
    
    # Reload settings
    termux-reload-settings
    msg_ok "Termux Settings Applied"
fi

# --- 10. Set Default Shell & Finish ---

msg_load "Changing default shell to Zsh"

# This is the correct way to set shell in Termux/Linux without breaking bash
if [ "$OS" == "Termux" ]; then
    chsh -s zsh
else
    # On standard Linux, chsh might ask for password
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
