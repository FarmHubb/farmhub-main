// import { useState } from 'react'
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';
// import LanguageIcon from '@mui/icons-material/Language';
// import InputLabel from '@mui/material/InputLabel';
// import MenuItem from '@mui/material/MenuItem';
// import FormControl from '@mui/material/FormControl';
// import Select from '@mui/material/Select';
import Link from '@mui/material/Link';
import { Link as RouterLink } from 'react-router-dom';

const StyledBox = styled(Box)({
    position: 'relative',
    '&::before': {
        content: '""',
        display: 'block',
        position: 'absolute',
        left: 0,
        top: 0,
        width: '100%',
        height: '100%',
        opacity: 0.8,
        backgroundImage: `url(/Images/combine.jpg)`,
        filter: 'brightness(50%)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
        backgroundSize: 'cover'
    }
});
const styles = {
    link: {
      color: 'primary',
      textDecoration: 'none',
      transition: 'color 0.3s ease', // Smooth transition for the color change
     
    },
    instagram:{
        '&:hover': {
            color: '#d62976',
           
          },
    },
    linkedin:{
        '&:hover': {
            color: '#0072b1', // Change this to the desired hover color
          },
    }
  };
// const LanguageSelect = styled(Select)({
//     '& .MuiOutlinedInput-notchedOutline': {
//         borderColor: 'white',
//     },
//     '&:hover .MuiOutlinedInput-notchedOutline': {
//         borderColor: 'white',
//     },
//     '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
//         borderColor: 'white',
//     },
//     '& .MuiSvgIcon-root': {
//         fill: 'white',
//     },
//     '& .MuiSelect-root': {
//         color: 'white',
//     },
// });

export default function BasicGrid() {

    // const [lang, setLang] = useState('English');

    return (
        <StyledBox>
            <Box component='div' position='relative' color='white' mt={8} pt={8} pb={2}>
                <Container>
                    <Grid container columnSpacing={4} rowSpacing={8}>
                        <Grid item xs={12} sm={6} md={4}>
                            <img src="/Images/main-logo.png" alt='FarmHub Logo' style={{ width: '35%' }} />
                            <List>
                                <ListItem disablePadding> <ListItemText primary="Invertis University Bareilly , Uttar Pradesh" /> </ListItem>
                                <ListItem disablePadding> <ListItemText primary="Email: farm4hub@gmail.com" /> </ListItem>
                                {/* <ListItem disablePadding> <ListItemText primary="Phone: +1 1123 456 780" /> </ListItem> */}
                            </List>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant='h6'>QUICK LINKS</Typography>
                            <List>
                                <ListItem disablePadding>
                                    <Link component={RouterLink} to='/' color='primary.main' underline='hover'>
                                        <ListItemText primary="Home" />
                                    </Link>
                                </ListItem>
                                <ListItem disablePadding> 
                                    <Link component={RouterLink} to='/about-us' color='primary.main' underline='hover'>
                                        <ListItemText primary="About us"/>
                                    </Link> 
                                </ListItem>
                                <ListItem disablePadding>
                                    <Link component={RouterLink} to='/crops' color='primary.main' underline='hover'>
                                        <ListItemText primary="Crops" />
                                    </Link>
                                </ListItem>
                                <ListItem disablePadding> 
                                    <Link component={RouterLink} to='/weather' color='primary.main' underline='hover'>
                                        <ListItemText primary="Weather"/>
                                    </Link> 
                                </ListItem>
                                <ListItem disablePadding> 
                                    <Link component={RouterLink} to='/doseCalculator' color='primary.main' underline='hover'>
                                        <ListItemText primary="Dose Calculator"/>
                                    </Link> 
                                </ListItem>
                                <ListItem disablePadding> 
                                    <Link component={RouterLink} to='/termsAndConditions' color='primary.main' underline='hover'>
                                        <ListItemText primary="Terms & Conditions"/>
                                    </Link> 
                                </ListItem>
                                <ListItem disablePadding> 
                                    <Link component={RouterLink} to='/privacyPolicy' color='primary.main' underline='hover'>
                                        <ListItemText primary="Privacy Policy"/>
                                    </Link> 
                                </ListItem>
                            </List>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Typography variant='h6' gutterBottom>SOCIAL LINKS</Typography>
                            <Link component={RouterLink} to='https://www.linkedin.com/in/farm-hub-6843a1272/'  sx={{ ...styles.link, ...styles.linkedin }}><LinkedInIcon fontSize="large"/></Link>
                            <Link component={RouterLink} to='https://www.instagram.com/farm.hub4/' sx={{ ...styles.link, ...styles.instagram}}><InstagramIcon sx={{ ml: 1 }} fontSize="large"  /></Link>
                            <Box id ="google_translate_element"></Box>
                            {/* <Box mt={5}>
                                <FormControl sx={{ minWidth: '8em' }}>
                                    <InputLabel id="demo-simple-select-label" sx={{ color: 'primary.main' }}>
                                        Language
                                    </InputLabel>
                                    <LanguageSelect
                                        value={lang}
                                        label="Language"
                                        onChange={(event) => { setLang(event.target.value) }}
                                        sx={{
                                            color: 'primary.main',
                                            width: '10rem',
                                            pl: 4
                                        }}
                                        MenuProps={{
                                            disableScrollLock: true,
                                        }}
                                    >
                                        <MenuItem value='English'>English</MenuItem>
                                        <MenuItem value='Hindi'>Hindi</MenuItem>
                                    </LanguageSelect>
                                    <LanguageIcon sx={{ position: 'absolute', top: '0.64em', left: '0.5em' }} />
                                </FormControl>
                            </Box> */}
                        </Grid>
                        <Grid item xs={12}>
                            <Typography variant='subtitle2' align='center'>
                                2023 All Rights Reserved,Developed By FarmHub
                            </Typography>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </StyledBox>
    );
}




