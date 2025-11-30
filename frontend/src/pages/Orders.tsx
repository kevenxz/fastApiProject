import { useState } from "react";

interface Order {
    id: string;
    symbol: string;
    side: "BUY" | "SELL";
    type: "LIMIT" | "MARKET";
    price: string;
    amount: string;
    status: "OPEN" | "FILLED" | "CANCELED";
    time: string;
}

export default function Orders() {
    const [orders, setOrders] = useState<Order[]>([
        {
            id: "1",
            symbol: "BTCUSDT",
            side: "BUY",
            type: "LIMIT",
            price: "45000",
            amount: "0.1",
            status: "FILLED",
            time: new Date().toISOString(),
        },
    ]);

    const [formData, setFormData] = useState({
        symbol: "BTCUSDT",
        side: "BUY",
        type: "LIMIT",
        price: "",
        amount: "",
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newOrder: Order = {
            id: Math.random().toString(36).substring(7),
            symbol: formData.symbol,
            side: formData.side as "BUY" | "SELL",
            type: formData.type as "LIMIT" | "MARKET",
            price: formData.price,
            amount: formData.amount,
            status: "OPEN",
            time: new Date().toISOString(),
        };
        setOrders([newOrder, ...orders]);
        // Reset form (partial)
        setFormData({ ...formData, price: "", amount: "" });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Order Form */}
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Place Order</h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Symbol</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={formData.symbol}
                                        onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                                    >
                                        <option value="BTCUSDT">BTCUSDT</option>
                                        <option value="ETHUSDT">ETHUSDT</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Side</label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={formData.side}
                                        onChange={(e) => setFormData({ ...formData, side: e.target.value })}
                                    >
                                        <option value="BUY">BUY</option>
                                        <option value="SELL">SELL</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium">Type</label>
                                <select
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="LIMIT">LIMIT</option>
                                    <option value="MARKET">MARKET</option>
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Price</label>
                                    <input
                                        type="number"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                        required={formData.type === "LIMIT"}
                                        disabled={formData.type === "MARKET"}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Amount</label>
                                    <input
                                        type="number"
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        placeholder="0.00"
                                        value={formData.amount}
                                        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="inline-flex w-full items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                            >
                                Place Order
                            </button>
                        </form>
                    </div>
                </div>

                {/* Orders List */}
                <div className="rounded-xl border bg-card text-card-foreground shadow">
                    <div className="p-6 space-y-4">
                        <h3 className="text-lg font-semibold">Recent Orders</h3>
                        <div className="relative w-full overflow-auto">
                            <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                    <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Time</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Symbol</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Side</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Price</th>
                                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                    {orders.map((order) => (
                                        <tr key={order.id} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                                            <td className="p-4 align-middle">{new Date(order.time).toLocaleTimeString()}</td>
                                            <td className="p-4 align-middle">{order.symbol}</td>
                                            <td className={`p-4 align-middle ${order.side === "BUY" ? "text-green-500" : "text-red-500"}`}>
                                                {order.side}
                                            </td>
                                            <td className="p-4 align-middle">{order.price || "Market"}</td>
                                            <td className="p-4 align-middle">{order.status}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
