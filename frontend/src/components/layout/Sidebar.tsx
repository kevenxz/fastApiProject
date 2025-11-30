import { NavLink } from "react-router-dom";
import { LayoutDashboard, LineChart, MessageSquare, ListOrdered, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/mode-toggle";

const navItems = [
    { to: "/", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/trading", icon: LineChart, label: "Trading" },
    { to: "/ai", icon: MessageSquare, label: "AI Assistant" },
    { to: "/orders", icon: ListOrdered, label: "Orders" },
    { to: "/tasks", icon: CalendarClock, label: "Tasks" },
];

export function Sidebar() {
    return (
        <div className="flex h-screen w-72 flex-col border-r bg-card text-card-foreground shadow-sm">
            <div className="flex h-16 items-center border-b px-6">
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                        <span className="text-primary-foreground font-bold text-lg">A</span>
                    </div>
                    <h1 className="text-xl font-bold tracking-tight">AI Trader</h1>
                </div>
            </div>
            <nav className="flex-1 space-y-1 p-4">
                {navItems.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                            cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground",
                                isActive ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90 hover:text-primary-foreground" : "text-muted-foreground"
                            )
                        }
                    >
                        <item.icon className="h-4 w-4" />
                        {item.label}
                    </NavLink>
                ))}
            </nav>
            <div className="border-t p-4 space-y-4 bg-muted/20">
                <ModeToggle />
                <div className="flex items-center justify-between px-2">
                    <p className="text-xs text-muted-foreground">v1.0.0</p>
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" title="System Online"></div>
                </div>
            </div>
        </div>
    );
}
