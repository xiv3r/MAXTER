#!/bin/bash
# ==========================================
# MAXTER // Version 27.3.B1
# ==========================================
# Author: Mahendra Mali (Max)

set -euo pipefail

# ── Colors ──────────────────────────────────────────
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
WHITE='\033[1;37m'
GRAY='\033[0;90m'
NC='\033[0m'

# ── Bold ─────────────────────────────────────────────
BOLD_GREEN='\033[1;32m'
BOLD_RED='\033[1;31m'
BOLD_BLUE='\033[1;34m'
BOLD_CYAN='\033[1;36m'
BOLD_WHITE='\033[1;37m'
BOLD='\033[1m'
DIM='\033[2m'

# ── Status Icons ─────────────────────────────────────
ICON_LOAD="[•.•]"
ICON_OK="[✓]"
ICON_FAIL="[×]"
ICON_SKIP="[-]"
ICON_INFO="[i]"
ICON_DONE="[★]"

# ── Spinner Frames ────────────────────────────────────
SPIN=('⠋' '⠙' '⠹' '⠸' '⠼' '⠴' '⠦' '⠧' '⠇' '⠏')

# ── Section Dividers ──────────────────────────────────
DIV_THIN="────────────────────────────────────────"

# --- Variables ---
REPO_URL="https://github.com/mahendraplus/MAXTER"
LOG_FILE="$HOME/.maxter_install.log"
ZSH_CUSTOM="${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}"
REPO_DIR="$HOME/MAXTER"
PROPS_FILE="$REPO_DIR/version.properties"

# Dynamic Versioning
get_version() {
    local fallback="27.3.B1"
    if [ -f "$PROPS_FILE" ]; then
        local v_main=$(grep 'MAIN=' "$PROPS_FILE" | cut -d'=' -f2)
        local v_minor=$(grep 'MINOR=' "$PROPS_FILE" | cut -d'=' -f2)
        local v_build=$(grep 'BUILD=' "$PROPS_FILE" | cut -d'=' -f2)
        echo "$v_main.$v_minor.B$v_build"
    else
        echo "$fallback"
    fi
}
VERSION=$(get_version)

# --- Helper Functions ---
clear_log() { rm -f "$LOG_FILE" && touch "$LOG_FILE"; }

cleanup() {
    local exit_code=$?
    if [ $exit_code -ne 0 ]; then
        echo -e "\n ${BOLD_RED}${ICON_FAIL}${NC} Installation interrupted (Exit code: $exit_code)"
        [ -f "$LOG_FILE" ] && echo -e " ${GRAY}${ICON_INFO}${NC} Check $LOG_FILE for details."
    fi
}
trap cleanup EXIT

run_silent() {
    local msg="$1"
    shift
    local cmd="$@"
    
    printf " ${CYAN}${ICON_LOAD}${NC} %s..." "$msg"
    
    # Start spinner in background
    (
        local i=0
        while true; do
            printf "\r   ${BLUE}${SPIN[$i]}${NC}  %s..." "$msg"
            i=$(( (i+1) % 10 ))
            sleep 0.1 2>/dev/null || true # Silence linker errors during upgrades
        done
    ) &
    local spin_pid=$!
    
    # Execute command in foreground
    # Use 'if' to capture status safely under 'set -e'
    local ret=0
    if eval "$cmd" >> "$LOG_FILE" 2>&1; then
        ret=0
    else
        ret=$?
    fi
    
    # Stop spinner
    { kill "$spin_pid"; wait "$spin_pid"; } 2>/dev/null || true
    
    # Clear line and print result
    printf "\r\033[2K"
    if [ $ret -eq 0 ]; then
        printf "\r ${BOLD_GREEN}${ICON_OK}${NC}  %-30s ${GREEN}successful${NC}\n" "$msg"
    else
        printf "\r ${BOLD_RED}${ICON_FAIL}${NC}  %-30s ${RED}failed (see log)${NC}\n" "$msg"
        return 1
    fi
}

show_header() {
    clear
    local sys_info="$(uname -s) $(uname -m)"
    if [ "$OS" == "termux" ]; then sys_info="Termux (Android)"; fi
    echo -e "${BOLD_CYAN}MAXTER${NC} ${DIM}Version $VERSION${NC}"
    echo -e "${GRAY}System: $sys_info${NC}"
    echo -e "${DIM}${DIV_THIN}${NC}"
    echo ""
}

detect_os() {
    if [ -d "/data/data/com.termux/files/usr" ] || [ -n "${TERMUX_VERSION:-}" ]; then
        OS="termux"
        # Use DEBIAN_FRONTEND=noninteractive and Dpkg options for full automation
        local common_opts="-y -o Dpkg::Options::=\"--force-confdef\" -o Dpkg::Options::=\"--force-confold\""
        INSTALL_CMD="DEBIAN_FRONTEND=noninteractive apt install $common_opts"
        UPDATE_CMD="DEBIAN_FRONTEND=noninteractive apt update -y && DEBIAN_FRONTEND=noninteractive apt upgrade $common_opts"
    elif [ -f "/etc/os-release" ]; then
        . /etc/os-release
        SUDO_CMD=""
        if command -v sudo >/dev/null 2>&1; then SUDO_CMD="sudo "; fi
        case "$ID" in
            debian|ubuntu|kali|pop|mint)
                OS="debian"
                INSTALL_CMD="${SUDO_CMD}DEBIAN_FRONTEND=noninteractive apt install -y -o Dpkg::Options::=\"--force-confdef\" -o Dpkg::Options::=\"--force-confold\""
                UPDATE_CMD="${SUDO_CMD}DEBIAN_FRONTEND=noninteractive apt update -y"
                ;;
            arch|manjaro)
                OS="arch"
                INSTALL_CMD="${SUDO_CMD}pacman -S --noconfirm"
                UPDATE_CMD="${SUDO_CMD}pacman -Syu --noconfirm"
                ;;
            fedora)
                OS="fedora"
                INSTALL_CMD="${SUDO_CMD}dnf install -y"
                UPDATE_CMD="${SUDO_CMD}dnf update -y"
                ;;
            *) OS="unknown" ;;
        esac
    else
        OS="unknown"
    fi
}

is_installed() {
    case "$1" in
        zsh) command -v zsh >/dev/null 2>&1 ;;
        omz) [ -d "$HOME/.oh-my-zsh" ] ;;
        p10k) [ -d "$ZSH_CUSTOM/themes/powerlevel10k" ] ;;
        syntax) [ -d "$ZSH_CUSTOM/plugins/zsh-syntax-highlighting" ] ;;
        autosugg) [ -d "$ZSH_CUSTOM/plugins/zsh-autosuggestions" ] ;;
        font) [ -f "$HOME/.termux/font.ttf" ] ;;
        *) return 1 ;;
    esac
}

# --- Main Flow ---
OS="unknown"
clear_log
detect_os
show_header

if [ "$OS" == "unknown" ]; then
    echo -e " ${BOLD_RED}${ICON_FAIL}${NC} Unsupported OS."
    exit 1
fi

echo -e " ${BOLD_BLUE}${ICON_INFO}${NC} Initializing installation environment..."
echo ""

# Tasks
run_silent "Updating system" "$UPDATE_CMD"

if [ "$OS" == "termux" ]; then
    run_silent "Installing core tools" "$INSTALL_CMD git zsh curl nodejs"
else
    run_silent "Installing core tools" "$INSTALL_CMD git zsh curl nodejs fontconfig"
fi

# Oh-My-Zsh
if is_installed omz; then
    printf " ${GRAY}${ICON_SKIP}${NC}  %-30s ${GRAY}already exists${NC}\n" "oh-my-zsh"
else
    run_silent "Installing oh-my-zsh" "CHSH=no RUNZSH=no sh -c \"\$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)\" \"\" --unattended"
fi

# Plugins
if is_installed p10k; then printf " ${GRAY}${ICON_SKIP}${NC}  %-30s ${GRAY}already exists${NC}\n" "powerlevel10k"; else
    run_silent "Installing powerlevel10k" "git clone --depth=1 https://github.com/romkatv/powerlevel10k.git $ZSH_CUSTOM/themes/powerlevel10k"; fi

if is_installed syntax; then printf " ${GRAY}${ICON_SKIP}${NC}  %-30s ${GRAY}already exists${NC}\n" "zsh-syntax"; else
    run_silent "Installing zsh-syntax" "git clone --depth=1 https://github.com/zsh-users/zsh-syntax-highlighting.git $ZSH_CUSTOM/plugins/zsh-syntax-highlighting"; fi

if is_installed autosugg; then printf " ${GRAY}${ICON_SKIP}${NC}  %-30s ${GRAY}already exists${NC}\n" "zsh-autosuggestions"; else
    run_silent "Installing zsh-autosuggestions" "git clone https://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions"; fi

# Clone/Sync Repo
if [ ! -d "$REPO_DIR" ]; then
    run_silent "Cloning MAXTER repo" "git clone -b Max $REPO_URL $REPO_DIR"
else
    run_silent "Syncing configurations" "cd $REPO_DIR && git fetch origin Max && git reset --hard origin/Max"
fi

# Apply
backup_configs() {
    [ -f "$HOME/.zshrc" ] && cp "$HOME/.zshrc" "$HOME/.zshrc.bak.$(date +%s)" || true
    [ -f "$HOME/.p10k.zsh" ] && cp "$HOME/.p10k.zsh" "$HOME/.p10k.zsh.bak.$(date +%s)" || true
}
run_silent "Backing up existing configs" "backup_configs"
run_silent "Applying Zsh configs" "cp -f $REPO_DIR/configs/zsh/.zshrc $HOME/.zshrc && cp -f $REPO_DIR/configs/zsh/.p10k.zsh $HOME/.p10k.zsh"

if [ "$OS" == "termux" ]; then
    run_silent "Applying Termux UI" "mkdir -p $HOME/.termux && cp -f $REPO_DIR/configs/termux/termux.properties $HOME/.termux/termux.properties && cp -f $REPO_DIR/configs/termux/colors.properties $HOME/.termux/colors.properties && cp -f $REPO_DIR/assets/font.ttf $HOME/.termux/font.ttf && termux-reload-settings"
fi

# Command setup
finalize() {
    chmod +x "$REPO_DIR/scripts/maxter_tui.sh"
    chmod +x "$REPO_DIR/scripts/uninstall.sh"
    if ! grep -q "alias maxter=" "$HOME/.zshrc"; then
        echo "alias maxter='bash $REPO_DIR/scripts/maxter_tui.sh'" >> "$HOME/.zshrc"
    fi
    # Only create symlink if NOT running via npm
    if [ -z "${npm_config_global:-}" ] && [ -z "${npm_lifecycle_event:-}" ]; then
        if [ -d "/data/data/com.termux/files/usr/bin" ]; then
            ln -sf "$REPO_DIR/scripts/maxter_tui.sh" "/data/data/com.termux/files/usr/bin/maxter"
        fi
    fi
}
run_silent "Finalizing Dashboard" "finalize"

# Shell
ZSH_PATH=$(command -v zsh)
if [ "$OS" == "termux" ]; then
    run_silent "Setting default shell" "chsh -s $ZSH_PATH"
else
    run_silent "Setting default shell" "sudo chsh -s $ZSH_PATH $(whoami)"
fi

echo ""
echo -e "${DIM}${DIV_THIN}${NC}"
echo -e " ${BOLD_GREEN}${ICON_DONE}${NC} ${BOLD_WHITE}MAXTER Installation Complete${NC}"
echo -e " ${GRAY}Type ${BOLD_CYAN}maxter${GRAY} to manage settings${NC}"
echo -e "${DIM}${DIV_THIN}${NC}"
echo ""

# Only restart shell if in an interactive TTY and not running via npm
if [[ -t 1 ]] && [ -z "${npm_lifecycle_event:-}" ]; then
    exec zsh -l
else
    echo -e " ${BOLD_BLUE}${ICON_INFO}${NC} Please restart your terminal or type ${BOLD_CYAN}zsh${NC} to apply changes."
fi
