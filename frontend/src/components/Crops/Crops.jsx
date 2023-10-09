import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import Container from "@mui/material/Container";
import { Link } from "react-router-dom";

const featuredCrops = [
    {
        name: "Rabi Crops",
        image: "/Images/wheat.jpg",
        link: "/crops/rabi",
    },
    {
        name: "Kharif Crops",
        image: "/Images/rice.jpg",
        link: "/crops/kharif",
    },
    {
        name: "Zaid Crops",
        image: "/Images/muskmelon.jpg",
        link: "/crops/zaid",
    },
];

function Crops() {
    return (
        <Container maxWidth="lg" sx={{ mt: { xs: 6, sm: 8 } }}>
            <Typography
                pt={7}
                variant="h4"
                fontWeight="500"
                color="cropHeading.main"
                gutterBottom
            >
                CROPS
            </Typography>
            <Typography
                paddingBottom={3}
                color="primary"
                gutterBottom
                fontFamily="Roboto"
                fontWeight="bold"
            >
                Here's everything you need to know about a wide range of crops such as
                Rabi, Zaid, Kharif. Browse through these section to get complete
                information and valuable farming tips. This section covers important
                information related to crops such as climate and soils, land
                preparation, seed rate and spacing, crop nutrition management,
                irrigation management, weeds and weed management, harvesting and post
                harvesting measures, plant diseases, how to get a better quality and
                more.
            </Typography>

            <Grid container spacing={5}>
                {featuredCrops.map((crop) => (
                    <Grid
                        component={Link}
                        to={crop.link}
                        item
                        xs={12}
                        md={6}
                        lg={4}
                        display="flex"
                        justifyContent="center"
                        sx={{ textDecoration: "none" }}
                        
                    >
                        <Card 
                        sx={{ 
                        maxWidth: 345, 
                        borderRadius: "1em" , 
                        transition: 'transform 0.4s ease-in-out',
                        boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.5)',
                        '&:hover': {
                        transform: 'translateY(20px)',
                        boxShadow: '0px 7px 10px rgba(0, 0, 0, 0.5)',
                  },
                  }} key={crop.name}>
                            <CardMedia
                                component="img"
                                image={crop.image}
                                alt={crop.name}
                                width={250}
                               
                                height={380}
                                sx={{ objectFit: "cover" }}
                            />
                            <CardContent sx={{
                                
                               backgroundColor:"primary main",
                                p: 2,
                                "&:last-child": {
                                    pb: 2,
                                },
                            }}>
                                <Typography
                                    color="tertiary.main"
                                    variant="h4"
                                    component="div"
                                    textAlign="center"
                                >
                                    {crop.name}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
}

export default Crops;
