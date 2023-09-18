import React from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";


const Weather = ({ weatherDetails, setWeatherDetails, place, setPlace, weather }) => {



    if (!weatherDetails) return null;
    return (
        <Container sx={{
            mt: { xs: 6, sm: 8 },
            textAlign: 'center',
            padding: "5vmax",
            // background:"red",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
        }}>
            <Box display="flex" alignItems='center' justifyContent='center' m={2} mx='auto' 
                sx={{ width: { xs: '100%', md: "50%" } }}>
                <TextField
                    type="text"
                    placeholder="Search"
                    value={place}
                    onChange={(e) => setPlace(e.target.value)}
                    fullWidth
                />
                <Button
                    onClick={() => weather.search()}
                    size='large'
                    sx={{
                        textTransform: 'none',
                        marginLeft: "2rem",
                        padding: ".9rem"
                    }}
                    color='tertiary'
                    variant='contained'
                >
                    Search
                </Button>
            </Box>
            <Card sx={{
                width: { xs: '100%', md: "50%" },
                padding:"2rem",
                boxSizing: "border-box",
                whiteSpace: 'wrap',
                // overflow: 'hidden',
                textOverflow: 'ellipsis',
                backgroundImage: "linear-gradient( rgb(87, 200, 77) rgb(131, 212, 117) rgb(171, 224, 152))",
                boxShadow: "9px 16px 21px ",
            }}>
                <Typography variant="h2" color="tertiary.main" fontFamily="Roboto" fontWeight="bold" >
                    Weather in {weatherDetails.city}
                </Typography>
                <Typography variant="h3" color="tertiary.main" fontFamily="Roboto" fontWeight="bold" >
                    {weatherDetails.temp}
                </Typography>
                <Box display='flex' alignItems='center' justifyContent='center'>
                    <img src={weatherDetails.icon} alt="" />
                    <Typography variant="h4" color="tertiary.main" fontFamily="Roboto" fontWeight="bold" >
                        {weatherDetails.description}
                    </Typography>
                </Box>
                <Typography variant="h4" color="tertiary.main" fontFamily="Roboto" fontWeight="bold" >
                    Humidity: {weatherDetails.humidity}
                </Typography>
                <Typography variant="h4" color="tertiary.main" fontFamily="Roboto" fontWeight="bold" >
                    Wind speed: {weatherDetails.wind}
                </Typography>
            </Card>

        </Container>
    );
};


export default Weather;
