import { Link } from "react-router-dom";
import Box from "@mui/material/Box";

type TitleProps = {
    collapsed: boolean;
};

export const Title: React.FC<TitleProps> = ({ collapsed }) => {
    return (
        <Link to="/">
            <Box
                display="flex"
                alignItems="center"
                gap={"12px"}
                sx={{
                    color: "text.primary",
                }}
            >
                {collapsed ? (
                    //   <FinefoodsLogoIcon />
                    <div>Admin Panel</div>
                ) : (
                    <>
                        <div>Admin Panel</div>
                    </>
                )}
            </Box>
        </Link>
    );
};
