import {
    Tooltip,
    ResponsiveContainer,
    XAxis,
    YAxis,
    AreaChart,
    Area,
} from "recharts";
import { ChartTooltip } from "../chartTooltip";
import dayjs from "dayjs";
import type { ISalesChart } from "../../../interfaces";

type Props = {
    data: ISalesChart[];
};

export const DailyRevenue = (props: Props) => {
    const { data } = props;

    // Aggregate revenue by date
    const formattedData = data.reduce((acc, item) => {
        const dateKey = dayjs(item.created_at).format("YYYY-MM-DD");

        if (!acc[dateKey]) {
            acc[dateKey] = {
                date: dateKey,
                amount: 0,
            };
        }
        acc[dateKey].amount += Number(item.amount);
        return acc;
    }, {} as Record<string, { date: string; amount: number }>);

    // Convert to array and sort by date
    const chartData = Object.values(formattedData).sort(
        (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf()
    );

    // Calculate reasonable chart height based on data
    const maxValue = Math.max(...chartData.map((item) => item.amount));
    const yAxisMax = Math.ceil(maxValue * 1.2); // Add 20% padding

    return (
        <ResponsiveContainer width="99%" height={200}>
            <AreaChart
                data={chartData}
                margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 20,
                }}
            >
                <XAxis
                    dataKey="date"
                    fontSize={11}
                    tickFormatter={(value) => dayjs(value).format("MM/DD")}
                    axisLine
                    tickLine
                    dy={8}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                />
                <YAxis
                    fontSize={11}
                    axisLine
                    tickLine
                    allowDecimals={false}
                    domain={[0, yAxisMax]}
                    width={50}
                    tickFormatter={(value) =>
                        `₹${Number(value).toLocaleString("en-IN", {
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0,
                        })}`
                    }
                />
                <defs>
                    <linearGradient id="area-color" x1="0" y1="0" x2="0" y2="1">
                        <stop
                            offset="5%"
                            stopColor="#2196F3"
                            stopOpacity={0.5}
                        />
                        <stop
                            offset="95%"
                            stopColor="#2196F3"
                            stopOpacity={0}
                        />
                    </linearGradient>
                </defs>
                <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#2196F3"
                    fill="url(#area-color)"
                />
                <Tooltip
                    cursor={{
                        fill: "rgba(33, 150, 243, 0.1)",
                        radius: 4,
                    }}
                    content={
                        <ChartTooltip
                            labelFormatter={(label) =>
                                dayjs(label).format("MMM D, YYYY")
                            }
                            valueFormatter={(value) =>
                                new Intl.NumberFormat("en-IN", {
                                    style: "currency",
                                    currency: "INR",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(value))
                            }
                        />
                    }
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default DailyRevenue;
