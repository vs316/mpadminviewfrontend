import React from "react";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import LogoutIcon from "@mui/icons-material/Logout";
import { Button, Box } from "@mui/material";

Amplify.configure({
    Auth: {
        Cognito: {
            userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID ?? "",
            userPoolClientId:
                import.meta.env.VITE_COGNITO_USER_POOL_CLIENT_ID ?? "",
        },
    },
});

const SignOut = () => {
    return (
        <Authenticator
            initialState="signIn"
            services={{
                async handleSignIn(input: any): Promise<any> {
                    // Redirect to dashboard after successful sign in
                    window.location.href = "/";
                    return {}; // Return an empty object to satisfy the return type
                },
            }}
        >
            {({ user, signOut }: any) => (
                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    mt={4}
                >
                    {user ? (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={signOut}
                            startIcon={<LogoutIcon />}
                            sx={{
                                fontSize: "16px",
                                fontWeight: "bold",
                                color: "#fff",
                                padding: "8px 16px",
                                marginTop: "16px",
                            }}
                        >
                            Sign Out
                        </Button>
                    ) : null}
                </Box>
            )}
        </Authenticator>
    );
};

export default SignOut;
