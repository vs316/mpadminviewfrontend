import React, { useEffect, useState } from "react";
import {
    type HttpError,
    useExport,
    useNavigation,
    useTranslate,
} from "@refinedev/core";
import { ExportButton, useDataGrid } from "@refinedev/mui";
import {
    DataGrid,
    GridActionsCellItem,
    type GridColDef,
} from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { OrderStatus, RefineListView } from "../../components";
import type { IShipment } from "../../interfaces";
import { shipmentService } from "../../services/shipmentService";
import { shipFromService } from "../../services/shipfromService";
import { shipToService } from "../../services/shiptoService";
import { shipmentItemService } from "../../services/shipmentitemService";
import CheckOutlined from "@mui/icons-material/CheckOutlined";
import CloseOutlined from "@mui/icons-material/CloseOutlined";
import dayjs from "dayjs";

export const OrderList = () => {
    const translate = useTranslate();
    const { show } = useNavigation();

    const [shipFromData, setShipFromData] = useState([]);
    const [shipToData, setShipToData] = useState([]);
    const [shipmentItems, setShipmentItems] = useState([]);
    const [loading, setLoading] = useState(true);

    // Use useDataGrid hook with proper configuration
    const {
        dataGridProps,
        tableQuery: { refetch },
    } = useDataGrid<IShipment, HttpError>({
        resource: "shipments", // Specify the resource name
        pagination: {
            mode: "server",
            current: 1,
            pageSize: 10,
        },
        queryOptions: {
            enabled: true, // Enable the query
        },
    });

    // Handlers for Accepting and Rejecting shipments
    const handleAccept = async (shipment_id: number) => {
        try {
            const response = await fetch(
                `http://localhost:3000/shipments/${shipment_id}`,
                {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: { set: "ACCEPTED" } }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update shipment status");
            }

            // Refetch the data after successful update
            refetch();
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
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ status: { set: "REJECTED" } }),
                }
            );

            if (!response.ok) {
                throw new Error("Failed to update shipment status");
            }

            // Refetch the data after successful update
            refetch();
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch other data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [shipFrom, shipTo, items] = await Promise.all([
                    shipFromService.getAllShipFromData(),
                    shipToService.getAllShipToData(),
                    shipmentItemService.getAllShipmentItems(),
                ]);

                setShipFromData(shipFrom);
                setShipToData(shipTo);
                setShipmentItems(items);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const { isLoading: exportLoading, triggerExport } = useExport<IShipment>({
        mapData: (item) => ({
            id: item.shipment_id,
            amount: item.payment[0].amount,
            status: item.status,
            user: `${item.user.first_name} ${item.user.last_name}`,
        }),
    });

    const columns = [
        {
            field: "shipment_id",
            headerName: "Shipment ID",
            width: 120,
            sortable: true,
        },
        {
            field: "user_name",
            headerName: "User",
            width: 150,
            sortable: true,
            valueGetter: (params: { row: IShipment }) =>
                `${params.row.user?.first_name || ""} ${
                    params.row.user?.last_name || ""
                }`,
        },
        {
            field: "status",
            headerName: "Status",
            width: 140,
            renderCell: ({ row }: { row: IShipment }) => (
                <OrderStatus status={row.status} />
            ),
        },
        {
            field: "created_at",
            headerName: "Created At",
            width: 180,
            sortable: true,
            valueGetter: (params: { row: IShipment }) =>
                dayjs(params.row.created_at).format("YYYY/MM/DD | HH:mm"),
        },
        {
            field: "payment_amount",
            headerName: "Payment Amount",
            width: 150,
            sortable: true,
            valueGetter: (params: { row: IShipment }) =>
                params.row.payment?.[0]?.amount || "N/A",
        },
        {
            field: "shipfrom_city",
            headerName: "From City",
            width: 150,
            sortable: true,
            valueGetter: (params: { row: IShipment }) =>
                params.row.shipfrom?.city || "N/A",
        },
        {
            field: "shipto_city",
            headerName: "To City",
            width: 150,
            sortable: true,
            valueGetter: (params: { row: IShipment }) =>
                params.row.shipto?.city || "N/A",
        },
        {
            field: "actions",
            headerName: "Actions",
            type: "actions",
            width: 80,
            getActions: ({ id }: { id: number }) => [
                <GridActionsCellItem
                    key={1}
                    icon={<CheckOutlined color="success" />}
                    sx={{ padding: "2px 6px" }}
                    label={translate("buttons.accept")}
                    showInMenu
                    onClick={() => handleAccept(Number(id))}
                />,
                <GridActionsCellItem
                    key={2}
                    icon={<CloseOutlined color="error" />}
                    sx={{ padding: "2px 6px" }}
                    label={translate("buttons.reject")}
                    showInMenu
                    onClick={() => handleReject(Number(id))}
                />,
            ],
        },
    ];

    return (
        <RefineListView
            headerButtons={
                <ExportButton
                    variant="outlined"
                    onClick={triggerExport}
                    loading={exportLoading}
                    size="medium"
                    sx={{ height: "40px" }}
                />
            }
        >
            <Paper>
                <DataGrid
                    {...dataGridProps}
                    columns={columns}
                    autoHeight
                    getRowId={(row) => row.shipment_id}
                    sx={{
                        "& .MuiDataGrid-row": {
                            cursor: "pointer",
                        },
                    }}
                    pageSizeOptions={[10, 25, 50, 100]}
                />
            </Paper>

            {/* Rest of your component remains the same */}
            {/* Ship From Details */}
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Ship From Details
            </Typography>
            <Paper>
                <DataGrid
                    rows={shipFromData}
                    columns={[
                        { field: "shipfrom_id", headerName: "ID", width: 100 },
                        {
                            field: "first_name",
                            headerName: "First Name",
                            width: 150,
                        },
                        {
                            field: "last_name",
                            headerName: "Last Name",
                            width: 150,
                        },
                        { field: "email", headerName: "Email", width: 200 },
                        {
                            field: "phone_number",
                            headerName: "Phone",
                            width: 150,
                        },
                        { field: "city", headerName: "City", width: 150 },
                    ]}
                    loading={loading}
                    autoHeight
                    pageSizeOptions={[10, 20, 50]}
                    getRowId={(row: { shipfrom_id: number }) => row.shipfrom_id}
                />
            </Paper>

            {/* Ship To Details */}
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Ship To Details
            </Typography>
            <Paper>
                <DataGrid
                    rows={shipToData}
                    columns={[
                        { field: "shipto_id", headerName: "ID", width: 100 },
                        { field: "company", headerName: "Company", width: 200 },
                        {
                            field: "first_name",
                            headerName: "First Name",
                            width: 150,
                        },
                        {
                            field: "last_name",
                            headerName: "Last Name",
                            width: 150,
                        },
                        { field: "email", headerName: "Email", width: 200 },
                        {
                            field: "phone_number",
                            headerName: "Phone",
                            width: 150,
                        },
                        { field: "city", headerName: "City", width: 150 },
                    ]}
                    loading={loading}
                    autoHeight
                    pageSizeOptions={[10, 20, 50]}
                    getRowId={(row: { shipto_id: number }) => row.shipto_id}
                />
            </Paper>

            {/* Shipment Items */}
            <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                Shipment Items
            </Typography>
            <Paper>
                <DataGrid
                    rows={shipmentItems}
                    columns={[
                        {
                            field: "shipment_item_id",
                            headerName: "ID",
                            width: 100,
                        },
                        {
                            field: "item_description",
                            headerName: "Description",
                            width: 200,
                        },
                        {
                            field: "quantity",
                            headerName: "Quantity",
                            width: 100,
                        },
                        { field: "weight", headerName: "Weight", width: 100 },
                        { field: "value", headerName: "Value", width: 100 },
                        {
                            field: "servicetype",
                            headerName: "Service Type",
                            width: 150,
                        },
                    ]}
                    loading={loading}
                    autoHeight
                    pageSizeOptions={[10, 20, 50]}
                    getRowId={(row: { shipment_item_id: number }) =>
                        row.shipment_item_id
                    }
                />
            </Paper>
        </RefineListView>
    );
};
