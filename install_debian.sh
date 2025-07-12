#!/bin/bash

# MaxTer v25.2 — Debian Installer
# Author: Mahendra Mali - Max (https://mahendraplus.github.io)
# Location: 127.0.0.1

set -e  # Exit on any error

LOG_FILE="$HOME/maxter_install.log"
exec > >(tee -a "$LOG_FILE") 2>&1

echo "──────────────────────────────────────────────"
echo "   🌀 MaxTer v25.2 by Mahendra Mali - Max"
echo "   🌐 https://mahendraplus.github.io"
echo "   📁 Log File: $LOG_FILE"
echo "──────────────────────────────────────────────"
sleep 1

# 1. Install Required Packages
echo "[*] Updating packages..."
sudo apt update -y
echo "[*] Installing zsh, git, wget, curl..."
sudo apt install -y zsh git wget curl

# 2. Install Oh My Zsh
if [ ! -d "$HOME/.oh-my-zsh" ]; then
    echo "[*] Installing Oh My Zsh..."
    RUNZSH=no KEEP_ZSHRC=yes \
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
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
FONT_DIR="/usr/share/fonts/truetype/maxter"
echo "[*] Installing MesloLGS Nerd Fonts..."
sudo mkdir -p "$FONT_DIR"
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
    sudo cp "$fname" "$FONT_DIR/"
done

echo "[*] Updating font cache..."
sudo fc-cache -f -v

# 5. Download .p10k.zsh
echo "[*] Downloading MaxTer Powerlevel10k config..."
cd "$HOME"
wget -q -O .p10k.zsh "https://github.com/mahendraplus/MAXTER/raw/Max/maxterm.p10k.zsh"

# 6. Update .zshrc
ZSHRC="$HOME/.zshrc"
echo "[*] Configuring ~/.zshrc..."

if [ -f "$ZSHRC" ]; then
    cp "$ZSHRC" "$ZSHRC.bak"
    echo "   ↳ Backup created: $ZSHRC.bak"
fi

cat > "$ZSHRC" <<'EOF'
# MaxTer ZSH Configuration
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="powerlevel10k/powerlevel10k"
plugins=(git)

if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

source $ZSH/oh-my-zsh.sh
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
EOF

# 7. Finish & Launch ZSH
echo
echo "🎉 MaxTer v25.2 installed successfully!"
echo "📦 Oh My Zsh + Powerlevel10k is now configured."
echo "🌈 Fonts installed at: $FONT_DIR"
echo "🧠 Author: Mahendra Mali - Max (https://mahendraplus.github.io)"
echo "📄 You can now use your customized terminal by running: zsh"
echo

# Switch to Zsh
exec zsh
