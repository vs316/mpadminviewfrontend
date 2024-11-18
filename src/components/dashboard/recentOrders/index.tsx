import React, { useState, useMemo, useEffect } from "react";
import { useNavigation, useTranslate, useList } from "@refinedev/core";
import { NumberField, useDataGrid } from "@refinedev/mui";
import CheckOutlined from "@mui/icons-material/CheckOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import {
    DataGrid,
    GridActionsCellItem,
    type GridColDef,
} from "@mui/x-data-grid";
import { IShipment } from "../../../interfaces";
import dayjs from "dayjs";
import { OrderStatus } from "../../order";

export const RecentOrders: React.FC = () => {
    const t = useTranslate();
    const { show } = useNavigation();
    const [shipments, setShipments] = useState<IShipment[]>([]);

    const [filterRange, setFilterRange] = useState({
        startDate: "",
        endDate: "",
    });

    // Set date range for last week
    const handleLastWeek = () => {
        const today = dayjs();
        const startDate = today
            .subtract(1, "week")
            .startOf("week")
            .toISOString();
        const endDate = today.subtract(1, "week").endOf("week").toISOString();
        setFilterRange({ startDate, endDate });
    };

    // Set date range for last month
    const handleLastMonth = () => {
        const today = dayjs();
        const startDate = today
            .subtract(1, "month")
            .startOf("month")
            .toISOString();
        const endDate = today.subtract(1, "month").endOf("month").toISOString();
        setFilterRange({ startDate, endDate });
    };

    const { dataGridProps } = useDataGrid<IShipment>({
        resource: "shipments",
        initialSorter: [{ field: "created_at", order: "desc" }],
        initialPageSize: 10,
        syncWithLocation: false,
    });

    // Function to fetch shipments
    const fetchShipments = async () => {
        try {
            const response = await fetch("http://localhost:3000/shipments");
            if (!response.ok) {
                throw new Error("Failed to fetch shipments");
            }
            const data = await response.json();
            setShipments(data);
        } catch (error) {
            console.error("Error fetching shipments:", error);
        }
    };

    // Initial fetch
    useEffect(() => {
        fetchShipments();
    }, []);

    const handleAccept = async (shipment_id: number) => {
        try {
            const response = await fetch(
                `http://localhost:3000/shipments/${shipment_id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: { set: "ACCEPTED" },
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update shipment status");
            }

            // Update the local state immediately
            setShipments((prevShipments) =>
                prevShipments.map((shipment) =>
                    shipment.shipment_id === shipment_id
                        ? { ...shipment, status: "ACCEPTED" }
                        : shipment
                )
            );

            // Fetch fresh data
            await fetchShipments();
        } catch (error) {
            console.error(error);
        }
    };

    const handleReject = async (shipment_id: number) => {
        try {
            const response = await fetch(
                `http://localhost:3000/shipments/${shipment_id}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: { set: "REJECTED" },
                    }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update shipment status");
            }

            // Update the local state immediately
            setShipments((prevShipments) =>
                prevShipments.map((shipment) =>
                    shipment.shipment_id === shipment_id
                        ? { ...shipment, status: "REJECTED" }
                        : shipment
                )
            );

            // Fetch fresh data
            await fetchShipments();
        } catch (error) {
            console.error(error);
        }
    };

    const columns = useMemo<GridColDef<IShipment>[]>(
        () => [
            {
                field: "ShipmentID",
                headerName: "Shipment ID",
                renderCell: ({ row }) => (
                    <Typography>#{row.shipment_id}</Typography>
                ),
                width: 120,
            },
            {
                field: "user",
                headerName: "User Name",
                width: 220,
                renderCell: ({ row }) => (
                    <Stack spacing="4px">
                        <Typography>{`${row.user.first_name} ${row.user.last_name}`}</Typography>
                        {/* <Typography
                            variant="caption"
                            color="text.secondary"
                            sx={{
                                whiteSpace: "pre-wrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                display: "-webkit-box",
                                WebkitLineClamp: "2",
                                WebkitBoxOrient: "vertical",
                                minWidth: "100px",
                                marginBottom: "0",
                            }}
                        >
                            {row.shipfrom.city}
                        </Typography> */}
                    </Stack>
                ),
            },
            {
                field: "amount",
                headerName: "Amount",
                align: "right",
                width: 100,
                renderCell: ({ row }) => (
                    <NumberField
                        options={{
                            currency: "INR",
                            style: "currency",
                            notation: "standard",
                        }}
                        value={row.payment[0].amount}
                    />
                ),
            },
            {
                field: "status",
                headerName: "Order Status",
                width: 140,
                renderCell: ({ row }) => (
                    <Typography>
                        <OrderStatus status={row.status} />
                    </Typography>
                ),
            },
            {
                field: "actions",
                headerName: "Actions",
                type: "actions",
                width: 100,
                getActions: ({ id }) => [
                    <GridActionsCellItem
                        key={1}
                        icon={<CheckOutlined color="success" />}
                        sx={{ padding: "2px 6px" }}
                        label={t("buttons.accept")}
                        showInMenu
                        onClick={() => handleAccept(Number(id))}
                    />,
                    <GridActionsCellItem
                        key={2}
                        icon={<CloseOutlined color="error" />}
                        sx={{ padding: "2px 6px" }}
                        label={t("buttons.reject")}
                        showInMenu
                        onClick={() => handleReject(Number(id))}
                    />,
                ],
            },
        ],
        [t]
    );

    return (
        <DataGrid
            {...dataGridProps}
            rows={shipments}
            onRowClick={(row) => show("orders", row.id)}
            getRowId={(row) => row.shipment_id}
            columns={columns}
            pageSizeOptions={[10, 25, 50, 100]}
            rowHeight={50}
            sx={{
                // height: "100%",
                // border: "none",
                // "& .MuiDataGrid-row": {
                //     cursor: "pointer",
                //     maxHeight: "max-content !important",
                //     minHeight: "max-content !important",
                // },
                // "& .MuiDataGrid-cell": {
                //     maxHeight: "max-content !important",
                //     minHeight: "max-content !important",
                //     padding: "16px",
                //     alignItems: "center",
                // },
                height: "100%",
                border: "none",
                "& .MuiDataGrid-row": {
                    cursor: "pointer",
                    maxHeight: "none", // Remove maxHeight to allow proper alignment
                    minHeight: "none", // Remove minHeight to allow proper alignment
                },
                "& .MuiDataGrid-cell": {
                    padding: "8px", // Adjust padding as needed
                    alignItems: "center",
                    display: "flex", // Use flex to align content properly
                    justifyContent: "center", // Center content horizontally
                },
            }}
        />
    );
};
