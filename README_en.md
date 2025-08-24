# LnfMonitor Dashboard

<div align="center">

**Monitor CPU, memory, network, and processes in real time with a modern, simple dashboard.**

[![GitHub release](https://img.shields.io/github/v/release/AllonsoHenzo/Lnfmonitor_dashboard?include_prereleases&color=blue&label=release)](https://github.com/AllonsoHenzo/Lnfmonitor_dashboard/releases/tag/v0.1.0)
[![GitHub issues](https://img.shields.io/github/issues/AllonsoHenzo/Lnfmonitor_dashboard)](https://github.com/AllonsoHenzo/Lnfmonitor_dashboard/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Debian](https://img.shields.io/badge/Debian-Ubuntu-red?logo=debian)]()
[![Windows](https://img.shields.io/badge/Windows-Coming%20Soon-blue?logo=windows)]()

<p align="right">🌐 <a href="./README.md">Português (BR)</a> • <strong>English</strong></p>
</div>

---

## About

**LnfMonitor Dashboard** is a desktop app built with **Node.js + React** that provides a clear view of system resource usage:

- Real-time **CPU** usage  
- **RAM** consumption  
- **Network** monitoring (upload/download)  
- **Active processes** table  

Currently available as a **.deb** package for Debian/Ubuntu; **Windows** and other Linux distributions are coming soon.

---

## Installation

### Debian/Ubuntu
1. Download the latest release 👉 [**v0.1.0**](https://github.com/AllonsoHenzo/Lnfmonitor_dashboard/releases/tag/v0.1.0).
2. Install the `.deb` package:

```bash
sudo dpkg -i lnfmonitor-dashboard_0.1.0_amd64.deb
sudo apt-get install -f   # fix dependencies if needed
```

3. Run:

```bash
lnfmonitor
```

> Tested on **Debian 12/13** and **Ubuntu 22.04+** (derivatives should work as well).

---

## Preview

<div align="center">
  
![LnfMonitor_Screenshot](https://github.com/user-attachments/assets/4d9d7ff6-b5ca-474c-83c5-a2b2a86fc557)

</div>

---

## Stack

- **Frontend:** React + Vite + TailwindCSS  
- **Charts & UI:** Custom  
- **Backend:** Node.js

---

## Contributing

Contributions are very welcome!  
- Open an **issue** with bugs/ideas  
- Send a **PR** (especially for Windows/AppImage/RPM/Arch packaging)  

Quick guide:
1. Fork → branch → commit → PR
2. Clearly describe the change and how to test it

---

## License

This project is under the **MIT** license – see [LICENSE](./LICENSE).

---

<div align="center">

If you like this project, leave a ⭐ on the repo!  
Questions/ideas? Open an [issue](https://github.com/AllonsoHenzo/Lnfmonitor_dashboard/issues).

</div>
