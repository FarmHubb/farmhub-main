import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const AboutUs = () => {
    return (
        <Container sx={{ mt: { xs: 6, sm: 8 } }}>
            <Typography pt={7} variant="h4" gutterBottom
                fontWeight="500"
                fontFamily="Roboto"
                color="cropHeading.main"
            >
                Terms and Conditions
            </Typography>
            <Typography variant="body1" paragraph
                paddingBottom={3}
                color="primary"
                gutterBottom
                fontFamily="Roboto"
                fontWeight="bold">
                Welcome to FarmHub!
            </Typography>
            <Typography variant="body1" paragraph
                paddingBottom={3}
                color="primary"
                gutterBottom
                fontFamily="Roboto"
                fontWeight="bold">
                These terms and conditions outline the rules and regulations for the use of FarmHub's Website .
            </Typography>
            <Typography variant="body1" paragraph
                paddingBottom={3}
                color="primary"
                gutterBottom
                fontFamily="Roboto"
                fontWeight="bold">
                By accessing this website we assume you accept these terms and conditions. Do not continue to use FarmHub if you do not agree to take all of the terms and conditions stated on this page.
            </Typography>
            <Typography variant="h5" gutterBottom
                fontWeight="500"
                color="cropHeading.main">
                Acceptable Use
            </Typography>
            <Typography variant="body1" paragraph
                paddingBottom={3}
                color="primary"
                gutterBottom
                fontFamily="Roboto"
                fontWeight="bold">
                You must not use this website in any way that causes, or may cause, damage to the website or impairment of the availability or accessibility of the website; or in any way which is unlawful, illegal, fraudulent or harmful, or in connection with any unlawful, illegal, fraudulent or harmful purpose or activity.
            </Typography>
            <Typography variant="body1" paragraph
                paddingBottom={3}
                color="primary"
                gutterBottom
                fontFamily="Roboto"
                fontWeight="bold">
                You must not use this website to copy, store, host, transmit, send, use, publish or distribute any material which consists of (or is linked to) any spyware, computer virus, Trojan horse, worm, keystroke logger, rootkit or other malicious computer software.
            </Typography>
            <Typography variant="body1" paragraph
                paddingBottom={3}
                color="primary"
                gutterBottom
                fontFamily="Roboto"
                fontWeight="bold">
                You must not conduct any systematic or automated data collection activities (including without limitation scraping, data mining, data extraction and data harvesting) on or in relation to this website without FarmHub's express written consent.
            </Typography>
        </Container>
    );
};

export default AboutUs;
