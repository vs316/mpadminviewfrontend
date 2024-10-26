import { useTranslate, useNavigation, useTable } from "@refinedev/core";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Pagination from "@mui/material/Pagination";
import dayjs from "dayjs";
import type { IShipment } from "../../../interfaces";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import ListSubHeader from "@mui/material/ListSubheader";
import { OrderStatus } from "../../order";
import { Header } from "@refinedev/mui";

export const OrderTimeline: React.FC = () => {
    const theme = useTheme();
    const { show } = useNavigation();

    const {
        tableQuery: tableQueryResult,
        current,
        setCurrent,
        pageCount,
    } = useTable<IShipment>({
        resource: "shipments",
        initialSorter: [
            {
                field: "created_at",
                order: "desc",
            },
        ],
        pagination: {
            pageSize: 4, // Set to show a max of 4 entries per page
        },
        syncWithLocation: false,
    });

    const { data } = tableQueryResult;

    // Calculate the start and end index for slicing based on the current page
    const startIndex = (current - 1) * 4; // For example, page 2 would start at index 4
    const endIndex = current * 4; // Page 2 would end at index 8, so slice(4, 8)

    return (
        <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            height="100%"
            pb="24px"
        >
            <List
                sx={{
                    padding: 0,
                }}
                subheader={
                    <ListSubHeader
                        sx={{
                            textAlign: "center", // Center-align the text
                            fontWeight: "bold", // Optional: make it bold
                        }}
                    >
                        Shipment ID
                    </ListSubHeader>
                }
            >
                {data?.data?.slice(startIndex, endIndex).map((order, i) => {
                    const isLast = i === data.data.length - 1;
                    return (
                        <ListItem
                            divider={!isLast}
                            key={order.shipment_id}
                            secondaryAction={dayjs(order.created_at).fromNow()}
                            onClick={() => show("orders", order.shipment_id)}
                            sx={{
                                cursor: "pointer",
                                "&:hover": {
                                    backgroundColor: theme.palette.action.hover,
                                },
                            }}
                        >
                            <ListItemAvatar
                                sx={{
                                    width: "98px",
                                    marginRight: "16px",
                                }}
                            >
                                <OrderStatus status={order.status} />
                            </ListItemAvatar>
                            <ListItemText
                                sx={{
                                    textAlign: "center",
                                    padding: "8px", // You can adjust the padding value as needed
                                    margin: "4px 0", // Optional margin for spacing between items
                                    whiteSpace: "nowrap", // Prevents text from wrapping
                                    overflow: "hidden", // Ensures that overflowing text is hidden
                                }}
                                primary={` ${order.shipment_id}`}
                            />
                        </ListItem>
                    );
                })}
            </List>
            <Box sx={{ display: "flex", justifyContent: "center", mt: "24px" }}>
                <Pagination
                    count={pageCount}
                    page={current}
                    onChange={(e, page) => setCurrent(page)}
                    siblingCount={1}
                    boundaryCount={1}
                    size="small"
                    color="primary"
                />
            </Box>
        </Box>
    );
};
