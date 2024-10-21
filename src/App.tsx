import { DevtoolsProvider, DevtoolsPanel } from "@refinedev/devtools";
import { Authenticated, Refine } from "@refinedev/core";
import { KBarProvider } from "@refinedev/kbar";
import {
    ErrorComponent,
    useNotificationProvider,
    ThemedLayoutV2,
    RefineSnackbarProvider,
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
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import FastfoodOutlinedIcon from "@mui/icons-material/FastfoodOutlined";
import LabelOutlinedIcon from "@mui/icons-material/LabelOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";
import { DashboardPage } from "./pages/dashboard";
//import { OrderList, OrderShow } from "./pages/orders";
import { CustomerShow, CustomerList } from "./pages/customers";
import { CourierList, CourierCreate, CourierEdit } from "./pages/couriers";
import { AuthPage } from "./pages/auth";
import { ColorModeContextProvider } from "./contexts";
import { Header, Title } from "./components";
import { OrderList } from "./pages/orders/list";
import { OrderShow } from "./pages/orders/show";
//import { useAutoLoginForDemo } from "./hooks";
import AuthProvider from "./authProvider";
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
            <AuthProvider>
                <KBarProvider>
                    <ColorModeContextProvider>
                        <CssBaseline />
                        <GlobalStyles
                            styles={{ html: { WebkitFontSmoothing: "auto" } }}
                        />
                        <RefineSnackbarProvider>
                            <DevtoolsProvider>
                                <Refine
                                    routerProvider={routerProvider}
                                    dataProvider={dataProvider(API_URL)}
                                    i18nProvider={i18nProvider}
                                    options={{
                                        syncWithLocation: true,
                                        warnWhenUnsavedChanges: true,
                                        breadcrumb: false,
                                        useNewQueryKeys: true,
                                        projectId: "m0mGXj-kFuoJe-LTmTJP",
                                    }}
                                    notificationProvider={
                                        useNotificationProvider
                                    }
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
                                            name: "orders",
                                            list: "/orders",
                                            show: "/orders/:id",
                                            meta: {
                                                icon: (
                                                    <ShoppingBagOutlinedIcon />
                                                ),
                                            },
                                        },
                                        {
                                            name: "users",
                                            list: "/customers",
                                            show: "/customers/:id",
                                            meta: {
                                                icon: (
                                                    <AccountCircleOutlinedIcon />
                                                ),
                                            },
                                        },
                                        // {
                                        //     name: "products",
                                        //     list: "/products",
                                        //     create: "/products/new",
                                        //     edit: "/products/:id/edit",
                                        //     show: "/products/:id",
                                        //     meta: {
                                        //         icon: <FastfoodOutlinedIcon />,
                                        //     },
                                        // },
                                        // {
                                        //     name: "categories",
                                        //     list: "/categories",
                                        //     meta: {
                                        //         icon: <LabelOutlinedIcon />,
                                        //     },
                                        // },
                                        // {
                                        //     name: "stores",
                                        //     list: "/stores",
                                        //     create: "/stores/new",
                                        //     edit: "/stores/:id/edit",
                                        //     meta: {
                                        //         icon: <StoreOutlinedIcon />,
                                        //     },
                                        // },
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
                                            list: "/login",
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
                                                                maxWidth:
                                                                    "1200px",
                                                                marginLeft:
                                                                    "auto",
                                                                marginRight:
                                                                    "auto",
                                                            }}
                                                        >
                                                            <Outlet />
                                                        </Box>
                                                    </ThemedLayoutV2>
                                                </Authenticated>
                                            }
                                        >
                                            <Route
                                                index
                                                element={<DashboardPage />}
                                            />

                                            <Route path="/orders">
                                                <Route
                                                    index
                                                    element={<OrderList />}
                                                />
                                                <Route
                                                    path=":id"
                                                    index
                                                    element={<OrderShow />}
                                                />
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

                                            {/* <Route
                                                path="/products"
                                                element={
                                                    <ProductList>
                                                        <Outlet />
                                                    </ProductList>
                                                }
                                            >
                                                <Route
                                                    path=":id/edit"
                                                    element={<ProductEdit />}
                                                />
                                                <Route
                                                    path="new"
                                                    element={<ProductCreate />}
                                                />
                                            </Route> */}

                                            {/* <Route path="/stores">
                                            <Route
                                                index
                                                element={<StoreList />}
                                            />
                                            <Route
                                                path="new"
                                                element={<StoreCreate />}
                                            />
                                            <Route
                                                path=":id/edit"
                                                element={<StoreEdit />}
                                            />
                                        </Route>

                                        <Route
                                            path="/categories"
                                            element={<CategoryList />}
                                        />
                                        */}

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
                                                        element={
                                                            <CourierCreate />
                                                        }
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
                                                                password:
                                                                    "demodemo",
                                                            },
                                                        }}
                                                    />
                                                }
                                            />
                                            <Route
                                                path="/register"
                                                element={
                                                    <AuthPage
                                                        type="register"
                                                        formProps={{
                                                            defaultValues: {
                                                                email: "demo@refine.dev",
                                                                password:
                                                                    "demodemo",
                                                            },
                                                        }}
                                                    />
                                                }
                                            />
                                            <Route
                                                path="/forgot-password"
                                                element={
                                                    <AuthPage
                                                        type="forgotPassword"
                                                        formProps={{
                                                            defaultValues: {
                                                                email: "demo@refine.dev",
                                                            },
                                                        }}
                                                    />
                                                }
                                            />
                                            <Route
                                                path="/update-password"
                                                element={
                                                    <AuthPage type="updatePassword" />
                                                }
                                            />
                                        </Route>

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
                                <DevtoolsPanel />
                            </DevtoolsProvider>
                        </RefineSnackbarProvider>
                    </ColorModeContextProvider>
                </KBarProvider>
            </AuthProvider>
        </BrowserRouter>
    );
};

export default App;
