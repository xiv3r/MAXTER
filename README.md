# 🚀 MAXTER - Ultimate Zsh & Termux Configuration

MAXTER is a high-performance, visually stunning, and highly organized configuration for Zsh and Termux. It brings a modern development environment to your mobile and desktop terminals with Powerlevel10k, syntax highlighting, and auto-suggestions.

![Maxter Logo](assets/logo.png)

## ✨ Features

- **Powerlevel10k Integration**: A fast and flexible Zsh theme.
- **Syntax Highlighting**: Real-time code highlighting for Zsh.
- **Auto-Suggestions**: Fish-like suggestions for your shell commands.
- **Optimized Termux Settings**: Custom extra-keys, fonts, and colors for Termux.
- **Cross-Platform Support**: Works on Termux, Debian, Ubuntu, and Arch Linux.
- **Well-Organized Structure**: Clean directory layout for easy customization.

## 📂 Project Structure

```text
MAXTER/
├── assets/          # Fonts, logos, and images
├── configs/         # Configuration templates
│   ├── termux/      # Termux properties and colors
│   └── zsh/         # .zshrc and .p10k.zsh templates
├── docs/            # Next.js Documentation (React, Tailwind, Framer Motion)
├── scripts/         # Supplemental setup scripts
├── setup.sh         # Main installation entry point
└── install.sh       # Symlink to setup.sh
```

## 🚀 Installation

### 1. Fast Install (Recommended)

Run the following command to install MAXTER instantly on your system:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/mahendraplus/MAXTER/main/install.sh)
```

## 🌐 Documentation Stack

The new MAXTER documentation is built with:
- **Next.js**: SSR + Fast Page Loading
- **TailwindCSS**: Modern Styling
- **Framer Motion**: Smooth Animations
- **React Icons**: Premium Iconography
- **Vercel**: Optimized Hosting

### 2. Manual Install

If you prefer to clone the repository first:

```bash
git clone https://github.com/mahendraplus/MAXTER.git
cd MAXTER
chmod +x install.sh
./install.sh
```

## 🛠️ Configuration

### Extra Keys (Termux)
The default extra keys are optimized for mobile productivity:
- **Row 1**: ESC, DRAWER, SHIFT, HOME, UP, END, PGUP
- **Row 2**: TAB, CTRL, ALT, LEFT, DOWN, RIGHT, PGDN

You can modify these in `configs/termux/termux.properties`.

### Customizing Zsh
Edit `~/.zshrc` for your aliases and environment variables. The Powerlevel10k theme can be reconfigured using `p10k configure`.

## 🤝 Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to improve the project.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---
Created with ❤️ by [Mahendra](https://github.com/mahendraplus)
