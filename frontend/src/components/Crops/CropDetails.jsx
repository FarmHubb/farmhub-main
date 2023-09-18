import { useEffect, useState } from "react";
import { Link as RouterLink, useParams } from "react-router-dom";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import rabi from "./rabi.json";
import kharif from "./kharif.json";
import zaid from "./zaid.json";

function CropDetail() {
    const { season } = useParams();
    const [crops, setCrops] = useState(null);

    useEffect(() => {
        if (season === "rabi") setCrops(rabi);
        else if (season === "kharif") setCrops(kharif);
        else setCrops(zaid);
    }, [season]);

    if (crops)
        return (
            <Container sx={{ mt: { xs: 6, sm: 8 } }}>
                <Typography
                    pt={7}
                    variant="h3"
                    fontWeight="500"
                    color="cropHeading.main"
                    gutterBottom
                >
                    {crops.name} Crops
                </Typography>
                <Typography
                    variant="h6"
                    fontWeight="400"
                    paddingBottom={3}
                    color="primary"
                    gutterBottom
                >
                    {crops.description}
                </Typography>

                <Grid container spacing={{ xs: 8, md: 15 }} pt={5}>
                    {crops.category.map((crop) => (
                        <Grid
                            item
                            container
                            spacing={{ xs: 5, md: 8 }}
                            sx={{
                                flexDirection: {
                                    sm:
                                        crops.category.indexOf(crop) % 2 === 0 ? "row-reverse" : "",
                                },
                            }}
                        >
                            <Grid item xs={12} sm={8}>
                                <Box
                                    sx={{
                                        borderRadius: "1rem",
                                        height: "30em",
                                        objectFit: "cover",
                                    }}
                                    component="img"
                                    src={crop.image}
                                    width="100%"
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Box height="30em">
                                    <Typography variant="h4" color="cropHeading.main">
                                        {crop.name}
                                    </Typography>
                                    {season !== "zaid" ? (
                                        <List
                                            sx={{
                                                width: "50%",
                                                height: "26em",
                                                display: "flex",
                                                flexDirection: "column",
                                                flexWrap: "wrap",
                                            }}
                                        >
                                            {crop.crops.map((crop) => (
                                                <ListItem component={RouterLink} to="/" disablePadding>
                                                    <ListItemIcon sx={{ minWidth: "30px" }}>
                                                        <FiberManualRecordIcon
                                                            sx={{
                                                                color: "primary.main",
                                                                fontSize: "small",
                                                            }}
                                                        />
                                                    </ListItemIcon>
                                                    <Link
                                                        href="/"
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            window.location.href = crop.link;
                                                            return null;
                                                        }}
                                                        underline="hover"
                                                        sx={{ color: "primary.main" }}
                                                    >
                                                        <ListItemText
                                                            primaryTypographyProps={{
                                                                style: { color: "white" },
                                                            }}
                                                            primary={crop.name}
                                                        />
                                                    </Link>
                                                </ListItem>
                                            ))}
                                        </List>
                                    ) : (
                                        crop.crops.map((crop) => (
                                            <>
                                                <Typography mt={4} variant="subtitle1" color="primary">
                                                    {crop.name}
                                                </Typography>

                                                <Link
                                                    href="/"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        window.location.href = crop.link;
                                                        return null;
                                                    }}
                                                    underline="none"
                                                    sx={{ color: "tertiary.main" }}
                                                >
                                                    Read more
                                                </Link>
                                                {/* <Link component={RouterLink} to={crop.link} color='tertiary.main'>Read more</Link> */}
                                            </>
                                        ))
                                    )}
                                </Box>
                            </Grid>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        );
    return null;
}

export default CropDetail;
