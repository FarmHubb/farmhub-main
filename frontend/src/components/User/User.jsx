import Profile from './Profile';
import Addresses from './Addresses';
import Orders from './Orders';
import Dashboard from './Dashboard.jsx';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';

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
    setTrigger,
    user,
    profSec,
    setProfSec,
    addressSec,
    setAddressSec,
    userTab,
    setUserTab,
    openSnackbar
}) {

    const isSmallScreen = useMediaQuery(theme => theme.breakpoints.down('md'));
    const orientation = isSmallScreen ? 'horizontal' : 'vertical';

    if (user) {
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
                            {user.role === 'admin' ? <StyledTab label="Dashboard" {...a11yProps(3)} /> : null}
                        </Tabs>
                    </Grid>
                    <Grid item xs={12} md={10}>
                        <TabPanel value={userTab} index={0}>
                            <Profile
                                setTrigger={setTrigger}
                                user={user}
                                openSnackbar={openSnackbar}
                                profSec={profSec}
                                setProfSec={setProfSec}
                            />
                        </TabPanel>
                        <TabPanel value={userTab} index={1}>
                            <Addresses
                                setTrigger={setTrigger}
                                user={user}
                                openSnackbar={openSnackbar}
                                addressSec={addressSec}
                                setAddressSec={setAddressSec}
                            />
                        </TabPanel>
                        <TabPanel value={userTab} index={2}>
                            <Orders user={user} />
                        </TabPanel>
                        {user.role === 'admin' ?
                            <TabPanel value={userTab} index={3}>
                                <Dashboard />
                            </TabPanel>
                            : null
                        }
                    </Grid>
                </Grid>
            </Container>
        );
    }
}