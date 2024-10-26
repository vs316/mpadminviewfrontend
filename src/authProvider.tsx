import React, { ReactNode } from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import LogoutIcon from "@mui/icons-material/Logout";

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID ?? "",
            userPoolClientId:
                import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID ?? "",
        },
    },
});

// Define form fields for sign-up and sign-in (login)
const formFields = {
    signUp: {
        username: {
            order: 1,
            placeholder: "Choose a username",
            label: "Username",
            inputProps: { required: true },
        },
        email: {
            order: 2,
            placeholder: "Enter your email address",
            label: "Email",
            inputProps: { type: "email", required: true },
        },
        password: {
            order: 3,
            placeholder: "Enter your password",
            label: "Password",
            inputProps: { type: "password", required: true },
        },
        confirm_password: {
            order: 4,
            placeholder: "Confirm your password",
            label: "Confirm Password",
            inputProps: { type: "password", required: true },
        },
    },
    signIn: {
        username: {
            order: 1,
            placeholder: "Enter your username or email",
            label: "Username",
            inputProps: { required: true },
        },
        email: {
            order: 2,
            placeholder: "Enter your email address",
            label: "Email",
            inputProps: { type: "email", required: true },
        },
        password: {
            order: 3,
            placeholder: "Enter your password",
            label: "Password",
            inputProps: { type: "password", required: true },
        },
    },
};

interface AuthProviderProps {
    children: ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
    return (
        <div>
            <Authenticator formFields={formFields}>
                {({ user, signOut }: any) => {
                    if (user) {
                        return (
                            <div>
                                <button onClick={signOut}>Sign Out</button>
                                <div>{children}</div>
                                {/* Adding the Logout icon here */}
                                <div
                                    onClick={signOut} // Handle logout on icon click
                                    style={{
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                    }}
                                >
                                    <LogoutIcon />
                                    <span style={{ marginLeft: "8px" }}>
                                        Logout
                                    </span>
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div>
                                <h1>Please sign in below:</h1>
                            </div>
                        );
                    }
                }}
            </Authenticator>
        </div>
    );
};

export default AuthProvider;
