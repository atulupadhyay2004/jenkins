# 🚀 Full CI/CD Pipeline with Jenkins & Docker

[![GitHub repo size](https://img.shields.io/github/repo-size/atulupadhyay2004/jenkins)](https://github.com/atulupadhyay2004/jenkins)
[![GitHub stars](https://img.shields.io/github/stars/atulupadhyay2004/jenkins?style=social)](https://github.com/atulupadhyay2004/jenkins/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/atulupadhyay2004/jenkins?style=social)](https://github.com/atulupadhyay2004/jenkins/forks)

> A complete CI/CD pipeline that automates building, testing, containerizing, and deploying a Node.js application using Jenkins, Docker, and Git.

---

## 📋 Table of Contents
- [About The Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [CI/CD Workflow](#-cicd-workflow)
- [Pipeline Stages](#-pipeline-stages)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Jenkins Setup](#jenkins-setup)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [License](#-license)
- [Contact](#-contact)

---

## 📖 About The Project

This project demonstrates a **production-grade CI/CD pipeline** for a Node.js application (a To-Do list app). The pipeline automates the entire software delivery lifecycle:

- **Code is pulled** from GitHub
- **Dependencies are installed**
- **Tests are executed**
- **A Docker image** is built and tagged
- **The image is pushed** to Docker Hub
- **The application is deployed** to a server
- **Health checks and smoke tests** validate the deployment

This setup ensures that every code change is automatically built, tested, and deployed, following DevOps best practices.

---

## ✨ Features

- ✅ **Automated Build** – Triggered on every code push
- ✅ **Unit Testing** – Runs `npm test` to catch regressions
- ✅ **Docker Containerization** – Packages the app into a lightweight container
- ✅ **Image Registry** – Pushes images to Docker Hub with version tags
- ✅ **Zero-Downtime Deployment** – Stops the old container and runs the new one
- ✅ **Health Checks** – Verifies the app is running correctly post-deployment
- ✅ **Smoke Tests** – Validates critical endpoints
- ✅ **Git Tagging** – Automatically tags the repository with build numbers

---

## 🛠 Tech Stack

| Category | Technology |
|----------|------------|
| **Application** | Node.js (Alpine Linux) |
| **CI/CD Server** | Jenkins (Declarative Pipeline) |
| **Containerization** | Docker |
| **Registry** | Docker Hub |
| **Version Control** | Git / GitHub |
| **Testing** | npm test (Jest/Mocha) |

---

## 🧠 System Architecture

Below is the high-level architecture of the CI/CD pipeline:
┌─────────────────────────────────────────────────────────────────────────────┐
│ DEVELOPER WORKSTATION │
│ │
│ ┌─────────┐ git push ┌─────────────────┐ │
│ │ Code │ ─────────────▶ │ GitHub Repo │ │
│ │ Editor │ │ (atulupadhyay2004/jenkins)│ │
│ └─────────┘ └────────┬────────┘ │
│ │ │
└─────────────────────────────────────────┼─────────────────────────────────┘
│
▼ (Webhook Trigger)
┌─────────────────────────────────────────────────────────────────────────────┐
│ JENKINS CI/CD SERVER │
│ │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ Declarative Pipeline │ │
│ │ │ │
│ │ ┌──────────┐ ┌──────────┐ ┌──────────────┐ │ │
│ │ │Checkout │───▶│ Install │───▶│ Test │ │ │
│ │ │(Git Pull)│ │(npm i) │ │ (npm test) │ │ │
│ │ └──────────┘ └──────────┘ └──────┬───────┘ │ │
│ │ │ │ │
│ │ ▼ │ │
│ │ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │ │
│ │ │ Deploy │◀───│ Push Docker │◀───│ Build Docker│ │ │
│ │ │(docker run) │ │ Image to Hub │ │ Image │ │ │
│ │ └──────┬───────┘ └──────────────┘ └──────────────┘ │ │
│ │ │ │ │
│ │ ▼ │ │
│ │ ┌──────────────┐ ┌──────────────┐ │ │
│ │ │ Health Check │───▶│ Smoke Test │ │ │
│ │ │ (curl /health)│ │ (curl /) │ │ │
│ │ └──────────────┘ └──────────────┘ │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│ │
└─────────────────────────────────────────────────────────────────────────────┘
│
▼ (Deployed Container)
┌─────────────────────────────────────────────────────────────────────────────┐
│ DEPLOYMENT SERVER │
│ │
│ ┌──────────────────────────────────────────────────────────────────┐ │
│ │ Docker Container │ │
│ │ │ │
│ │ ┌─────────────────────────────────────────────────────┐ │ │
│ │ │ Node.js App (Port 3000) │ │ │
│ │ │ (todo-cicd container) │ │ │
│ │ └─────────────────────────────────────────────────────┘ │ │
│ │ │ │
│ └──────────────────────────────────────────────────────────────────┘ │
│ │
└─────────────────────────────────────────────────────────────────────────────┘

---

## 🔄 CI/CD Workflow

This diagram illustrates the end-to-end flow from code commit to deployment:

```mermaid
flowchart TD
    A[Developer pushes code to GitHub] --> B[GitHub Webhook triggers Jenkins]
    B --> C[Jenkins Pipeline Starts]
    C --> D[Stage 1: Checkout - Pull latest code]
    D --> E[Stage 2: Install - Run npm install]
    E --> F[Stage 3: Test - Run npm test]
    F --> G{Tests Pass?}
    G -->|No| H[Pipeline Fails - Notify Developer]
    G -->|Yes| I[Stage 4: Build Docker Image]
    I --> J[Stage 5: Push Image to Docker Hub]
    J --> K[Stage 6: Deploy - Stop old container, run new one]
    K --> L[Stage 7: Health Check - Verify /health endpoint]
    L --> M{Health Check Pass?}
    M -->|No| N[Pipeline Fails - Rollback?]
    M -->|Yes| O[Stage 8: Smoke Test - Verify / and /health]
    O --> P{Smoke Test Pass?}
    P -->|No| Q[Pipeline Fails]
    P -->|Yes| R[Stage 9: Version Tag - Git tag v{BUILD_NUMBER}]
    R --> S[Pipeline Success - App is Live]
    S --> T[Send Success Notification]
    H --> U[Send Failure Notification]
    N --> U
    Q --> U
