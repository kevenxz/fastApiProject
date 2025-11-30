import { useEffect, useRef } from "react";
import { createChart, ColorType, type IChartApi } from "lightweight-charts";

interface KlineData {
    time: string;
    open: number;
    high: number;
    low: number;
    close: number;
}

interface TradingChartProps {
    data: KlineData[];
    colors?: {
        backgroundColor?: string;
        lineColor?: string;
        textColor?: string;
        areaTopColor?: string;
        areaBottomColor?: string;
    };
}

export function TradingChart({ data, colors = {} }: TradingChartProps) {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const handleResize = () => {
            chartRef.current?.applyOptions({ width: chartContainerRef.current!.clientWidth });
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: colors.backgroundColor || "transparent" },
                textColor: colors.textColor || "#d1d5db",
            },
            grid: {
                vertLines: { color: "#334155" },
                horzLines: { color: "#334155" },
            },
            width: chartContainerRef.current.clientWidth,
            height: 500,
        });

        chartRef.current = chart;

        const candlestickSeries = (chart as any).addCandlestickSeries({
            upColor: "#26a69a",
            downColor: "#ef5350",
            borderVisible: false,
            wickUpColor: "#26a69a",
            wickDownColor: "#ef5350",
        });

        const formattedData = data.map(d => ({
            ...d,
            time: Number(d.time) / 1000 as any // Convert ms to seconds
        }));

        candlestickSeries.setData(formattedData);
        chart.timeScale().fitContent();

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
            chart.remove();
        };
    }, [data, colors]);

    return <div ref={chartContainerRef} className="w-full h-[500px]" />;
}
