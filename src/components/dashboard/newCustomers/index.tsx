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
import { ISalesChart } from "../../../interfaces";

type Props = {
    data: ISalesChart[];
};

export const NewCustomers = (props: Props) => {
    const { data } = props;

    // Aggregate users by date
    const formattedData = data.reduce((acc, item) => {
        const dateKey = dayjs(item.created_at).format("YYYY-MM-DD");

        if (!acc[dateKey]) {
            acc[dateKey] = {
                date: dateKey,
                value: 0,
            };
        }
        acc[dateKey].value += 1;
        return acc;
    }, {} as Record<string, { date: string; value: number }>);

    // Convert to array and sort by date
    const chartData = Object.values(formattedData).sort(
        (a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf()
    );

    // Calculate reasonable chart height based on data
    const maxValue = Math.max(...chartData.map((item) => item.value));
    const yAxisMax = Math.ceil(maxValue * 1.2); // Add 20% padding

    return (
        <ResponsiveContainer width="99%" height={200}>
            <BarChart
                data={chartData}
                barSize={20}
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
                    width={40}
                />
                <Bar
                    type="monotone"
                    dataKey="value"
                    fill="#2196F3"
                    radius={[4, 4, 0, 0]}
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
                                `${value} new user${value === 1 ? "" : "s"}`
                            }
                        />
                    }
                />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default NewCustomers;
