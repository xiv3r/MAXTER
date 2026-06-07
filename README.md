# MAXTER - Ultimate Zsh & Termux Setup Tool

**MAXTER** is a high-performance, one-command terminal setup tool designed for **Termux**, **Kali Linux**, **Ubuntu**, **Debian**, **Arch**, and **Fedora**. It automatically installs and configures **Zsh**, **Oh-My-Zsh**, the **Powerlevel10k** theme, and **Nerd Fonts** with zero manual prompts.

[![Maxter Logo](assets/logo.png)](https://mahendraplus.github.io/MAXTER/)

## ✨ Key Features

- **One-Command Setup**: A silent, non-interactive installer for a frictionless experience.
- **Maxter TUI Dashboard**: Type `maxter` to manage settings and bootstrap **React** or **Vue** workflows via Vite.
- **Optimized for Termux**: Custom extra-keys and color schemes tailored for mobile productivity.
- **Industrial Aesthetic**: Powered by Powerlevel10k with sharp, professional configurations.
- **Smart OS Detection**: Automatically applies system-specific patches for all major Linux distributions.

## 🚀 Instant Installation

Run the following command in your terminal to set up MAXTER instantly:

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/mahendraplus/MAXTER/Max/install.sh)
```

## 📂 Project Structure

```text
MAXTER/
├── .github/         # Automated build & deploy workflows
├── assets/          # High-fidelity branding & fonts
├── configs/         # Production-ready Zsh & Termux templates
├── docs-src/        # React + Vite documentation source
├── docs/            # Static production website (GitHub Pages)
├── scripts/         # TUI Dashboard & Uninstaller logic
├── setup.sh         # Universal installer engine
└── install.sh       # Fast-install remote entry point
```

## 🌐 Documentation Stack

The MAXTER documentation is a high-performance web app built with:
- **React 19** & **Vite 6**
- **TailwindCSS 4** (Industrial Theme)
- **Framer Motion** (Smooth Animations)
- **GitHub Actions** (Automated Deployment)

Explore the live site: [mahendraplus.github.io/MAXTER/](https://mahendraplus.github.io/MAXTER/)

## 🛠️ Configuration

### Termux Extra Keys
Default layout optimized for one-hand mobile coding:
- **Row 1**: ESC, DRAWER, SHIFT, HOME, UP, END, PGUP
- **Row 2**: TAB, CTRL, ALT, LEFT, DOWN, RIGHT, PGDN

### Settings Dashboard
Simply type `maxter` in your terminal to open the interactive settings menu.

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for full details.

---
Created with ❤️ by [Mahendra Mali](https://github.com/mahendraplus)
