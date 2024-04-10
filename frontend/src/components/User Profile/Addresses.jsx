import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { startCase } from 'lodash';
import { useContext, useState } from 'react';
import { SetTriggerContext } from '../../contexts/SetTriggerContext';
import { OPEN_SNACKBAR } from '../../hooks/useSnackbar';
import { SnackbarDispatchContext } from '../../contexts/SnackbarContext';

export default function Addresses({
    userAddresses,
    addressSec,
    setAddressSec
}) {

    const dispatchSnackbar = useContext(SnackbarDispatchContext);
    const setTrigger = useContext(SetTriggerContext);
    const [status, setStatus] = useState('success');

    const addressFields = ['area', 'city', 'state', 'country', 'pincode'];
    const [addressValues, setAddressValues] = useState({
        area: '',
        city: '',
        state: '',
        country: '',
        pincode: ''
    });
    const [addressErrors, setAddressErrors] = useState({
        area: '',
        city: '',
        state: '',
        country: '',
        pincode: ''
    });
    const handleChange = (event) => {
        setStatus('typing');
        const { name, value } = event.target;
        setAddressValues((prevValues) => ({ ...prevValues, [name]: value }));
        setAddressErrors((prevValues) => ({ ...prevValues, [name]: value === '' ? 'Required' : '' }));
    };

    function handleAddressSec(section) {
        setAddressErrors(addressFields.reduce((acc, field) => ({ ...acc, [field]: '' }), {}))
        setAddressValues(
            section === 'add'
                ? addressFields.reduce((acc, field) => ({ ...acc, [field]: '' }), {})
                : userAddresses[section]
        );
        setAddressSec(section);
    }

    function updateAddresses(e, addressId, method) {
        e.preventDefault();
        if (method !== 'delete') {
            let error = false;
            addressFields.forEach(field => {
                if (addressValues[field] === '') {
                    setAddressErrors((prevValues) => ({ ...prevValues, [field]: 'Required' }));
                    error = true;
                }
            })
            if(error) return;
        }
        setStatus('submitting');
        const url = `${process.env.REACT_APP_BACKEND_URL}/user/address${addressId ? `/${addressId}` : ''}`;
        const data = method === 'delete' ? {} : addressValues;

        axios({
            method,
            url,
            data,
            withCredentials: true
        })
            .then((response) => {
                if (response.data.errors) {
                    dispatchSnackbar({ type: OPEN_SNACKBAR, payload: { content: 'Changes could not be saved', severity: 'error' } });
                    if (method !== 'delete') setStatus('typing');
                    return;
                }
                setTrigger(prevValue => !prevValue);
                dispatchSnackbar({ type: OPEN_SNACKBAR, payload: { content: 'Changes saved successfully', severity: 'success' } });
                setAddressSec('view');
                setStatus('success');
            })
            .catch((error) => console.log(error));
    }

    return (
        <>
            <Grid container rowSpacing={2}>
                <Grid item xs={12} sm={6}>
                    <Typography variant='h4' color='primary'>
                        {addressSec === 'view' ? 'Addresses' : null}
                        {addressSec === 'add' ? 'Add New Address' : null}
                        {typeof addressSec === 'number' ? 'Edit Address' : null}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={6} display='flex'>
                    <Button
                        sx={{ textTransform: 'none', ml: { sm: 'auto' } }}
                        variant='contained'
                        onClick={() => {
                            addressSec === 'view'
                                ? handleAddressSec('add')
                                : setAddressSec('view'); setStatus('success')
                        }}
                    >
                        {addressSec === 'view' ? 'Add New Address' : 'Back to Addresses'}
                    </Button>
                </Grid>
            </Grid>
            {addressSec === 'view' ?
                <Grid container mt={2} spacing={2}>
                    {userAddresses.map(address => (
                        <Grid item xs={12} sm={6} md={4} key={address._id}>
                            <Card elavation={2} sx={{ display: 'flex', flexDirection: 'column', height: '15em' }}>
                                <CardContent sx={{ mb: 'auto' }}>
                                    <Typography maxHeight='3em' overflow='hidden' gutterBottom>
                                        {address.area}
                                    </Typography>
                                    <Typography>{address.city}</Typography>
                                    <Typography>{address.state}</Typography>
                                    <Typography>{address.country}</Typography>
                                    <Typography>{address.pincode}</Typography>
                                </CardContent>
                                <CardActions>
                                    <IconButton onClick={() => {
                                        handleAddressSec(userAddresses.indexOf(address));
                                    }}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={(e) => updateAddresses(e, address._id, 'delete')}>
                                        <DeleteIcon />
                                    </IconButton>
                                    {status === 'submitting'
                                        ? <CircularProgress sx={{ ml: 3 }} color='tertiary' size='2rem' />
                                        : null
                                    }
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                :
                <Card
                    component="form"
                    noValidate
                    autoComplete="off"
                    onSubmit={
                        (e) => addressSec === 'add'
                            ? updateAddresses(e, null, 'post')
                            : updateAddresses(e, userAddresses[addressSec]._id, 'patch')
                    }
                    sx={{ borderRadius: '0.5rem', mt: 2 }}
                >
                    <CardContent sx={{ px: 4, pb: 0, pt: 3 }}>
                        <Grid
                            container
                            rowSpacing={3}
                            columnSpacing={5}
                        >
                            {addressFields.map(field => (
                                <Grid item xs={12} sm={6} key={field}>
                                    <TextField
                                        color='tertiary'
                                        label={startCase(field)}
                                        name={field}
                                        value={addressValues[field]}
                                        onChange={handleChange}
                                        required
                                        fullWidth
                                        error={addressErrors[field] !== ''}
                                        helperText={addressErrors[field] ? addressErrors[field] : ' '}
                                    />
                                </Grid>
                            ))}
                        </Grid>
                    </CardContent>
                    <CardActions sx={{ px: 4, py: 3 }}>
                        <Button
                            color='tertiary'
                            variant="contained"
                            disabled={status !== 'typing'}
                            type='Submit'
                        >
                            {addressSec === 'add' ? 'Add Address' : 'Edit Address'}
                        </Button>
                        {status === 'submitting'
                            ? <CircularProgress sx={{ ml: 3 }} color='tertiary' size='2rem' />
                            : null
                        }
                    </CardActions>
                </Card>
            }
        </>
    )
}
