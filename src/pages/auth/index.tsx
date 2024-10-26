import * as React from "react";
import { AuthPage as MUIAuthPage, type AuthProps } from "@refinedev/mui";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";
// Import Cognito and Amplify
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

// Configure Amplify for Cognito
Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID ?? "",
            userPoolClientId:
                import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID ?? "",
        },
    },
});

// Define form fields for sign up and sign in (login)
const formFields = {
    signUp: {
        username: {
            order: 1,
            placeholder: "Choose a username",
            label: "Username",
        },
        email: {
            order: 2,
            placeholder: "Enter your email address",
            label: "Email",
        },
        password: {
            order: 3,
            placeholder: "Enter your password",
            label: "Password",
        },
        confirm_password: {
            order: 4,
            placeholder: "Confirm your password",
            label: "Confirm Password",
        },
    },
    signIn: {
        username: {
            order: 1,
            placeholder: "Enter your username or email",
            label: "Username",
        },
        email: {
            order: 2,
            placeholder: "Enter your email address",
            label: "Email",
        },
        password: {
            order: 3,
            placeholder: "Enter your password",
            label: "Password",
        },
    },
};

const authWrapperProps = {
    style: {
        background:
            "radial-gradient(50% 50% at 50% 50%,rgba(255, 255, 255, 0) 0%,rgba(0, 0, 0, 0.5) 100%),url('images/login-bg.png')",
        backgroundSize: "cover",
    },
};

const renderAuthContent = (content: React.ReactNode) => {
    return (
        <div>
            <Link to="/">
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    gap="12px"
                    marginBottom="16px"
                >
                    {" "}
                    Admin Panel
                    {/* <FinefoodsLogoIcon
                        style={{
                            width: 64,
                            height: 64,
                            color: "#fff",
                        }}
                    />
                    <FinefoodsLogoText
                        style={{
                            color: "#fff",
                            width: "300px",
                            height: "auto",
                        }}
                    /> */}
                </Box>
            </Link>
            {content}
        </div>
    );
};

// Use Authenticator inside AuthPage
export const AuthPage: React.FC<AuthProps> = () => {
    return (
        <MUIAuthPage
            wrapperProps={authWrapperProps}
            renderContent={() => (
                <Authenticator formFields={formFields}>
                    {({ user, signOut }: any) => {
                        if (user) {
                            return (
                                <div>
                                    <p>Welcome, {user.username}</p>
                                    <button onClick={signOut}>Sign Out</button>
                                </div>
                            );
                        } else {
                            return <h1>Please sign in below:</h1>;
                        }
                    }}
                </Authenticator>
            )}
        />
    );
};
