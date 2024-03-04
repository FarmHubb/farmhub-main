import React from 'react';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';




const Shipping = ({ user, setActiveStep, addressIndex, setAddressIndex, setUserTab }) => {



    const ChangeAddress = (addressI) => {
        setAddressIndex(addressI)

    }

    if (user) {
        return (
            <Container sx={{ mt: { xs: 6, sm: 8 } }}>

                <Typography variant="h4" mt={4} mb={3} className="shippingHeading" color="primary">Shipping Details</Typography>
                <Card border={1} sx={{
                    marginBottom: 5,
                    borderRadius: "1rem"
                }}>
                    <CardContent>
                        <Typography variant="h5" ml={3} mt={3} className="shippingHeading" color="tertiary.main">Choose Delivery Address</Typography>
                        <Grid container my={2} spacing={2}>
                            {user.addresses.map(address => (
                                <Grid item xs={12} sm={6} md={3} key={address._id}>
                                    <Card
                                        elavation={2}
                                        onClick={
                                            () => ChangeAddress(user.addresses.indexOf(address))
                                        }
                                        sx={{
                                            backgroundColor: "primary.dark",
                                            display: 'flex',
                                            flexDirection: 'column',
                                            height: '13em',
                                            borderRadius: "1rem",
                                            boxSizing: 'border-box',
                                            border: user.addresses.indexOf(address) === addressIndex ? '2px solid #00635A' : '',
                                        }}
                                    >
                                        <CardContent sx={{ mb: 'auto' }}>
                                            <Typography maxHeight='3em' overflow='hidden' gutterBottom>
                                                {address.area}
                                            </Typography>
                                            <Typography>{address.city}</Typography>
                                            <Typography>{address.state}</Typography>
                                            <Typography>{address.country}</Typography>
                                            <Typography>{address.pincode}</Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <Button component={Link} to='/user' onClick={() => setUserTab(1)} color='tertiary' variant='contained'>
                            Add Addresss
                        </Button>
                    </CardContent>
                </Card>
                <Button disabled={addressIndex === null} onClick={() => setActiveStep(1)} size='large' sx={{ textTransform: 'none' }} color='tertiary' variant='contained'>
                    Confirm Order
                </Button>

            </Container>
        );
    }
};

export default Shipping