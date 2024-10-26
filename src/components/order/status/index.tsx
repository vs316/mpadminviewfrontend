import { useTranslate } from "@refinedev/core";
import Chip from "@mui/material/Chip";
import type { ChipProps } from "@mui/material/Chip";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WatchLaterIcon from "@mui/icons-material/WatchLater";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MopedIcon from "@mui/icons-material/Moped";
import { useTheme } from "@mui/material/styles";
import { red, orange, cyan, blue, green } from "@mui/material/colors";

type OrderStatusProps = {
    status?:
        | "PENDING"
        | "Ready"
        | "On The Way"
        | "Delivered"
        | "Cancelled"
        | "ACCEPTED"
        | "REJECTED";
};

export const OrderStatus = ({ status }: OrderStatusProps) => {
    const { palette } = useTheme();
    const isDarkMode = palette.mode === "dark";

    let color = "";
    let icon: ChipProps["icon"];

    switch (status) {
        case "PENDING":
            color = isDarkMode ? orange[200] : orange[800];
            icon = (
                <WatchLaterIcon
                    sx={{
                        fill: isDarkMode ? orange[200] : orange[600],
                    }}
                />
            );
            break;
        case "ACCEPTED":
            color = isDarkMode ? cyan[200] : cyan[800];
            icon = (
                <NotificationsIcon
                    sx={{
                        fill: isDarkMode ? cyan[200] : cyan[600],
                    }}
                />
            );
            break;
        case "Ready":
            color = isDarkMode ? cyan[200] : cyan[800];
            icon = (
                <NotificationsIcon
                    sx={{
                        fill: isDarkMode ? cyan[200] : cyan[600],
                    }}
                />
            );
            break;
        case "On The Way":
            color = isDarkMode ? blue[200] : blue[800];
            icon = (
                <MopedIcon
                    sx={{
                        fill: isDarkMode ? blue[200] : blue[600],
                    }}
                />
            );
            break;
        case "Delivered":
            color = isDarkMode ? green[200] : green[800];
            icon = (
                <CheckCircleIcon
                    sx={{
                        fill: isDarkMode ? green[200] : green[600],
                    }}
                />
            );
            break;
        case "Cancelled":
            color = isDarkMode ? red[200] : red[800];
            icon = (
                <CancelIcon
                    sx={{
                        fill: isDarkMode ? red[200] : red[600],
                    }}
                />
            );
            break;
        case "REJECTED":
            color = isDarkMode ? red[200] : red[800];
            icon = (
                <CancelIcon
                    sx={{
                        fill: isDarkMode ? red[200] : red[600],
                    }}
                />
            );
            break;
    }

    return (
        <Chip
            variant="outlined"
            size="small"
            icon={icon}
            sx={{
                borderColor: color,
                color: color,
                // Increase the label width
                minWidth: "100px", // Set a minimum width
                maxWidth: "150px", // Optionally set a maximum width
                overflow: "hidden", // Hide overflow
                textOverflow: "ellipsis", // Add ellipsis for overflow text
                whiteSpace: "nowrap", // Prevent line breaks
            }}
            label={`${status}`}
        />
    );
};
