import React from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import { CardActionArea, IconButton } from "@mui/material";
import TwitterIcon from "@mui/icons-material/Twitter";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";

//Content array for cards
const profiles = [
  {
    name: "MOHAMMAD ARSHAD KHAN",
    image: "/Images/arshad.jpg",
    twitter: "https://twitter.com/marshadkhn ",
  },
  {
    name: "ADITYA KUMAR MISHRA",
    image: "/Images/aditya.jpeg",
    twitter: "https://twitter.com/Aditya_m037",
  },
  {
    name: "ABDUL MANNAN",
    image: "/Images/abdul.jpg",
    twitter: "https://twitter.com/Abdul_365m",
  },
  {
    name: "ANKIT KUMAR SHARMA",
    image: "/Images/ankit.jpeg",
    twitter: "https://twitter.com/AnkitKumar30461",
  },
];

const AboutUs = () => {
    return (
        <Container sx={{ mt: { xs: 6, sm: 8 } }}>
            <Typography
                pt={7}
                variant="h4"
                fontWeight="500"
                fontFamily="Roboto"
                color="cropHeading.main"
                gutterBottom
            >
                ABOUT US
            </Typography>
            <Typography
                paddingBottom={3}
                color="primary"
                gutterBottom
                fontFamily="Roboto"
                fontWeight="bold"
            >
                Welcome to FarmHub, your one-stop-shop for fresh, locally available products. At FarmHub, we are passionate about sustainable agriculture and committed to quality. We use sustainable and organic farming practices to grow a wide variety of fruits and vegetables. In addition to our farm stand, we also participate in local farmers' markets and offer a range of alternative pesticides and other agriculture methods to enhance your crop. We also provide help for new customers that are new on our website. We are proud of being able to contribute a little the vast domain like agricultural.
            </Typography>

            {/* Mission section start */}
            <Typography
                variant="h5"
                fontWeight="500"
                color="cropHeading.main"
                gutterBottom
            >
                OUR MISSION
            </Typography>
            <Grid container spacing={1}>
                <Grid item xs={12} sm={9} sx={{ display: "flex", flexDirection: "column", width: "85%" }}>
                    <Typography color="primary" fontFamily="Roboto" fontWeight="bold">
                        Our mission at FarmHub is to empower farmers and agricultural communities by providing them with the tools and resources they need to thrive. We aim to connect farmers with the latest technology, research, and best practices in sustainable agriculture, while also fostering a strong community of like-minded individuals who are passionate about building a better future for our planet. Through our platform, we hope to create a more resilient and sustainable food system that benefits everyone.
                    </Typography>
                    <br />
                    <Typography color="primary" fontFamily="Roboto" fontWeight="bold">
                        Farmhub aims is to revolutionize the way the world thinks about agriculture. We believe that by harnessing the power of technology and innovation, we can create a more sustainable and equitable food system for all. Our platform connects farmers with the resources they need to succeed, from cutting-edge research and best practices to a supportive community of peers. By working together, we can build a brighter future for our planet and its people
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                    <Box
                        sx={{
                            borderRadius: "1rem",
                            objectFit: "cover",
                            width: "100%",
                        }}
                        component="img"
                        src="/Images/about-us-image.jpg"
                    />
                </Grid>
            </Grid>
            {/* Mission section end */}

            {/* Service Start*/}
            <Typography
                variant="h5"
                fontWeight="500"
                color="cropHeading.main"
                gutterBottom
            >
                SERVICES
            </Typography>
            <Grid container spacing={1} sx={{ display: "flex" }}>
                <Grid item xs={12} sm={3}>
                    <Box
                        sx={{
                            borderRadius: "1rem",
                            objectFit: "cover",
                            width: "100%",
                            height: "100%",
                        }}
                        component="img"
                        src="/Images/serice-about-us.jpg"
                    />
                </Grid>
                <Grid
                    item xs={12} sm={9}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        width: "85%",
                        paddingLeft: "2%",
                        paddingTop: "5%"
                    }}
                >
                    <Typography color="primary" fontFamily="Roboto" fontWeight="bold">
                        1. Agricultral products
                    </Typography>
                    <br />
                    <Typography color="primary" fontFamily="Roboto" fontWeight="bold">
                        2. Place of Information
                    </Typography>
                    <br />

                    <Typography color="primary" fontFamily="Roboto" fontWeight="bold">
                        3. Place for relaiters
                    </Typography>
                    <br />

                    <Typography color="primary" fontFamily="Roboto" fontWeight="bold">
                        4. Friend of a new farmer
                    </Typography>
                </Grid>
            </Grid>
            {/* Service end*/}

            {/* Profiles section start */}
            <Typography
                pt={7}
                variant="h5"
                fontWeight="500"
                fontFamily="Roboto"
                color="cropHeading.main"
                gutterBottom
                align='center'
            >
                Maintainers
            </Typography>
            <Grid container spacing={5}>
                {profiles.map((profile) => (
                    <Grid item xs={12} sm={6} md={3} display="flex" justifyContent="center">
                        <Card sx={{ maxWidth: 345, width: "15rem" }}>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    height="270"
                                    image={profile.image}
                                    alt="green iguana"
                                />
                                <CardContent
                                    sx={{ display: "flex", alignItems: "center", height: "4rem" }}
                                >
                                    <Typography
                                        sx={{ mr: "auto" }}
                                        gutterBottom
                                        variant="h6"
                                        component="div"
                                    >
                                        {profile.name}
                                    </Typography>
                                    <IconButton
                                        component={Link}
                                        to={profile.twitter}
                                        aria-label="delete"
                                        sx={{ color: "#00a2f5" }}
                                    >
                                        <TwitterIcon />
                                    </IconButton>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {/* Profiles section end */}
        </Container>
    );
};

export default AboutUs;
