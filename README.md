# LnfMonitor Dashboard

<div align="center">

**Monitore CPU, memória, rede e processos em tempo real com um dashboard moderno e simples.**

[![GitHub release](https://img.shields.io/github/v/release/AllonsoHenzo/Lnfmonitor_dashboard?include_prereleases&color=blue&label=release)](https://github.com/AllonsoHenzo/Lnfmonitor_dashboard/releases/tag/v0.1.0)
[![GitHub issues](https://img.shields.io/github/issues/AllonsoHenzo/Lnfmonitor_dashboard)](https://github.com/AllonsoHenzo/Lnfmonitor_dashboard/issues)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![Debian](https://img.shields.io/badge/Debian-Ubuntu-red?logo=debian)]()
[![Windows](https://img.shields.io/badge/Windows-Coming%20Soon-blue?logo=windows)]()

</div>

---

## Sobre o projeto

O **LnfMonitor Dashboard** é uma aplicação desktop feita em **Node.js + React** que fornece uma visão clara do uso de recursos do sistema:

-  Uso da **CPU** em tempo real  
-  Consumo de **memória RAM**  
-  Monitoramento de **rede (upload/download)**  
-  Tabela de **processos ativos**  

Atualmente disponível como pacote **.deb** para Debian/Ubuntu, mas em breve também terá suporte para **Windows** e outras distribuições Linux.

---

## Instalação

### Debian/Ubuntu
1. Baixe o último release 👉 [**v0.1.0**](https://github.com/AllonsoHenzo/Lnfmonitor_dashboard/releases/tag/v0.1.0).
2. Instale o pacote `.deb`:

```bash
sudo dpkg -i lnfmonitor-dashboard_0.1.0_amd64.deb
sudo apt-get install -f   # corrige dependências, se necessário
```

3. Execute:

```bash
lnfmonitor
```

> Testado no **Debian 12/13** e **Ubuntu 22.04+** (derivados devem funcionar também).

---

## Preview

<div align="center">
  
![LnfMonitor_Screenshot](https://github.com/user-attachments/assets/4d9d7ff6-b5ca-474c-83c5-a2b2a86fc557)

</div>

---

## Stack

- **Frontend:** React + Vite + TailwindCSS  
- **Gráficos & UI:** Customizado 
- **Backend:** Node.js

---

## Contribuindo

Contribuições são super bem-vindas!  
- Abra uma **issue** com bugs/ideias  
- Envie um **PR** (especialmente para empacotamento Windows/AppImage/RPM/Arch)  

Guia rápido:
1. Fork → branch → commit → PR
2. Descreva claramente a mudança e como testar

---

## Licença

Este projeto está sob a licença **MIT** – veja [LICENSE](./LICENSE).

---

<div align="center">



Se curtiu o projeto, deixe uma ⭐ no repositório!  
Dúvidas/ideias? Abra uma [issue](https://github.com/AllonsoHenzo/Lnfmonitor_dashboard/issues).

</div>
