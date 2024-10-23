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

// Improved function to aggregate users by date
const aggregateUsersByDate = (data: ISalesChart[]) => {
    // Create a map to store counts by date
    const countsByDate = data.reduce((acc: { [key: string]: number }, item) => {
        // Format the date consistently for grouping
        const dateKey = dayjs(item.created_at).format("YYYY-MM-DD");

        // Increment the count for this date
        acc[dateKey] = (acc[dateKey] || 0) + 1;

        return acc;
    }, {});

    // Convert to array and sort by date
    return Object.entries(countsByDate)
        .map(([date, count]) => ({
            date,
            value: count,
        }))
        .sort((a, b) => dayjs(a.date).valueOf() - dayjs(b.date).valueOf());
};

export const NewCustomers = (props: Props) => {
    const rawData = props.data || [];
    // Use the aggregated data instead of raw data
    const formattedData = aggregateUsersByDate(rawData);

    return (
        <ResponsiveContainer width="99%" height={300}>
            <BarChart
                data={formattedData}
                barSize={15}
                margin={{ top: 20, right: 10, left: -25, bottom: 25 }}
            >
                <XAxis
                    dataKey="date"
                    fontSize={12}
                    tickFormatter={(value) => dayjs(value).format("MM/DD")}
                    axisLine={true}
                    tickLine={true}
                    dy={8} // Add some padding between the axis and the labels
                />
                <YAxis
                    dataKey="value"
                    fontSize={12}
                    // Ensure we show whole numbers since we're counting users
                    tickFormatter={(value) => Math.round(value).toString()}
                    axisLine={true}
                    tickLine={true}
                />
                <Bar
                    type="natural"
                    dataKey="value"
                    fill="#2196F3"
                    radius={[4, 4, 0, 0]} // Optional: adds rounded corners to bars
                />
                <Tooltip
                    cursor={{ fill: "rgba(255, 255, 255, 0.2)", radius: 4 }}
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
