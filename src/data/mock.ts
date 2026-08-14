export const MOCK_AGENT_LOGS = [
  { id: 1, pair: "SOL/USDT", side: "BUY", price: "142.50", amount: "5.0", time: "2 mins ago", status: "filled", pnl: null },
  { id: 2, pair: "BTC/USDT", side: "SELL", price: "64,210.00", amount: "0.1", time: "15 mins ago", status: "filled", pnl: "+$124.50" },
  { id: 3, pair: "ETH/USDT", side: "BUY", price: "3,450.25", amount: "2.5", time: "1 hour ago", status: "filled", pnl: null },
  { id: 4, pair: "SOL/USDT", side: "SELL", price: "138.20", amount: "10.0", time: "3 hours ago", status: "filled", pnl: "-$12.00" },
];

export const MOCK_METRICS = {
  totalBalance: 42590.84,
  performance30d: 14.2, // percentage
  activeStrategies: { current: 3, total: 5 },
  winRate: 68.4, // percentage
  maxDrawdown: 4.1, // percentage
};

export const SITE_CONFIG = {
  name: "mythos.",
  version: "v0.1.0",
  status: "Healthy",
  navLinks: {
    main: [
      { label: "Dashboard", href: "/app" },
      { label: "Strategy", href: "/app/strategies" },
      { label: "Agents", href: "/app/agents" },
    ],
    socials: [
      { label: "Twitter", href: "#" },
      { label: "GitHub", href: "https://github.com/mythos" },
      { label: "Docs", href: "/docs" },
    ]
  },
  sidebar: [
    {
      group: "Core",
      items: [
        { label: "Dashboard", href: "/app", icon: "Activity" },
        { label: "Portfolio", href: "#", icon: "Briefcase" },
        { label: "Strategies", href: "/app/strategies", icon: "Command" },
        { label: "Agents", href: "/app/agents", icon: "Settings" },
      ]
    },
    {
      group: "System",
      items: [
        { label: "Settings", href: "#", icon: "Settings" },
      ]
    }
  ]
};
