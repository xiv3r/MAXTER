#!/bin/bash

# ==========================================
# MAXTER ULTIMATE INSTALLER (Universal)
# ==========================================
# Version: 26.0
# Author: Mahendra Mali
# Support: Termux, Debian, Ubuntu, Arch, Fedora

set -e

# --- 1. Colors & UI ---
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

ICON_LOAD="[•.•]"
ICON_OK="[✓]"
ICON_FAIL="[×]"

# --- 2. Variables ---
MAXTER_REPO="https://github.com/mahendraplus/MAXTER"
ZSH_CUSTOM="${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}"

# --- 3. Helper Functions ---
msg_load() { echo -e "${BLUE}${ICON_LOAD} ${NC}$1..."; }
msg_ok() { echo -e "${GREEN}${ICON_OK} ${NC}$1"; }
msg_fail() { echo -e "${RED}${ICON_FAIL} ${NC}$1"; exit 1; }

run_task() {
    local task_name="$1"
    shift
    echo -ne "${BLUE}${ICON_LOAD} ${NC}${task_name}...\r"
    if eval "$@" > /dev/null 2>&1; then
        echo -ne "\033[2K\r"
        msg_ok "$task_name"
    else
        echo -ne "\033[2K\r"
        msg_fail "$task_name"
    fi
}

# --- 4. OS Detection ---
msg_load "Detecting System"
if [ -d "/data/data/com.termux/files/usr" ]; then
    OS="Termux"
    PKG_MAN="pkg"
    INSTALL_CMD="pkg install -y"
    UPDATE_CMD="pkg update -y && pkg upgrade -y"
elif [ -f "/etc/debian_version" ]; then
    OS="Debian"
    PKG_MAN="apt"
    INSTALL_CMD="sudo apt install -y"
    UPDATE_CMD="sudo apt update && sudo apt upgrade -y"
elif [ -f "/etc/arch-release" ]; then
    OS="Arch"
    PKG_MAN="pacman"
    INSTALL_CMD="sudo pacman -S --noconfirm"
    UPDATE_CMD="sudo pacman -Syu --noconfirm"
else
    msg_fail "Unsupported OS"
fi
msg_ok "System: $OS"

# --- 5. Install Dependencies ---
run_task "Updating System" "$UPDATE_CMD"
run_task "Installing Core Tools (git, zsh, curl, nodejs)" "$INSTALL_CMD git zsh curl wget nodejs fontconfig"

# Install Framework CLI for React/Vue
if [[ "$OS" != "Termux" ]]; then
    run_task "Installing Dev Tools (npm, yarn)" "$INSTALL_CMD npm && sudo npm install -g yarn"
fi

# --- 6. Install ZSH & Plugins ---
if [ ! -d "$HOME/.oh-my-zsh" ]; then
    run_task "Installing Oh-My-Zsh" "sh -c \"\$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)\" \"\" --unattended"
fi

# Plugins & Theme
[ ! -d "$ZSH_CUSTOM/themes/powerlevel10k" ] && run_task "Installing P10K" "git clone --depth=1 https://github.com/romkatv/powerlevel10k.git $ZSH_CUSTOM/themes/powerlevel10k"
[ ! -d "$HOME/.zsh-syntax-highlighting" ] && run_task "Installing Syntax Highlighting" "git clone --depth=1 https://github.com/zsh-users/zsh-syntax-highlighting.git $HOME/.zsh-syntax-highlighting"
[ ! -d "$ZSH_CUSTOM/plugins/zsh-autosuggestions" ] && run_task "Installing Autosuggestions" "git clone https://github.com/zsh-users/zsh-autosuggestions $ZSH_CUSTOM/plugins/zsh-autosuggestions"

# --- 7. Apply MAXTER Configuration ---
REPO_DIR="$HOME/MAXTER"
if [ ! -d "$REPO_DIR" ]; then
    run_task "Cloning MAXTER" "git clone $MAXTER_REPO $REPO_DIR"
fi

msg_load "Applying Configs"
cp -f "$REPO_DIR/configs/zsh/.zshrc" "$HOME/.zshrc"
cp -f "$REPO_DIR/configs/zsh/.p10k.zsh" "$HOME/.p10k.zsh"

if [ "$OS" == "Termux" ]; then
    mkdir -p "$HOME/.termux"
    cp -f "$REPO_DIR/configs/termux/termux.properties" "$HOME/.termux/termux.properties"
    cp -f "$REPO_DIR/configs/termux/colors.properties" "$HOME/.termux/colors.properties"
    cp -f "$REPO_DIR/assets/font.ttf" "$HOME/.termux/font.ttf"
    termux-reload-settings
fi

# --- 8. Create 'maxter' command ---
msg_load "Setting up Maxter Settings Dashboard"
cat > "$REPO_DIR/scripts/maxter_tui.sh" <<'EOF'
#!/bin/bash
# MAXTER Settings TUI
while true; do
    clear
    echo -e "\033[1;36m"
    echo "  __  __   _   __  __ _____ _____ ____  "
    echo " |  \/  | /_\  \ \/ /|_   _| ____|  _ \ "
    echo " | |\/| |/ _ \  \  /   | | |  _| | |_) |"
    echo " | |  | / ___ \ /  \   | | | |___|  _ < "
    echo " |_|  |_/_/   \_/_/\_\  |_| |_____|_| \_\\"
    echo -e "\033[0m"
    echo -e " \033[1;33m--- Ultimate Settings Dashboard ---\033[0m"
    echo ""
    echo -e " [1] Edit .zshrc         [2] Edit .p10k.zsh"
    echo -e " [3] Termux Keys         [4] UI Colors"
    echo -e " [5] React Workflow      [6] Vue Workflow"
    echo -e " [7] Update Maxter       [0] Exit"
    echo ""
    read -p " Select Option: " opt
    case $opt in
        1) nano ~/.zshrc ;;
        2) nano ~/.p10k.zsh ;;
        3) nano ~/.termux/termux.properties && termux-reload-settings ;;
        4) nano ~/.termux/colors.properties && termux-reload-settings ;;
        5) echo "Launching React Dev Environment..."; npx create-react-app my-app && cd my-app && npm start ;;
        6) echo "Launching Vue Dev Environment..."; npm init vue@latest ;;
        7) cd ~/MAXTER && git pull && ./install.sh ;;
        0) break ;;
        *) echo "Invalid option." ; sleep 1 ;;
    esac
done
EOF
chmod +x "$REPO_DIR/scripts/maxter_tui.sh"

# Add alias to .zshrc
if ! grep -q "alias maxter=" "$HOME/.zshrc"; then
    echo "alias maxter='$REPO_DIR/scripts/maxter_tui.sh'" >> "$HOME/.zshrc"
fi

msg_ok "Maxter Command Ready"

# --- 9. Finalize ---
msg_load "Setting ZSH as Default"
if [ "$OS" == "Termux" ]; then
    chsh -s zsh
else
    sudo chsh -s "$(which zsh)" "$(whoami)"
fi

echo -e "\n${GREEN}=======================================${NC}"
echo -e "${GREEN}   MAXTER INSTALLED SUCCESSFULLY!      ${NC}"
echo -e "${GREEN}=======================================${NC}"
echo -e "Type ${CYAN}maxter${NC} anytime to open the settings dashboard."
echo ""
exec zsh -l
