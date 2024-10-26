import { useSnackbar, VariantType } from "notistack";
import { NotificationProvider, Refine } from "@refinedev/core";
import { RefineSnackbarProvider } from "@refinedev/mui";

export const CustomNotificationProvider: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const { enqueueSnackbar } = useSnackbar();

    const notificationProvider: NotificationProvider = {
        open: ({ type, message }) => {
            if (type === "error") {
                console.warn("Error:", message);
            } else {
                enqueueSnackbar(message, { variant: type as VariantType });
            }
        },
        close: () => {},
    };

    return (
        <RefineSnackbarProvider>
            <Refine
                notificationProvider={notificationProvider}
                // other configurations
            >
                {children}
            </Refine>
        </RefineSnackbarProvider>
    );
};
