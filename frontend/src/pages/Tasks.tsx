import { useState } from "react";
import api from "@/lib/api";
import { Play, Square, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Tasks() {
    const [formData, setFormData] = useState({
        // Job Settings
        job_id: "",
        scheduler_interval: "20",
        scheduler_type: "m",

        // Trader/Analysis Settings
        symbol: "BTCUSDT",
        kline_interval: "1h",
        klines_count: "100",
        is_trader: false,

        // AI Settings
        service: "guiji",
        model: "",
        temperature: "0.7",
        max_tokens: "16389",
        enable_thinking: false,
        initial_message: "",
    });

    const handleAddJob = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const chatTraderRequest = {
                service: formData.service,
                model: formData.model || null,
                temperature: parseFloat(formData.temperature),
                max_tokens: parseInt(formData.max_tokens),
                enable_thinking: formData.enable_thinking,
                klines_count: parseInt(formData.klines_count),
                is_Trader: formData.is_trader,
                symbol: formData.symbol,
                interval: formData.kline_interval,
                messages: formData.initial_message ? [{ role: "user", content: formData.initial_message }] : [],
            };

            await api.post("/scheduler/jobs", {
                job_id: formData.job_id,
                chatTraderRequest: chatTraderRequest,
                symbol: formData.symbol,
                interval: parseInt(formData.scheduler_interval),
                type: formData.scheduler_type,
            });
            alert("Job scheduled successfully");
        } catch (error) {
            console.error("Failed to schedule job:", error);
            alert("Failed to schedule job");
        }
    };

    const handleStartScheduler = async () => {
        try {
            await api.post("/scheduler/start");
            alert("Scheduler started");
        } catch (error) {
            console.error("Failed to start scheduler:", error);
        }
    };

    const handleStopScheduler = async () => {
        try {
            await api.post("/scheduler/stop");
            alert("Scheduler stopped");
        } catch (error) {
            console.error("Failed to stop scheduler:", error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Scheduled Tasks</h2>
                <div className="flex gap-2">
                    <Button onClick={handleStartScheduler} className="bg-green-600 hover:bg-green-700">
                        <Play className="mr-2 h-4 w-4" /> Start Scheduler
                    </Button>
                    <Button onClick={handleStopScheduler} variant="destructive">
                        <Square className="mr-2 h-4 w-4" /> Stop Scheduler
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Add New Task</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleAddJob} className="space-y-6">

                            {/* Job Configuration */}
                            <div className="space-y-4">
                                <h4 className="text-sm font-medium text-muted-foreground">Job Configuration</h4>
                                <div className="grid gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Job ID</label>
                                        <input
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            placeholder="e.g., btc-trading-bot"
                                            value={formData.job_id}
                                            onChange={(e) => setFormData({ ...formData, job_id: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Run Every</label>
                                            <input
                                                type="number"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                value={formData.scheduler_interval}
                                                onChange={(e) => setFormData({ ...formData, scheduler_interval: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Unit</label>
                                            <Select
                                                value={formData.scheduler_type}
                                                onChange={(e) => setFormData({ ...formData, scheduler_type: e.target.value })}
                                            >
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="m">Minutes</SelectItem>
                                                    <SelectItem value="h">Hours</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4 space-y-4">
                                <h4 className="text-sm font-medium text-muted-foreground">Analysis Settings</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Symbol</label>
                                        <Select
                                            value={formData.symbol}
                                            onChange={(e) => setFormData({ ...formData, symbol: e.target.value })}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="BTCUSDT">BTCUSDT</SelectItem>
                                                <SelectItem value="ETHUSDT">ETHUSDT</SelectItem>
                                                <SelectItem value="BNBUSDT">BNBUSDT</SelectItem>
                                                <SelectItem value="SOLUSDT">SOLUSDT</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Kline Interval</label>
                                        <Select
                                            value={formData.kline_interval}
                                            onChange={(e) => setFormData({ ...formData, kline_interval: e.target.value })}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="1m">1m</SelectItem>
                                                <SelectItem value="5m">5m</SelectItem>
                                                <SelectItem value="15m">15m</SelectItem>
                                                <SelectItem value="1h">1h</SelectItem>
                                                <SelectItem value="4h">4h</SelectItem>
                                                <SelectItem value="1d">1d</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Klines Count</label>
                                        <input
                                            type="number"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            value={formData.klines_count}
                                            onChange={(e) => setFormData({ ...formData, klines_count: e.target.value })}
                                        />
                                    </div>
                                    <div className="flex items-center space-x-2 pt-8">
                                        <input
                                            type="checkbox"
                                            id="is_trader"
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            checked={formData.is_trader}
                                            onChange={(e) => setFormData({ ...formData, is_trader: e.target.checked })}
                                        />
                                        <label htmlFor="is_trader" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Is Trader Mode
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t pt-4 space-y-4">
                                <h4 className="text-sm font-medium text-muted-foreground">AI Configuration</h4>
                                <div className="grid gap-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Service</label>
                                            <input
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                value={formData.service}
                                                onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Model</label>
                                            <input
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                placeholder="Optional"
                                                value={formData.model}
                                                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Temperature</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                value={formData.temperature}
                                                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium">Max Tokens</label>
                                            <input
                                                type="number"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                value={formData.max_tokens}
                                                onChange={(e) => setFormData({ ...formData, max_tokens: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <input
                                            type="checkbox"
                                            id="enable_thinking"
                                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                            checked={formData.enable_thinking}
                                            onChange={(e) => setFormData({ ...formData, enable_thinking: e.target.checked })}
                                        />
                                        <label htmlFor="enable_thinking" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                            Enable Thinking
                                        </label>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium">Initial Message (Prompt)</label>
                                        <textarea
                                            className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            placeholder="Enter initial prompt for the AI..."
                                            value={formData.initial_message}
                                            onChange={(e) => setFormData({ ...formData, initial_message: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full">
                                <Plus className="mr-2 h-4 w-4" /> Schedule Task
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Active Tasks</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm text-muted-foreground">
                            Task list retrieval is not yet enabled on the backend.
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
