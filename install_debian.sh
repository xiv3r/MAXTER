#!/bin/bash

echo "[*] Maxter by https://mahendraplus.github.io"
LOG_FILE="$HOME/maxter_install.log"
exec > >(tee -a "$LOG_FILE") 2>&1

set -e  # Exit on any error

# 1. Install Dependencies
echo "[*] Installing required packages..."
sudo apt update
sudo apt install -y zsh git wget curl

# 2. Install Oh My Zsh
if [ ! -d "$HOME/.oh-my-zsh" ]; then
    echo "[*] Installing Oh My Zsh..."
    RUNZSH=no KEEP_ZSHRC=yes \
    sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
else
    echo "[*] Oh My Zsh already installed. Skipping..."
fi

# 3. Install Powerlevel10k
echo "[*] Installing Powerlevel10k theme..."
THEME_DIR="${ZSH_CUSTOM:-$HOME/.oh-my-zsh/custom}/themes/powerlevel10k"
if [ ! -d "$THEME_DIR" ]; then
    git clone --depth=1 https://github.com/romkatv/powerlevel10k.git "$THEME_DIR"
else
    echo "[*] Powerlevel10k already installed. Skipping..."
fi

# 4. Install Fonts
echo "[*] Installing MesloLGS Nerd Fonts..."
FONT_DIR="/usr/share/fonts/truetype/maxter"
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
    wget -q "$url" -O "$fname"
    sudo cp "$fname" "$FONT_DIR/"
done

echo "[*] Updating font cache..."
sudo fc-cache -f -v

# 5. Download .p10k.zsh
echo "[*] Downloading Maxter Powerlevel10k config..."
cd "$HOME"
wget -q -O .p10k.zsh "https://github.com/mahendraplus/MAXTER/raw/Max/maxterm.p10k.zsh"

# 6. Update .zshrc
echo "[*] Configuring ~/.zshrc..."
ZSHRC="$HOME/.zshrc"

cat > "$ZSHRC" <<'EOF'
# Maxter ZSH Configuration
export ZSH="$HOME/.oh-my-zsh"
ZSH_THEME="powerlevel10k/powerlevel10k"
plugins=(git)

if [[ -r "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh" ]]; then
  source "${XDG_CACHE_HOME:-$HOME/.cache}/p10k-instant-prompt-${(%):-%n}.zsh"
fi

source $ZSH/oh-my-zsh.sh
[[ ! -f ~/.p10k.zsh ]] || source ~/.p10k.zsh
EOF

# 7. Start ZSH
echo "[*] Switching to Zsh..."
exec zsh -i <<'EOF'
echo
echo "[✓] Maxter installed successfully!"
echo "[*] Maxter by https://mahendraplus.github.io"
EOF
