# React and the Art of Gamification

A guide to my Dev Up 2025 session repository.

---

## Session Overview

Unlock the power of gamification in your React applications to create compelling, interactive user experiences. Explore React's versatile architecture and component-based approach, perfect for integrating game mechanics like scoring, achievements, and adaptive challenges. Drawing on principles from educational settings, discover the psychology behind gamification to enhance user engagement and retention. Along the way, see how tools like the React Compiler (currently in beta) can simplify building performant gamified features by optimizing components automatically. Join me to learn practical techniques and build a gamified app that keeps users coming back for more.

---

## Talk Details

- **Title:** React and the Art of Gamification  
- **Event:** Dev Up 2025  
- **Date & Time:** Thursday, August 7, 2025 • 9:45–10:45 am (UTC‑05:00)  
- **Level:** Intermediate  
- **Presenter:** Courtney Yatteau, Developer Advocate, Esri  
- **Contact:** courtney.yatteau@gmail.com  

**Slides:** [Link to Slides](https://github.com/cyatteau/devup-2025-react-gamification/blob/main/Slides.pdf)

---

## Repository Contents

- `src/` – React app source code  
  - `components/` – Key UI components  
  - `hooks/` – Custom hooks (e.g., `useDemographicData.js`)  
  - `utils/`
- `README.md` – This file  

---

## Demo Features

This live demo app illustrates core concepts from the talk:

1. **Location‑Based Quests** – Track your location to unlock nearby challenges.  
2. **XP & Achievements** – Earn points, badges, and streak rewards.  
4. **Performance Optimizations** – `useMemo`, `React.memo`, and React Compiler examples.

---

## Getting Started

### Prerequisites

- Node.js v16+  
- npm or yarn  
- (Optional) ArcGIS API key

### Installation

```bash
git clone https://github.com/<your-username>/devup-2025-react-gamification.git
cd devup-2025-react-gamification
npm install
```

### Running Locally

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Configuration

Create a `.env` file in the project root:

```env
REACT_APP_ARCGIS_API_KEY=YOUR_ARCGIS_API_KEY
```


---
## 💥 Meme App Demo

A quick, live “Draw-to-Meme Battle”:

- **Draw** on canvas → **AI** generates 2 witty captions  
- **Confetti** & XP icons celebrate your pick  
- **Submit** once, then **vote** (max 3 votes) on the live Meme Wall  

### Quick Start

> Download the exact demo build: see Releases › [meme-app.zip](https://github.com/cyatteau/devup-2025-react-gamification/blob/main/meme-app.zip)

```bash
cp .env.local.example .env.local   # add your Firebase config & API keys
```
---

