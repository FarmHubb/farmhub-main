import React, { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Stepper from '@mui/material/Stepper';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import LibraryAddCheckIcon from '@mui/icons-material/LibraryAddCheck';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import { styled } from '@mui/material/styles';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import Shipping from "./Shipping";
import ConfirmOrder from "./ConfirmOrder";
import Payment from "./Payment";

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                'linear-gradient( 136deg, #00635A 0%, #00635A 50%, #00635A 100%)',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                'linear-gradient( 136deg, #00635A 0%, #00635A 50%, #00635A 100%)',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor:
            theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderRadius: 1,
    },
}));

const ColorlibStepIconRoot = styled('div')(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
        backgroundImage:
            'linear-gradient( 136deg, #00635A 0%, #00635A 50%, #00635A 100%)',
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
    }),
    ...(ownerState.completed && {
        backgroundImage:
            'linear-gradient( 136deg, #00635A 0%, #00635A 50%, #00635A 100%)',
    }),
}));

function ColorlibStepIcon(props) {
    const { active, completed, className } = props;

    const icons = {
        1: <LocalShippingIcon />,
        2: <LibraryAddCheckIcon />,
        3: <AccountBalanceIcon />,
    };

    return (
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
            {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
    );
}

const CheckoutSteps = ({ user, setTrigger, setUserTab }) => {

    const [addressIndex, setAddressIndex] = useState(null)

    const steps = [
        {
            label: <Typography>Shipping Details</Typography>,

        },
        {
            label: <Typography>Confirm Order</Typography>,

        },
        {
            label: <Typography>Payment</Typography>,

        },
    ];
    
    const [activeStep, setActiveStep] = useState(0)

    const [orderCharges, setOrderCharges] = useState(null);

    useEffect(() => {
        if(!user) return;

        let subtotal = user.cart.reduce(
            (acc, item) => acc + item.quantity * item.product.price,
            0
        );

        let shippingCharges = subtotal > 1500 ? 0 : 60;

        let tax = subtotal * 0.18;

        let totalPrice = subtotal + tax + shippingCharges;

        setOrderCharges({
            subtotal: subtotal,
            shippingCharges: shippingCharges,
            tax: tax,
            totalPrice: totalPrice
        })
    }, [user])

    if(!orderCharges) return null;

    return (
        <Container sx={{ mt: { xs: 7, sm: 11 } }}>
            <Stepper alternativeLabel activeStep={activeStep} connector={<ColorlibConnector />} >
                {steps.map((item, index) => (
                    <Step
                        key={index}
                        active={activeStep === index ? true : false}
                        completed={activeStep >= index ? true : false}
                    >
                        <StepLabel
                            style={{
                                color: activeStep >= index ? "tertiary.main" : "rgba(0, 0, 0, 0.649)",
                            }}
                            StepIconComponent={ColorlibStepIcon}
                        >
                            {item.label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
            {
                activeStep === 0 ?
                    <Shipping 
                        user={user} 
                        setActiveStep={setActiveStep} 
                        addressIndex={addressIndex} 
                        setAddressIndex={setAddressIndex}
                        setUserTab={setUserTab}
                    />
                    : null
            }
            {
                activeStep === 1 ?
                    <ConfirmOrder 
                        user={user}
                        orderCharges={orderCharges}
                        setActiveStep={setActiveStep} 
                        shippingAddress={user.addresses[addressIndex]}
                    />
                    : null}
            {
                activeStep === 2 ?
                    <Payment 
                        user={user}
                        orderCharges={orderCharges}
                        setTrigger={setTrigger} 
                        setActiveStep={setActiveStep} 
                        shippingAddress={user.addresses[addressIndex]}
                    />
                    : null
            }
        </Container>
    );
};

export default CheckoutSteps;