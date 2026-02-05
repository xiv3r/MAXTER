#!/bin/bash

# --- 1. Variables and Helper Functions ---

MAXTER_REPO="https://github.com/mahendraplus/MAXTER"
OMZ_INSTALLER="https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh"
P10K_REPO="https://github.com/romkatv/powerlevel10k.git"
SYNTAX_HIGHLIGHT_REPO="https://github.com/zsh-users/zsh-syntax-highlighting.git"
AUTOSUGGEST_REPO="https://github.com/zsh-users/zsh-autosuggestions"

# Color codes for pretty output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_err() { echo -e "${RED}[ERROR]${NC} $1"; }

# Function to check internet and retry commands
run_with_retry() {
    local n=1
    local max=5
    local delay=2
    while true; do
        "$@" && break || {
            if [[ $n -lt $max ]]; then
                ((n++))
                log_warn "Command failed. Retrying ($n/$max) in $delay seconds..."
                sleep $delay;
            else
                log_err "The command has failed after $max attempts."
                return 1
            fi
        }
    done
}

# --- 2. OS Detection and Package Management ---

log_info "Detecting Operating System..."

if [ -d "/data/data/com.termux/files/usr" ]; then
    OS="Termux"
    INSTALL_CMD="pkg install -y"
    UPDATE_CMD="pkg update -y && pkg upgrade -y"
    # Termux specific fix for 'source' errors
    termux-setup-storage
elif [ -f "/etc/debian_version" ]; then
    OS="Debian/Mint/Ubuntu"
    INSTALL_CMD="sudo apt install -y"
    UPDATE_CMD="sudo apt update && sudo apt upgrade -y"
elif [ -f "/etc/arch-release" ]; then
    OS="Arch"
    INSTALL_CMD="sudo pacman -S --noconfirm"
    UPDATE_CMD="sudo pacman -Syu --noconfirm"
elif [ -f "/etc/fedora-release" ]; then
    OS="Fedora"
    INSTALL_CMD="sudo dnf install -y"
    UPDATE_CMD="sudo dnf upgrade -y"
else
    OS="Unknown"
    log_warn "Unknown OS. Attempting to use 'apt' as fallback."
    INSTALL_CMD="sudo apt install -y"
    UPDATE_CMD="sudo apt update"
fi

log_info "System Detected: $OS"

# --- 3. System Update & Dependencies ---

log_info "Updating system packages..."
eval $UPDATE_CMD

log_info "Installing dependencies (git, zsh, curl, wget)..."
run_with_retry $INSTALL_CMD git zsh curl wget unzip

# --- 4. Cleanup & Backup (Prevents Corruption) ---

log_info "Cleaning up old/corrupted installations..."

# Remove Oh-My-Zsh if it exists to avoid "directory already exists" errors
if [ -d "$HOME/.oh-my-zsh" ]; then
    log_warn "Found existing Oh-My-Zsh. Removing to ensure clean install..."
    rm -rf "$HOME/.oh-my-zsh"
fi

# Backup existing .zshrc
if [ -f "$HOME/.zshrc" ]; then
    log_info "Backing up current .zshrc to .zshrc.bak..."
    cp "$HOME/.zshrc" "$HOME/.zshrc.bak"
fi

# --- 5. Install Oh My Zsh (Unattended) ---

log_info "Installing Oh My Zsh..."
# RUNZSH=no prevents it from starting zsh immediately and stopping the script
sh -c "$(curl -fsSL $OMZ_INSTALLER)" "" --unattended

# --- 6. Install Plugins & Themes ---

ZSH_CUSTOM="${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}"

log_info "Installing Powerlevel10k Theme..."
if [ -d "$ZSH_CUSTOM/themes/powerlevel10k" ]; then rm -rf "$ZSH_CUSTOM/themes/powerlevel10k"; fi
run_with_retry git clone --depth=1 $P10K_REPO "$ZSH_CUSTOM/themes/powerlevel10k"

log_info "Installing Syntax Highlighting..."
if [ -d "$HOME/.zsh-syntax-highlighting" ]; then rm -rf "$HOME/.zsh-syntax-highlighting"; fi
run_with_retry git clone --depth=1 $SYNTAX_HIGHLIGHT_REPO "$HOME/.zsh-syntax-highlighting"

log_info "Installing Auto-Suggestions..."
if [ -d "$ZSH_CUSTOM/plugins/zsh-autosuggestions" ]; then rm -rf "$ZSH_CUSTOM/plugins/zsh-autosuggestions"; fi
run_with_retry git clone $AUTOSUGGEST_REPO "$ZSH_CUSTOM/plugins/zsh-autosuggestions"

# --- 7. MAXTER Repository Configuration ---

log_info "Cloning MAXTER Repository..."
if [ -d "$HOME/MAXTER" ]; then rm -rf "$HOME/MAXTER"; fi
run_with_retry git clone $MAXTER_REPO "$HOME/MAXTER"

log_info "Applying MAXTER Configurations..."

# Copy config files (Force overwrite)
cp -rf "$HOME/MAXTER/maxterm.p10k.zsh" "$HOME/.p10k.zsh"
cp -rf "$HOME/MAXTER/maxterm.zshrc" "$HOME/.zshrc"

# Inject Syntax Highlighting into .zshrc if not present (Safety Check)
if ! grep -q "zsh-syntax-highlighting.zsh" "$HOME/.zshrc"; then
    echo "source $HOME/.zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> "$HOME/.zshrc"
fi

# --- 8. Termux Specific Adjustments ---

if [ "$OS" == "Termux" ]; then
    log_info "Applying Termux-specific settings..."
    
    # Ensure .termux directory exists
    mkdir -p "$HOME/.termux"
    
    # Copy Termux properties and fonts
    cp -rf "$HOME/MAXTER/maxterm.termux.properties" "$HOME/.termux/termux.properties"
    cp -rf "$HOME/MAXTER/maxterm.colors.properties" "$HOME/.termux/colors.properties"
    cp -rf "$HOME/MAXTER/maxterm.font.ttf" "$HOME/.termux/font.ttf"
    
    # Remove MOTD (Welcome message)
    if [ -f "/data/data/com.termux/files/usr/etc/motd" ]; then
        rm "/data/data/com.termux/files/usr/etc/motd"
        touch "/data/data/com.termux/files/usr/etc/motd" # Create empty file to suppress error
    fi
    
    # Reload termux settings
    termux-reload-settings
fi

# --- 9. Finalize and Launch ---

log_info "Changing default shell to Zsh..."
chsh -s "$(which zsh)"

log_info "Installation Complete! Starting Zsh..."

# Start zsh immediately replacing the current shell
exec zsh -l
