import {
    BarChart,
    Bar,
    Tooltip,
    ResponsiveContainer,
    XAxis,
    YAxis,
} from "recharts";
import { ChartTooltip } from "../chartTooltip";
import dayjs from "dayjs";
import type { IOrderChart } from "../../../interfaces";

type Props = {
    data: IOrderChart[];
};

export const DailyOrders = (props: Props) => {
    const data = props.data || [];

    // Aggregate data by date using the original date format
    const formattedData = data
        .reduce((acc, item) => {
            const dateKey = item.created_at;
            const existingEntry = acc.find((entry) => entry.date === dateKey);

            if (existingEntry) {
                existingEntry.value += 1;
            } else {
                acc.push({ date: dateKey, value: 1 });
            }

            return acc;
        }, [] as { date: string; value: number }[])
        .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());

    return (
        <ResponsiveContainer width="99%" height={300}>
            <BarChart
                data={formattedData}
                barSize={15}
                margin={{ top: 20, right: 10, left: -25, bottom: 0 }}
            >
                <XAxis
                    dataKey="date"
                    fontSize={12}
                    tickFormatter={(value) => dayjs(value).format("MM/DD")}
                    axisLine
                    tickLine
                    dy={8}
                />
                <YAxis
                    fontSize={12}
                    axisLine
                    tickLine
                    allowDecimals={false}
                    domain={[0, "dataMax"]}
                />
                <Bar
                    type="natural"
                    dataKey="value"
                    fill="#2196F3"
                    radius={[4, 4, 0, 0]}
                />
                <Tooltip
                    cursor={{
                        fill: "rgba(255, 255, 255, 0.2)",
                        radius: 4,
                    }}
                    content={
                        <ChartTooltip
                            labelFormatter={(label) =>
                                dayjs(label).format("MMM D, YYYY")
                            }
                            valueFormatter={(value) =>
                                `${value} order${value === 1 ? "" : "s"}`
                            }
                        />
                    }
                />
            </BarChart>
        </ResponsiveContainer>
    );
};
