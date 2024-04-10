import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PropTypes from 'prop-types';
import { useContext, useState } from 'react';
import { UserAddressContext, UserProfileContext } from '../../contexts/UserContexts.js';
import Addresses from './Addresses.jsx';
import Orders from './Orders/Orders.jsx';
import Profile from './Profile.jsx';

const StyledTab = styled(Tab)(() => ({
    alignItems: 'start',
    textTransform: 'none',
}));

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ px: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function User({
    userTab,
    setUserTab,
}) {

    const userProfile = useContext(UserProfileContext);
    const userAddresses = useContext(UserAddressContext);

    const [profSec, setProfSec] = useState(true);
    const [addressSec, setAddressSec] = useState("view");
    
    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('md'));
    const orientation = isSmallScreen ? 'horizontal' : 'vertical';

    return (
        <Container sx={{ mt: { xs: 6, sm: 8 } }}>
            <Grid container pt={5} rowSpacing={3}>
                <Grid item xs={12} md={2}>
                    <Tabs
                        orientation={orientation}
                        variant="scrollable"
                        value={userTab}
                        onChange={(e, newUserTab) => setUserTab(newUserTab)}
                        aria-label="Vertical tabs example"
                        sx={{ borderRight: 1, borderColor: 'divider' }}
                    >
                        <StyledTab label="Profile" {...a11yProps(0)} onClick={() => setProfSec(true)} />
                        <StyledTab label="Addresses" {...a11yProps(1)} onClick={() => setAddressSec('view')} />
                        <StyledTab label="Orders" {...a11yProps(2)} />
                    </Tabs>
                </Grid>
                <Grid item xs={12} md={10}>
                    <TabPanel value={userTab} index={0}>
                        <Profile
                            userProfile={userProfile}
                            profSec={profSec}
                            setProfSec={setProfSec}
                        />
                    </TabPanel>
                    <TabPanel value={userTab} index={1}>
                        <Addresses
                            userAddresses={userAddresses}
                            addressSec={addressSec}
                            setAddressSec={setAddressSec}
                        />
                    </TabPanel>
                    <TabPanel value={userTab} index={2}>
                        <Orders />
                    </TabPanel>
                </Grid>
            </Grid>
        </Container>
    );
}