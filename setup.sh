#!/bin/bash

# ==========================================
# MAXTER ULTIMATE INSTALLER (Universal)
# ==========================================
# Version: 26.0
# Author: Mahendra Mali (Max)

set -uo pipefail

# --- 1. Variables & UI ---
REPO_URL="https://github.com/mahendraplus/MAXTER"
RAW_URL="https://raw.githubusercontent.com/mahendraplus/MAXTER/Max"
LOG_FILE="$HOME/.maxter_install.log"
ZSH_CUSTOM="${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}"
REPO_DIR="$HOME/MAXTER"

# TUI Icons
DONE="[\033[1;32mDONE\033[0m]"
SKIP="[\033[1;34mSKIP\033[0m]"
FAIL="[\033[1;31mFAIL\033[0m]"
INFO="[\033[1;36m >> \033[0m]"

# --- 2. Helper Functions ---
clear_log() { rm -f "$LOG_FILE" && touch "$LOG_FILE"; }

spinner() {
    local pid=$1
    local msg=$2
    local frames=('⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏')
    local i=0
    while kill -0 "$pid" 2>/dev/null; do
        printf "\r   ${frames[$i]}  %s..." "$msg"
        i=$(( (i+1) % 10 ))
        sleep 0.1
    done
    printf "\r\033[2K"
}

run_silent() {
    local msg="$1"
    shift
    local cmd="$@"
    
    printf " %b %s..." "$INFO" "$msg"
    eval "$cmd" >> "$LOG_FILE" 2>&1 &
    spinner $! "$msg"
    wait $!
    
    if [ $? -eq 0 ]; then
        printf "\r %b  %-25s %s\n" "$DONE" "$msg" "successful"
    else
        printf "\r %b  %-25s %s\n" "$FAIL" "$msg" "failed (see $LOG_FILE)"
        return 1
    fi
}

show_banner() {
    clear
    echo -e "\033[1;36m  ╔══════════════════════════════════════╗"
    echo -e "  ║   MAXTER INSTALLER  v26.0             ║"
    echo -e "  ║   System: $(uname -s) $(uname -m)             ║"
    echo -e "  ╚══════════════════════════════════════╝\033[0m"
    echo ""
}

# --- 3. OS Detection ---
detect_os() {
    if [ -d "/data/data/com.termux/files/usr" ]; then
        OS="termux"
        PKG_MAN="pkg"
        INSTALL_CMD="DEBIAN_FRONTEND=noninteractive pkg install -y"
        UPDATE_CMD="pkg update -y && pkg upgrade -y"
    elif [ -f "/etc/os-release" ]; then
        . /etc/os-release
        case "$ID" in
            debian|ubuntu|linuxmint|pop|kali)
                OS="debian"
                PKG_MAN="apt"
                INSTALL_CMD="sudo DEBIAN_FRONTEND=noninteractive apt install -y"
                UPDATE_CMD="sudo apt update -y && sudo apt upgrade -y"
                ;;
            arch|manjaro|endeavouros)
                OS="arch"
                PKG_MAN="pacman"
                INSTALL_CMD="sudo pacman -S --noconfirm"
                UPDATE_CMD="sudo pacman -Syu --noconfirm"
                ;;
            fedora|rhel|centos)
                OS="fedora"
                PKG_MAN="dnf"
                INSTALL_CMD="sudo dnf install -y -q"
                UPDATE_CMD="sudo dnf update -y"
                ;;
            *) OS="unknown" ;;
        esac
    else
        OS="unknown"
    fi
}

# --- 4. Component Checks ---
is_installed() {
    case "$1" in
        zsh) command -v zsh >/dev/null 2>&1 ;;
        omz) [ -d "$HOME/.oh-my-zsh" ] ;;
        p10k) [ -d "$ZSH_CUSTOM/themes/powerlevel10k" ] ;;
        syntax) [ -d "$HOME/.zsh-syntax-highlighting" ] ;;
        autosugg) [ -d "$ZSH_CUSTOM/plugins/zsh-autosuggestions" ] ;;
        font) [ -f "$HOME/.termux/font.ttf" ] ;;
        configs) [ -f "$HOME/.zshrc" ] && grep -q "MAXTER" "$HOME/.zshrc" ;;
        *) return 1 ;;
    esac
}

# --- 5. Main Installation ---
clear_log
show_banner
detect_os

if [ "$OS" == "unknown" ]; then
    echo -e " %b Unsupported Operating System. Exiting." "$FAIL"
    exit 1
fi

echo "   Checking system and installing components..."
echo ""

# Update System
run_silent "Updating system" "$UPDATE_CMD"

# Core Dependencies
CORE_PKGS="git zsh curl wget nodejs fontconfig"
run_silent "Installing core tools" "$INSTALL_CMD $CORE_PKGS"

# Oh-My-Zsh
if is_installed omz; then
    printf " %b  %-25s %s\n" "$SKIP" "oh-my-zsh" "already installed"
else
    run_silent "Installing oh-my-zsh" "CHSH=no RUNZSH=no sh -c \"\$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)\" \"\" --unattended"
fi

# Plugins & Themes
if is_installed p10k; then
    printf " %b  %-25s %s\n" "$SKIP" "powerlevel10k" "already installed"
else
    run_silent "Installing powerlevel10k" "git clone --depth=1 https://github.com/romkatv/powerlevel10k.git $ZSH_CUSTOM/themes/powerlevel10k"
fi

if is_installed syntax; then
    printf " %b  %-25s %s\n" "$SKIP" "zsh-syntax-highlighting" "already installed"
else
    run_silent "Installing zsh-syntax" "git clone --depth=1 https://github.com/zsh-users/zsh-syntax-highlighting.git $HOME/.zsh-syntax-highlighting"
fi

if is_installed autosugg; then
    printf " %b  %-25s %s\n" "$SKIP" "zsh-autosuggestions" "already installed"
else
    run_silent "Installing autosuggestions" "git clone https://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions"
fi

# Clone Repo if not present
if [ ! -d "$REPO_DIR" ]; then
    run_silent "Cloning MAXTER repo" "git clone -b Max $REPO_URL $REPO_DIR"
fi

# Apply Configs
run_silent "Applying Zsh configs" "cp -f $REPO_DIR/configs/zsh/.zshrc $HOME/.zshrc && cp -f $REPO_DIR/configs/zsh/.p10k.zsh $HOME/.p10k.zsh"

if [ "$OS" == "termux" ]; then
    if is_installed font; then
        printf " %b  %-25s %s\n" "$SKIP" "termux font" "already installed"
    else
        run_silent "Applying Termux settings" "mkdir -p $HOME/.termux && cp -f $REPO_DIR/configs/termux/termux.properties $HOME/.termux/termux.properties && cp -f $REPO_DIR/configs/termux/colors.properties $HOME/.termux/colors.properties && cp -f $REPO_DIR/assets/font.ttf $HOME/.termux/font.ttf && termux-reload-settings"
    fi
fi

# Dashboard Setup
run_silent "Finalizing Dashboard" "chmod +x $REPO_DIR/scripts/maxter_tui.sh && chmod +x $REPO_DIR/scripts/uninstall.sh"

# Set Shell
ZSH_PATH=$(command -v zsh)
if [ "$OS" == "termux" ]; then
    run_silent "Setting default shell" "chsh -s $ZSH_PATH"
else
    run_silent "Setting default shell" "sudo chsh -s $ZSH_PATH $(whoami)"
fi

echo ""
echo -e "  \033[1;32m══════════════════════════════════════════\033[0m"
echo -e "   Installation complete!"
echo -e "   Type: \033[1;36mmaxter\033[0m   to open settings"
echo -e "   Restart terminal or run: \033[1;33mexec zsh -l\033[0m"
echo -e "  \033[1;32m══════════════════════════════════════════\033[0m"
echo ""

# Done
