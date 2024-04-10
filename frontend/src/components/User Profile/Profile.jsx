import EditIcon from '@mui/icons-material/Edit';
import { IconButton } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { startCase } from 'lodash';
import { useContext, useState } from 'react';
import { isEmail, isMobilePhone } from 'validator';
import { SetTriggerContext } from '../../contexts/SetTriggerContext';
import { OPEN_SNACKBAR } from '../../hooks/useSnackbar';
import { SnackbarDispatchContext } from '../../contexts/SnackbarContext';

export default function Profile({
    userProfile,
    profSec,
    setProfSec
}) {

    const dispatchSnackbar = useContext(SnackbarDispatchContext);
    const setTrigger = useContext(SetTriggerContext);
    const [status, setStatus] = useState('success');

    const userFields = ['name', 'email', 'phoneNumber'];

    const [userValues, setUserValues] = useState({
        avatar: null,
        avatarSrc: userProfile.avatar ? userProfile.avatar.data : null,
        name: userProfile.name,
        email: userProfile.email,
        phoneNumber: userProfile.phoneNumber,
    });

    const [userErrors, setUserErrors] = useState({
        name: '',
        email: '',
        phoneNumber: ''
    });

    const handleChange = (e) => {
        setStatus('typing');
        setUserValues(() => ({
            ...userValues,
            [e.target.name]: e.target.value,
        }));
        setUserErrors(() => ({
            ...userErrors,
            [e.target.name]: e.target.value === '' ? 'Required' : ''
        }));
    };

    const validateChange = (e) => {
        let newUserErrors = { ...userErrors };

        if (e.target.name === 'phoneNumber') {
            if (!isMobilePhone(userValues.phoneNumber, 'en-IN'))
                newUserErrors.phoneNumber = 'Invalid Phone Number';
        }
        else if (e.target.name === 'email') {
            if (!isEmail(userValues.email)) newUserErrors.email = 'Invalid email';
        }

        if (newUserErrors !== userErrors) setUserErrors(newUserErrors);
    }

    const handleAvatarUpload = (e) => {
        setStatus('typing');
        const file = e.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        setUserValues((prevValues) => ({
            ...prevValues,
            avatar: file,
            avatarSrc: imageUrl,
        }));
    }

    function updateUser(e) {
        e.preventDefault();
        const focusedElement = document.activeElement;
        if (focusedElement && focusedElement.blur) focusedElement.blur();
        userFields.forEach(field => {
            validateChange({ target: { name: field } });
        });
        if (Object.values(userErrors).some(value => value !== '')) return;
        setStatus('submitting');

        const formData = new FormData();
        if (userValues.avatar) formData.append('avatar', userValues.avatar);
        formData.append('name', userValues.name);
        formData.append('email', userValues.email);
        formData.append('phoneNumber', userValues.phoneNumber);

        axios.patch(
            `${process.env.REACT_APP_BACKEND_URL}/user/customer`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true })
            .then((response) => {
                if (response.data.errors) {
                    dispatchSnackbar({
                        type: OPEN_SNACKBAR,
                        payload: { content: 'Changes could not be saved', severity: 'error' }
                    });
                    setStatus('typing');
                    return;
                }
                if (response.data.keyPattern) {
                    let key = response.data.keyPattern;
                    setUserErrors((prevValues) => ({
                        ...prevValues,
                        email: key.email ? 'Email already registered' : '',
                        phoneNumber: key.phoneNumber ? 'Phone number already registered' : ''
                    }));
                    setStatus('typing');
                    return;
                }
                setTrigger(prevValue => !prevValue);
                dispatchSnackbar({
                    type: OPEN_SNACKBAR,
                    payload: { content: 'Changes saved successfully', severity: 'success' }
                });
                setStatus('success');
            })
            .catch((error) => {
                console.log(error);
                setStatus('typing')
                dispatchSnackbar({
                    type: OPEN_SNACKBAR,
                    payload: { content: 'Changes could not be saved', severity: 'error' }
                });
            })
    }

    const passFields = ['oldPass', 'newPass', 'confirmNewPass'];

    const [updatePass, setUpdatePass] = useState({
        oldPass: '',
        newPass: '',
        confirmNewPass: '',
    });

    const [passErrors, setPassErrors] = useState({
        oldPass: '',
        newPass: '',
        confirmNewPass: '',
    });

    const changePassValues = (e) => {
        setStatus('typing');
        setUpdatePass(() => ({
            ...updatePass,
            [e.target.name]: e.target.value,
        }));
        setPassErrors(() => ({
            ...passErrors,
            [e.target.name]: e.target.value === '' ? 'Required' : ''
        }));
    };

    const validatePass = (e) => {
        let newPassErrors = { ...passErrors };

        if (e.target.name === 'oldPass') {
            if (updatePass.oldPass.length < 6)
                newPassErrors.oldPass = 'Password must contain at least 6 characters';
        }

        else if (e.target.name === 'newPass') {
            if (updatePass.newPass.length < 6)
                newPassErrors.newPass = 'Password must contain at least 6 characters';
            if (updatePass.confirmNewPass !== '' && updatePass.newPass !== updatePass.confirmNewPass)
                newPassErrors.confirmNewPass = 'Passwords do not match';
        }
        else if (e.target.name === 'confirmNewPass') {
            if (updatePass.newPass !== updatePass.confirmNewPass)
                newPassErrors.confirmNewPass = 'Passwords do not match';
        }

        if (newPassErrors !== passErrors) setPassErrors(newPassErrors);
    }

    async function submitPass(e) {
        e.preventDefault();

        if (passFields.some(field => updatePass[field] === '')) {
            let newPassErrors = { ...passErrors };
            passFields.forEach(field => {
                if (updatePass[field] === '')
                    newPassErrors[field] = 'Required';
            });
            setPassErrors(newPassErrors);
            return;
        }

        if (Object.values(passErrors).some(value => value !== '')) return;

        const PassDetails = {
            oldPassword: updatePass.oldPass,
            password: updatePass.newPass,
        };

        axios.patch(`${process.env.REACT_APP_BACKEND_URL}/user/password/change`, PassDetails, { withCredentials: true })
            .then((response) => {
                if (response.data.message === 'Old password is incorrect') {
                    setPassErrors(() => ({
                        ...passErrors,
                        oldPass: 'Old password is incorrect'
                    }));
                    return;
                }
                dispatchSnackbar('Password changed successfully', 'success');
            })
            .catch((error) => console.log(error));
    }

    return (
        <>
            <Stack direction='row'>
                <Typography variant='h4' mr='auto' color='primary' fontWeight='bold'>
                    {profSec ? 'Profile' : 'Change Password'}
                </Typography>
                {!profSec ?
                    <Button
                        sx={{ textTransform: 'none' }}
                        variant='contained'
                        onClick={() => {
                            setProfSec(true);
                        }}
                    >
                        Back to Profile
                    </Button>
                    : null
                }
            </Stack>
            <Card
                component="form"
                noValidate
                autoComplete="off"
                onSubmit={profSec ? updateUser : submitPass}
                sx={{ borderRadius: '0.5rem', mt: 2 }}
            >
                <CardContent sx={{ px: 4, pb: 0, pt: 3 }}>
                    <Grid
                        container
                        rowSpacing={3}
                        columnSpacing={5}
                    >
                        {profSec ?
                            <>
                                <Grid item xs={12}>
                                    <Badge
                                        badgeContent={
                                            <IconButton component="label" color="primary" sx={{ border: '0.1px solid lightgray' }} >
                                                <EditIcon color="tertiary" />
                                                <input
                                                    hidden
                                                    onChange={handleAvatarUpload}
                                                    name='avatar'
                                                    accept="image/*"
                                                    type="file"
                                                />
                                            </IconButton>
                                        }
                                        anchorOrigin={{
                                            vertical: 'bottom',
                                            horizontal: 'right',
                                        }}
                                        overlap="circular">
                                        <Avatar
                                            alt={userProfile.name}
                                            src={userValues.avatarSrc}
                                            sx={{ width: '5em', height: '5em' }}
                                        />
                                    </Badge>
                                </Grid>
                                {userFields.map((field) => (
                                    <Grid item xs={12} sm={6} key={field}>
                                        <TextField
                                            color="tertiary"
                                            label={startCase(field)}
                                            fullWidth
                                            name={field}
                                            value={userValues[field]}
                                            onChange={handleChange}
                                            onBlur={validateChange}
                                            required
                                            error={userErrors[field] !== ''}
                                            helperText={userErrors[field] ? userErrors[field] : ' '}
                                        />
                                    </Grid>
                                ))}
                            </>
                            :
                            <>
                                {passFields.map((field) => (
                                    <Grid item xs={12} sm={6} key={field}>
                                        <TextField
                                            color="tertiary"
                                            label={startCase(field)}
                                            fullWidth
                                            name={field}
                                            type='password'
                                            value={updatePass[field]}
                                            onChange={changePassValues}
                                            onBlur={validatePass}
                                            required
                                            error={passErrors[field] !== ''}
                                            helperText={passErrors[field] ? passErrors[field] : ' '}
                                        />
                                    </Grid>
                                ))}
                            </>
                        }
                    </Grid>
                </CardContent>
                <CardActions sx={{ px: 4, py: 3 }}>
                    {profSec ?
                        <>
                            <Button
                                variant="contained"
                                color='tertiary'
                                disabled={status !== 'typing'}
                                type='Submit'
                            >
                                Save Changes
                            </Button>
                            {status === 'submitting' &&
                                <CircularProgress sx={{ ml: 3 }} color='tertiary' size='2rem' />
                            }
                            <Button
                                sx={{ ml: 2 }}
                                variant="outlined"
                                color='tertiary'
                                type='button'
                                onClick={() => setProfSec(false)}
                            >
                                Change Password
                            </Button>
                        </>
                        :
                        <Button variant='contained' type='submit' color='tertiary'>
                            Update Password
                        </Button>
                    }
                </CardActions>
            </Card>
        </>
    )
}
