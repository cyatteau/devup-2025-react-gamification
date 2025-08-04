# React and the Art of Gamification

A guide to my Dev Up 2025 session and demo repository.

---

## Session Overview

Unlock the power of gamification in your React applications to create compelling, interactive user experiences. Explore React's versatile architecture and component-based approach, perfect for integrating game mechanics like scoring, achievements, and adaptive challenges. Drawing on principles from educational settings, discover the psychology behind gamification to enhance user engagement and retention. Along the way, see how tools like the React Compiler (currently in beta) can simplify building performant gamified features by optimizing components automatically. Join me to learn practical techniques and build a gamified app that keeps users coming back for more.

---

## Talk Details

- **Title:** React and the Art of Gamification  
- **Event:** Dev Up 2025  
- **Date & Time:** Thursday, August 7, 2025 • 9:45–10:45 am (UTC‑05:00)  
- **Session Format:** 1‑Hour Talk  
- **Level:** Intermediate  
- **Presenter:** Courtney Yatteau, Developer Advocate, Esri  
- **Contact:** courtney.yatteau@gmail.com  

**Slides:** [Link to Slides]([URL_TO_BE_ADDED](https://github.com/cyatteau/devup-2025-react-gamification/blob/main/Slides.pdf))

---

## Repository Contents

- `src/` – React app source code  
  - `components/` – Key UI components  
  - `hooks/` – Custom hooks (e.g., `useDemographicData.js`)  
  - `context/` – App context and providers  
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

## Configuration

Create a `.env` file in the project root:

```env
REACT_APP_ARCGIS_API_KEY=YOUR_ARCGIS_API_KEY
```

---

## Deployment

To publish the demo (e.g., GitHub Pages, Vercel, Netlify):

1. Build: `npm run build`  
2. Deploy the `build/` folder to your static host  
3. (Optional) Set `homepage` in `package.json` for GitHub Pages.
