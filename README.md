# Mythos Client

Mythos Client is the frontend user interface and dashboard for the **Mythos Autonomous AI Trading Factory**. It provides a sleek, institutional-grade portal to monitor real-time algorithmic trading strategies, view agent executions, and check active portfolio vaults.

## 🚀 Tech Stack

- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Utilities**: `clsx`, `tailwind-merge`

## 📁 Project Structure

The project strictly follows a feature-based atomic design architecture to ensure clean code and maximum reusability.

```
mythos-client/
├── src/
│   ├── app/                # Next.js App Router pages (Home, Dashboard, Docs)
│   ├── components/
│   │   ├── features/       # Complex, domain-specific components (e.g., AgentLogs, Hero)
│   │   ├── layout/         # Structural components (e.g., TopBar, LeftRail)
│   │   └── ui/             # Reusable atomic components (e.g., Button, Badge)
│   ├── data/               # Mock data and global configuration (mock.ts)
│   └── lib/                # Utility functions (e.g., Tailwind cn helper)
```

## 🛠️ Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and `npm` installed.

### Installation

1. Install all dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) with your browser to view the landing page.
4. Navigate to [http://localhost:3000/app](http://localhost:3000/app) to view the trading agent dashboard.

## 🎨 Design Philosophy

- **Glassmorphism & Glows**: Utilizing heavy `backdrop-blur`, subtle gradients, and glowing accents to create a premium, futuristic aesthetic.
- **Dynamic Micro-interactions**: `framer-motion` is used to build staggered entrance animations and 3D hover effects (wobble).
- **Responsive & Clean**: A robust responsive layout that easily adapts between desktop institutional dashboards and mobile viewing.

## 🔒 Roadmap (Upcoming)
- Supabase Integration: Replacing mock data with live database subscriptions.
- Web3 Wallet Connect: For direct smart-contract deposits into Mythos trading vaults.
- Real-time WebSocket feed from `mythos-trading-agent`.
