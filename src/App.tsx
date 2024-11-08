import { Authenticated, Refine } from "@refinedev/core";
import { KBarProvider } from "@refinedev/kbar";
import {
    ErrorComponent,
    ThemedLayoutV2,
    RefineSnackbarProvider,
    useNotificationProvider,
} from "@refinedev/mui";
import GlobalStyles from "@mui/material/GlobalStyles";
import CssBaseline from "@mui/material/CssBaseline";
import dataProvider from "@refinedev/simple-rest";
import routerProvider, {
    CatchAllNavigate,
    NavigateToResource,
    UnsavedChangesNotifier,
    DocumentTitleHandler,
} from "@refinedev/react-router-v6";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MopedOutlined from "@mui/icons-material/MopedOutlined";
import Dashboard from "@mui/icons-material/Dashboard";
import LocalShippingIcon from "@mui/icons-material/LocalShippingOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";
import { DashboardPage } from "./pages/dashboard";
import { CustomerShow, CustomerList } from "./pages/customers";
import { CourierList, CourierCreate, CourierEdit } from "./pages/couriers";
import { AuthPage } from "./pages/auth";
import { ColorModeContextProvider } from "./contexts";
import { Header, Title } from "./components";
import { OrderList } from "./pages/orders/list";
import React from "react";
import Signout from "./pages/logout";

const API_URL = "http://localhost:3000";

const App: React.FC = () => {
    const { t, i18n } = useTranslation();

    const i18nProvider = {
        translate: (key: string, params: object) => t(key, params),
        changeLocale: (lang: string) => i18n.changeLanguage(lang),
        getLocale: () => i18n.language,
    };

    return (
        <BrowserRouter>
            <KBarProvider>
                <ColorModeContextProvider>
                    <CssBaseline />
                    <GlobalStyles
                        styles={{ html: { WebkitFontSmoothing: "auto" } }}
                    />

                    <RefineSnackbarProvider>
                        <Refine
                            notificationProvider={useNotificationProvider}
                            routerProvider={routerProvider}
                            dataProvider={dataProvider(API_URL)}
                            i18nProvider={i18nProvider}
                            options={{
                                syncWithLocation: true,
                                warnWhenUnsavedChanges: true,
                                breadcrumb: false,
                                useNewQueryKeys: true,
                            }}
                            resources={[
                                {
                                    name: "dashboard",
                                    list: "/",
                                    meta: {
                                        label: "Dashboard",
                                        icon: <Dashboard />,
                                    },
                                },
                                {
                                    name: "Shipments",
                                    list: "/orders",
                                    show: "/orders/:id",
                                    meta: {
                                        icon: <LocalShippingIcon />,
                                    },
                                },
                                {
                                    name: "user",
                                    list: "/customers",
                                    show: "/customers/:id",
                                    meta: {
                                        icon: <AccountCircleOutlinedIcon />,
                                    },
                                },
                                {
                                    name: "couriers",
                                    list: "/couriers",
                                    create: "/couriers/new",
                                    edit: "/couriers/:id/edit",
                                    meta: {
                                        icon: <MopedOutlined />,
                                    },
                                },
                                {
                                    name: "logout",
                                    list: "/logout",
                                    meta: {
                                        label: "Logout",
                                        icon: <LogoutIcon />,
                                    },
                                },
                            ]}
                        >
                            <Routes>
                                <Route
                                    element={
                                        <Authenticated
                                            key="authenticated-routes"
                                            fallback={
                                                <CatchAllNavigate to="/login" />
                                            }
                                        >
                                            <ThemedLayoutV2
                                                Header={Header}
                                                Title={Title}
                                            >
                                                <Box
                                                    sx={{
                                                        maxWidth: "1200px",
                                                        marginLeft: "auto",
                                                        marginRight: "auto",
                                                    }}
                                                >
                                                    <Outlet />
                                                </Box>
                                            </ThemedLayoutV2>
                                        </Authenticated>
                                    }
                                >
                                    <Route index element={<DashboardPage />} />
                                    <Route path="/orders">
                                        <Route index element={<OrderList />} />
                                    </Route>
                                    <Route
                                        path="/customers"
                                        element={
                                            <CustomerList>
                                                <Outlet />
                                            </CustomerList>
                                        }
                                    >
                                        <Route
                                            path=":id"
                                            element={<CustomerShow />}
                                        />
                                    </Route>
                                    <Route path="/couriers">
                                        <Route
                                            path=""
                                            element={
                                                <CourierList>
                                                    <Outlet />
                                                </CourierList>
                                            }
                                        >
                                            <Route
                                                path="new"
                                                element={<CourierCreate />}
                                            />
                                        </Route>
                                        <Route
                                            path=":id/edit"
                                            element={<CourierEdit />}
                                        />
                                    </Route>
                                </Route>

                                <Route
                                    element={
                                        <Authenticated
                                            key="auth-pages"
                                            fallback={<Outlet />}
                                        >
                                            <NavigateToResource resource="dashboard" />
                                        </Authenticated>
                                    }
                                >
                                    <Route
                                        path="/login"
                                        element={
                                            <AuthPage
                                                type="login"
                                                formProps={{
                                                    defaultValues: {
                                                        email: "demo@refine.dev",
                                                        password: "demodemo",
                                                    },
                                                }}
                                            />
                                        }
                                    />
                                    {/* Other auth routes remain the same */}
                                </Route>
                                {/* Define the logout route to render the Logout component */}
                                <Route path="/logout" element={<Signout />} />

                                <Route
                                    element={
                                        <Authenticated key="catch-all">
                                            <ThemedLayoutV2
                                                Header={Header}
                                                Title={Title}
                                            >
                                                <Outlet />
                                            </ThemedLayoutV2>
                                        </Authenticated>
                                    }
                                >
                                    <Route
                                        path="*"
                                        element={<ErrorComponent />}
                                    />
                                </Route>
                            </Routes>
                            <UnsavedChangesNotifier />
                            <DocumentTitleHandler />
                        </Refine>
                    </RefineSnackbarProvider>
                </ColorModeContextProvider>
            </KBarProvider>
        </BrowserRouter>
    );
};

export default App;
