#!/bin/bash
# MAXTER // Version 27.2.B1
# Color Theme Definitions

# Format: "name:background;foreground;cursor"
# Note: On non-Termux systems, these can be used as a reference or applied via Xresources/OSC sequences.

declare -A THEMES
THEMES["Matrix"]="background:#000000;foreground:#00ff00;cursor:#00ff00"
THEMES["Dracula"]="background:#282a36;foreground:#f8f8f2;cursor:#6272a4"
THEMES["Nord"]="background:#2e3440;foreground:#d8dee9;cursor:#88c0d0"
THEMES["Monokai"]="background:#272822;foreground:#f8f8f2;cursor:#f8f8f2"
THEMES["Gruvbox Dark"]="background:#282828;foreground:#ebdbb2;cursor:#ebdbb2"
THEMES["Tokyo Night"]="background:#1a1b26;foreground:#a9b1d6;cursor:#c0caf5"
THEMES["Catppuccin"]="background:#1e1e2e;foreground:#cdd6f4;cursor:#f5e0dc"
THEMES["One Dark"]="background:#282c34;foreground:#abb2bf;cursor:#528bff"
THEMES["Solarized Dark"]="background:#002b36;foreground:#839496;cursor:#93a1a1"
THEMES["Cyberpunk"]="background:#000b1e;foreground:#00ff9f;cursor:#ff003c"
THEMES["Solarized Light"]="background:#fdf6e3;foreground:#657b83;cursor:#586e75"
THEMES["Catppuccin Latte"]="background:#eff1f5;foreground:#4c4f69;cursor:#dc8a78"
THEMES["GitHub Light"]="background:#ffffff;foreground:#24292e;cursor:#0366d6"
THEMES["Rose"]="background:#1a141a;foreground:#f58ab2;cursor:#f58ab2"
THEMES["Ocean"]="background:#0f111a;foreground:#46bdff;cursor:#46bdff"
THEMES["Industrial"]="background:#0a0a0a;foreground:#39ff14;cursor:#39ff14"
THEMES["Sunset"]="background:#1a0f0f;foreground:#ff9e64;cursor:#ff9e64"
THEMES["Forest"]="background:#0f1a0f;foreground:#7eb336;cursor:#7eb336"
THEMES["Candy"]="background:#0f050f;foreground:#ff00ff;cursor:#00ffff"
THEMES["Midnight"]="background:#00000c;foreground:#c0c0c0;cursor:#ffffff"

export THEMES
