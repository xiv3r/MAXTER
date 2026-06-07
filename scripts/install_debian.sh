#!/bin/bash

# MaxTer v26.0 — Debian/Ubuntu Installer (Specialized)
# Author: Mahendra Mali (https://github.com/mahendraplus)

set -e  # Exit on any error

LOG_FILE="$HOME/maxter_install.log"
exec > >(tee -a "$LOG_FILE") 2>&1

echo "──────────────────────────────────────────────"
echo "   🌀 MaxTer v26.0 by Mahendra Mali"
echo "   🌐 https://github.com/mahendraplus/MAXTER"
echo "   📁 Log File: $LOG_FILE"
echo "──────────────────────────────────────────────"
sleep 1

# 1. Install Required Packages
echo "[*] Updating packages..."
sudo apt update -y
echo "[*] Installing zsh, git, wget, curl..."
sudo apt install -y zsh git wget curl fontconfig

# 2. Install Oh My Zsh
if [ ! -d "$HOME/.oh-my-zsh" ]; then
    echo "[*] Installing Oh My Zsh..."
    RUNZSH=no KEEP_ZSHRC=yes \
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
else
    echo "[✔] Oh My Zsh already installed. Skipping..."
fi

# 3. Install Powerlevel10k Theme
THEME_DIR="${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"
if [ ! -d "$THEME_DIR" ]; then
    echo "[*] Installing Powerlevel10k theme..."
    git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "$THEME_DIR"
else
    echo "[✔] Powerlevel10k already installed. Skipping..."
fi

# 4. Install Fonts (MesloLGS NF)
FONT_DIR="$HOME/.local/share/fonts/maxter"
echo "[*] Installing MesloLGS Nerd Fonts..."
mkdir -p "$FONT_DIR"
cd /tmp

FONT_URLS=(
  "https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Regular.ttf"
  "https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold.ttf"
  "https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Italic.ttf"
  "https://github.com/romkatv/powerlevel10k-media/raw/master/MesloLGS%20NF%20Bold%20Italic.ttf"
)

for url in "${FONT_URLS[@]}"; do
    fname=$(basename "$url")
    echo "   ↳ Downloading: $fname"
    wget -q "$url" -O "$fname"
    cp "$fname" "$FONT_DIR/"
done

echo "[*] Updating font cache..."
fc-cache -f -v

# 5. Download MAXTER Configs
echo "[*] Downloading MaxTer Configuration..."
cd "$HOME"
wget -q -O .p10k.zsh "https://raw.githubusercontent.com/mahendraplus/MAXTER/main/configs/zsh/.p10k.zsh"
wget -q -O .zshrc "https://raw.githubusercontent.com/mahendraplus/MAXTER/main/configs/zsh/.zshrc"

# 6. Install Plugins
ZSH_CUSTOM="${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}"
if [ ! -d "$HOME/.zsh-syntax-highlighting" ]; then
    git clone --depth=1 https://github.com/zsh-users/zsh-syntax-highlighting.git "$HOME/.zsh-syntax-highlighting"
fi
if [ ! -d "$ZSH_CUSTOM/plugins/zsh-autosuggestions" ]; then
    git clone https://github.com/zsh-users/zsh-autosuggestions "$ZSH_CUSTOM/plugins/zsh-autosuggestions"
fi

# Safety: Ensure syntax highlighting is sourced
if ! grep -q "zsh-syntax-highlighting.zsh" "$HOME/.zshrc"; then
    echo "source $HOME/.zsh-syntax-highlighting/zsh-syntax-highlighting.zsh" >> "$HOME/.zshrc"
fi

# 7. Set Default Shell
echo "[*] Changing default shell to Zsh..."
sudo chsh -s "$(which zsh)" $(whoami)

# 8. Finish & Launch ZSH
echo
echo "🎉 MaxTer v26.0 installed successfully!"
echo "📦 Oh My Zsh + Powerlevel10k is now configured."
echo "🌈 Fonts installed at: $FONT_DIR"
echo "🧠 Author: Mahendra Mali (https://github.com/mahendraplus)"
echo "📄 You can now use your customized terminal by running: zsh"
echo

exec zsh -l
