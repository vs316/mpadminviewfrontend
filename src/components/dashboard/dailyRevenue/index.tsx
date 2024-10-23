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

// Improved function to consolidate data by date
const consolidateData = (data: ISalesChart[]) => {
    // Sort data by date first
    const sortedData = [...data].sort(
        (a, b) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf()
    );

    // Group and sum by date
    const consolidatedMap = sortedData.reduce(
        (acc: { [key: string]: ISalesChart }, item) => {
            const dateKey = dayjs(item.created_at).format("YYYY-MM-DD");

            if (!acc[dateKey]) {
                acc[dateKey] = {
                    created_at: dateKey,
                    amount: 0,
                    title: `Order Amount`,
                };
            }

            acc[dateKey].amount += Number(item.amount);
            return acc;
        },
        {}
    );

    // Convert back to array and ensure dates are sorted
    return Object.values(consolidatedMap).sort(
        (a, b) => dayjs(a.created_at).valueOf() - dayjs(b.created_at).valueOf()
    );
};

export const DailyRevenue = (props: Props) => {
    const rawData = props.data || [];
    const data = consolidateData(rawData);
    console.log(data);
    return (
        <ResponsiveContainer width="99%" height={300}>
            <AreaChart
                data={data}
                margin={{ top: 30, right: 20, left: 10, bottom: 50 }} // Adjusted bottom margin
            >
                <XAxis
                    dataKey="created_at"
                    fontSize={12}
                    angle={-30} // Rotate labels for better visibility
                    textAnchor="end" // Align text to end
                    padding={{ left: 10, right: 10 }}
                    tickFormatter={(value) => {
                        // Directly use value since it's already a valid date string
                        return value; // Return date in YYYY-MM-DD format or modify as needed
                    }}
                    tickCount={data.length > 0 ? data.length : 1} // Show ticks based on data length
                    interval={0} // Show all ticks
                />
                <YAxis
                    dataKey="amount"
                    fontSize={12}
                    tickFormatter={(amount) => {
                        return `₹${Number(amount).toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                        })}`;
                    }}
                    // domain={[0, "dataMax + 500"]} // Set a custom domain to prevent clipping
                    padding={{ top: 30, bottom: 50 }}
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
                    content={
                        <ChartTooltip
                            valueFormatter={(amount) =>
                                new Intl.NumberFormat("en-IN", {
                                    style: "currency",
                                    currency: "INR",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                }).format(Number(amount))
                            }
                            // labelFormatter={(label) =>
                            //     dayjs(label).format("MMM D, YYYY")
                            // }
                        />
                    }
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};
