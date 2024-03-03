import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

const AboutUs = () => {
    return (
        <Container sx={{ mt: { xs: 6, sm: 8 } }}>
               <Typography pt={7} variant="h4" gutterBottom
                fontWeight="500"
                fontFamily="Roboto"
                color="cropHeading.main">
                Privacy Policy
            </Typography>
            <Typography variant="body1" paragraph
                paddingBottom={3}
                color="primary"
                gutterBottom
                fontFamily="Roboto"
                fontWeight="bold">
                This Privacy Policy applies to the FarmHub project. This document outlines the types of information that may be collected and recorded by FarmHub and how it may be used.
            </Typography>
            <Typography variant="h5" gutterBottom
                fontWeight="500"
                color="cropHeading.main">
                Information Collection and Use
            </Typography>
            <Typography variant="body1" paragraph
                paddingBottom={3}
                color="primary"
                gutterBottom
                fontFamily="Roboto"
                fontWeight="bold">
                While using FarmHub, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you. Personally identifiable information may include, but is not limited to, your name and email address.
            </Typography>
            <Typography variant="body1" paragraph
                paddingBottom={3}
                color="primary"
                gutterBottom
                fontFamily="Roboto"
                fontWeight="bold">
                We collect this information for the purpose of providing the service, identifying and communicating with you, responding to your requests/inquiries, and improving our services.
            </Typography>
        </Container>
    );
};

export default AboutUs;
