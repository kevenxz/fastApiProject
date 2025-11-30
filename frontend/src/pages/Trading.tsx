import { useState, useEffect } from "react";
import api from "@/lib/api";
import { TradingChart } from "@/components/trading/TradingChart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface Kline {
    open_time: string;
    open: string;
    high: string;
    low: string;
    close: string;
}

export default function Trading() {
    const [symbol, setSymbol] = useState("BTCUSDT");
    const [interval, setInterval] = useState("1h");
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchData();
    }, [symbol, interval]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await api.get("/exchange/binance/futures/klines", {
                params: { symbol, interval, limit: 100 },
            });
            const klines = response.data.klines.map((k: Kline) => ({
                time: k.open_time,
                open: parseFloat(k.open),
                high: parseFloat(k.high),
                low: parseFloat(k.low),
                close: parseFloat(k.close),
            }));
            setData(klines);
        } catch (error) {
            console.error("Failed to fetch klines:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Trading</h2>
                <div className="flex gap-4">
                    <div className="w-[180px]">
                        <Select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Symbol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="BTCUSDT">BTCUSDT</SelectItem>
                                <SelectItem value="ETHUSDT">ETHUSDT</SelectItem>
                                <SelectItem value="BNBUSDT">BNBUSDT</SelectItem>
                                <SelectItem value="SOLUSDT">SOLUSDT</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="w-[180px]">
                        <Select value={interval} onChange={(e) => setInterval(e.target.value)}>
                            <SelectTrigger>
                                <SelectValue placeholder="Interval" />
                            </SelectTrigger>
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
                </div>
            </div>

            <Card>
                <CardContent className="p-6">
                    {loading ? (
                        <div className="flex h-[500px] items-center justify-center">
                            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        </div>
                    ) : (
                        <TradingChart data={data} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
