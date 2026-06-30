import { Href } from "expo-router";

export type NavItem = {
  label: string;
  href: Href;
  icon: string;
};

export const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: "pulse-outline" },
  { label: "GitHub Repositories", href: "/repositories", icon: "logo-github" },
  { label: "Telegram Destinations", href: "/telegram-destinations", icon: "paper-plane-outline" },
  { label: "Notification Routes", href: "/notification-routes", icon: "git-branch-outline" },
  { label: "Notification Deliveries", href: "/notification-deliveries", icon: "send-outline" },
  { label: "Webhook Events", href: "/webhook-events", icon: "code-slash-outline" }
];

export function titleFromPath(pathname: string) {
  const found = navItems.find((item) => item.href === pathname);
  return found?.label ?? "Ops Pulse Dashboard";
}
