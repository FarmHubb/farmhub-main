import React from 'react'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Link  from '@mui/material/Link';

const OrderSuccess = ({ setUserTab }) => {
    return (
        <Container sx={{ mt: { xs: 6, sm: 8 }, textAlign: 'center', padding: "5vmax" }}>
            <CheckCircleIcon
                    color= "primary"
                sx={{
                    height: '7rem',
                    width:'7rem'
                }}
            />
            <Typography variant="h4"  color="primary">Order Success</Typography>
            <Typography variant='h5' color="primary"> Your Order has been Placed successfully </Typography>
            <Link component={RouterLink} to='/user' onClick={() => setUserTab(2)} underline='none' color="tertiary.main">
            <Typography variant='subtitle1' color="tertiary.main"> View Order </Typography>
            </Link>

        </Container>
    )
}

export default OrderSuccess