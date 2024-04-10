import { createTheme } from "@mui/material";
import { grey } from "@mui/material/colors";

export const theme = createTheme({
    palette: {
        primary: {
            main: grey[50],
            contrastText: "#07412B",
        },
        secondary: {
            main: "#609966",
        },
        tertiary: {
            main: "#00635A",
            contrastText: "#fff",
        },
        homeBtn: {
            main: "#07412B",
            contrastText: "#fff",
        },
        cropHeading: {
            main: "#40513B",
        },
    },
});