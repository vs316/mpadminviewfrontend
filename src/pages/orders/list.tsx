import React, { useEffect, useState, useMemo } from "react";
import {
    type HttpError,
    useExport,
    useNavigation,
    useTranslate,
} from "@refinedev/core";
import { ExportButton, useDataGrid } from "@refinedev/mui";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { RefineListView } from "../../components";
import type { IOrder, IOrderFilterVariables } from "../../interfaces";
import { shipFromService } from "../../services/shipfromService";
import { shipToService } from "../../services/shiptoService";
import { shipmentItemService } from "../../services/shipmentitemService";

export const OrderList = () => {
    const t = useTranslate();
    const { show } = useNavigation();

    // Fetching the "Ship From" and "Ship To" data
    const [shipFromData, setShipFromData] = useState([]);
    const [shipToData, setShipToData] = useState([]);
    const [shipmentItems, setShipmentItems] = useState([]);
    const [loading, setLoading] = useState(true);

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

    // Columns definition similar to CustomerList
    const columns: GridColDef<IOrder>[] = [
        { field: "id", headerName: "Order ID", width: 100 },
        { field: "amount", headerName: "Amount", width: 150 },
        { field: "status", headerName: "Status", width: 150 },
        {
            field: "user",
            headerName: "Customer",
            width: 200,
            valueGetter: (params) =>
                `${params.row.user.firstName} ${params.row.user.lastName}`,
        },
        {
            field: "actions",
            headerName: "Actions",
            width: 100,
            renderCell: (params) => (
                <div>
                    {/* Add any action buttons here, like View or Edit */}
                </div>
            ),
        },
    ];

    const { dataGridProps, filters, sorters } = useDataGrid<
        IOrder,
        HttpError,
        IOrderFilterVariables
    >({
        initialPageSize: 10,
        pagination: {
            mode: "off",
        },
    });

    const { isLoading, triggerExport } = useExport<IOrder>({
        sorters,
        filters,
        pageSize: 50,
        maxItemCount: 50,
        mapData: (item) => {
            return {
                id: item.shipment_id,
                amount: item.amount,
                status: item.status.text,
                user: `${item.user.firstName} ${item.user.lastName}`,
            };
        },
    });

    return (
        <RefineListView
            headerButtons={
                <ExportButton
                    variant="outlined"
                    onClick={triggerExport}
                    loading={isLoading}
                    size="medium"
                    sx={{ height: "40px" }}
                />
            }
        >
            <Paper>
                <DataGrid
                    {...dataGridProps}
                    columns={columns}
                    loading={loading}
                    onRowClick={({ id }) => {
                        show("orders", id);
                    }}
                    autoHeight
                    pageSizeOptions={[10, 20, 50, 100]}
                    sx={{
                        "& .MuiDataGrid-row": {
                            cursor: "pointer",
                        },
                    }}
                />
            </Paper>

            {/* "Ship From" and "Ship To" data in DataGrid format */}
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
                    getRowId={(row: { shipfrom_id: number }) => row.shipfrom_id} // Use the shipfrom_id as the unique id
                />
            </Paper>

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
