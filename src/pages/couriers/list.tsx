import { useEffect, useState, type PropsWithChildren, useMemo } from "react";
import { useGo, useNavigation, useTranslate } from "@refinedev/core";
import { CreateButton, EditButton, useDataGrid } from "@refinedev/mui";
import { useLocation } from "react-router-dom";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import { CourierRating, CourierStatus, RefineListView } from "../../components";
import { ICourier } from "../../interfaces";
import { courierService } from "../../services/courierService"; // Adjust the path as necessary

export const CourierList = ({ children }: PropsWithChildren) => {
    const go = useGo();
    const { pathname } = useLocation();
    const { createUrl } = useNavigation();
    const t = useTranslate();

    const [courier, setCouriers] = useState<ICourier[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCouriers = async () => {
            try {
                const data = await courierService.getCouriers();
                setCouriers(data);
            } catch (err) {
                setError("Failed to fetch couriers");
            } finally {
                setLoading(false);
            }
        };

        fetchCouriers();
    }, []);

    const columns = useMemo<GridColDef<ICourier>[]>(
        () => [
            {
                field: "courier_id",
                headerName: "ID #",
                width: 64,
                renderCell: function render({ row }) {
                    return <Typography>#{row.courier_id}</Typography>;
                },
            },
            {
                field: "name",
                width: 188,
                headerName: "Name",
            },
            {
                field: "vehicle_id",
                width: 112,
                headerName: "License Plate",
            },
            {
                field: "phone_number",
                width: 132,
                headerName: "Phone Number",
            },
            {
                field: "rating",
                width: 156,
                headerName: "Rating",
                renderCell: function render({ row }) {
                    return <CourierRating couriers={row} />;
                },
            },
            {
                field: "status",
                width: 156,
                headerName: "Status",
                renderCell: function render({ row }) {
                    return <CourierStatus value={row?.status} />;
                },
            },
            {
                field: "actions",
                headerName: "Actions",
                type: "actions",
                renderCell: function render({ row }) {
                    return (
                        <EditButton
                            hideText
                            recordItemId={row.courier_id}
                            svgIconProps={{
                                color: "action",
                            }}
                        />
                    );
                },
            },
        ],
        [t]
    );

    return (
        <>
            <RefineListView
                headerButtons={() => [
                    <CreateButton
                        key="create"
                        variant="contained"
                        size="medium"
                        sx={{ height: "40px" }}
                        onClick={() => {
                            return go({
                                to: `${createUrl("couriers")}`,
                                query: {
                                    to: pathname,
                                },
                                options: {
                                    keepQuery: true,
                                },
                                type: "replace",
                            });
                        }}
                    >
                        {"ADD"}
                    </CreateButton>,
                ]}
            >
                <Paper>
                    {(() => {
                        if (loading) {
                            return <Typography>Loading couriers...</Typography>;
                        }
                        if (error) {
                            return (
                                <Typography color="error">{error}</Typography>
                            );
                        }
                        return (
                            <DataGrid
                                rows={courier} // Set the rows prop to couriers
                                columns={columns}
                                autoHeight
                                pageSizeOptions={[10, 20, 50, 100]}
                                getRowId={(row) => row.courier_id} // Use courier_id as the unique identifier
                            />
                        );
                    })()}
                </Paper>
            </RefineListView>
            {children}
        </>
    );
};
