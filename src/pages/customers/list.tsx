import React, {
    type PropsWithChildren,
    useMemo,
    useEffect,
    useState,
} from "react";
import {
    type HttpError,
    useExport,
    useGo,
    useNavigation,
    useTranslate,
} from "@refinedev/core";
import { useLocation } from "react-router-dom";
import { DateField, ExportButton, useDataGrid } from "@refinedev/mui";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Typography from "@mui/material/Typography";
import VisibilityOutlined from "@mui/icons-material/VisibilityOutlined";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import type { IUser, IUserFilterVariables } from "../../interfaces";
import { CustomTooltip, RefineListView } from "../../components";
import { CustomerStatus } from "../../components/customer";
import { userService } from "../../services/userService";

export const CustomerList = ({ children }: PropsWithChildren) => {
    const go = useGo();
    const { pathname } = useLocation();
    const { showUrl } = useNavigation();
    const [userData, setUserData] = useState<IUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await userService.getUsers();
                // Add an incremental id field starting from 1
                const dataWithIds = data.map((user: IUser, index: number) => ({
                    ...user,
                    id: index + 1, // Add id starting from 1
                }));
                setUserData(dataWithIds);
            } catch (error) {
                console.error("Error fetching users:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const columns: GridColDef[] = [
        { field: "id", headerName: "ID", width: 100 },
        { field: "first_name", headerName: "First Name", width: 200 },
        { field: "last_name", headerName: "Last Name", width: 200 },
        { field: "email", headerName: "Email", width: 250 },
        { field: "phone_number", headerName: "Phone Number", width: 150 },
        {
            field: "actions",
            headerName: "Actions",
            width: 100,
            renderCell: (params) => (
                <div>{/* Action buttons like Edit/Delete can go here */}</div>
            ),
        },
    ];

    const { dataGridProps, filters, sorters } = useDataGrid<
        IUser,
        HttpError,
        IUserFilterVariables
    >({
        initialPageSize: 10,
        pagination: {
            mode: "off",
        },
    });

    const { isLoading, triggerExport } = useExport<IUser>({
        sorters,
        filters,
        pageSize: 50,
        maxItemCount: 50,
        mapData: (item) => {
            return {
                id: item.user_id,
                fullName: item.fullName,
                phoneNumber: item.phoneNumber,
                isActive: item.isActive,
                createdAt: item.createdAt,
            };
        },
    });

    return (
        <>
            <RefineListView
                breadcrumb={false}
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
                        rows={userData}
                        columns={columns}
                        loading={loading}
                        autoHeight
                        pageSizeOptions={[10, 20, 50, 100]}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 10 },
                            },
                        }}
                    />
                </Paper>
            </RefineListView>
            {children}
        </>
    );
};
