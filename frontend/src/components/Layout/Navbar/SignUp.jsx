import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import startCase from 'lodash/startCase';
import { isEmail, isMobilePhone } from 'validator';
import Card from '@mui/material/Card';
import TextField from '@mui/material/TextField';
import CardContent from '@mui/material/CardContent';
import Container from '@mui/material/Container'
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { SnackbarDispatchContext } from '../../../contexts/SnackbarContext';
import { OPEN_SNACKBAR } from '../../../hooks/useSnackbar';

function TextFieldx({ children, ...other }) {
    return (
        <TextField
            variant="outlined"
            color='tertiary'
            sx={{
                mb: 2,
                '& .MuiFormLabel-filled.MuiFormLabel-root': {
                    display: 'none',
                },
            }}
            InputLabelProps={{ shrink: false }}
            {...other}
        >
            {children}
        </TextField>
    );
}

export default function SignUp({ setTrigger }) {

    const dispatchSnackbar = useContext(SnackbarDispatchContext);
    
    const fields = [
        { name: 'name', label: 'Enter your name' },
        { name: 'phoneNumber', label: 'Enter your Phone Number' },
        { name: 'email', label: 'example@mail.com', type: 'email' },
        { name: 'password', label: '*********', type: 'password' },
        { name: 'confirmPassword', label: '*********', type: 'password' }
    ];

    const [signUpInfo, setSignUpInfo] = useState({
        avatar: '',
        avatarSrc: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: ''
    });

    const [signUpErrors, setSignUpErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: ''
    });

    const handleChange = (e) => {
        setSignUpInfo({ ...signUpInfo, [e.target.name]: e.target.value });
        setSignUpErrors(() => ({
            ...signUpErrors,
            [e.target.name]: e.target.value === '' ? 'Required' : ''
        }));
    };

    const validateChange = (e) => {
        if (e.target.value === '') {
            setSignUpErrors(() => ({
                ...signUpErrors,
                [e.target.name]: 'Required'
            }));
            return;
        }

        let newSignUpErrors = { ...signUpErrors };
        
        if(e.target.name === 'phoneNumber') {
            if (!isMobilePhone(signUpInfo.phoneNumber, 'en-IN')) 
                newSignUpErrors.phoneNumber = 'Invalid Phone Number';
        }
        else if(e.target.name === 'email') {
            if(!isEmail(signUpInfo.email)) 
                newSignUpErrors.email = 'Invalid email';
        }
        else if (e.target.name === 'password') {
            if (signUpInfo.password.length < 6)
                newSignUpErrors.password = 'Password must contain at least 6 characters';
            if (signUpInfo.confirmPassword !== '' && signUpInfo.password !== signUpInfo.confirmPassword)
                newSignUpErrors.confirmPassword = 'Passwords do not match';
        }
        else if (e.target.name === 'confirmPassword') {
            if (signUpInfo.password !== signUpInfo.confirmPassword)
                newSignUpErrors.confirmPassword = 'Passwords do not match';
        }

        if(newSignUpErrors !== signUpErrors) setSignUpErrors(newSignUpErrors);
    }

    const handleAvatarUpload = (e) => {
        const file = e.target.files[0];
        const imageUrl = URL.createObjectURL(file);
        setSignUpInfo((prevValues) => ({
            ...prevValues,
            avatar: file,
            avatarSrc: imageUrl,
        }));
    }

    async function createUser(e) {
        e.preventDefault();
        
        if (fields.some(field => signUpInfo[field.name] === '')) {
            let newSignUpErrors = { ...signUpErrors };
            fields.forEach(field => {
                if (signUpInfo[field.name] === '')
                newSignUpErrors[field.name] = 'Required';
            });
            setSignUpErrors(newSignUpErrors);
            return;
        }

        if(Object.values(signUpErrors).some(value => value !== '')) return;

        const formData = new FormData();
        formData.append('avatar', signUpInfo.avatar);
        formData.append('name', signUpInfo.name);
        formData.append('email', signUpInfo.email);
        formData.append('password', signUpInfo.password);
        formData.append('confirmPassword', signUpInfo.confirmPassword);
        formData.append('phoneNumber', signUpInfo.phoneNumber);

        axios.post(
            `${process.env.REACT_APP_BACKEND_URL}/user/customer`,
            formData,
            { headers: { 'Content-Type': 'multipart/form-data' }, withCredentials: true })
            .then((response) => {
                if (response.data.errors) {
                    dispatchSnackbar({
                        type: OPEN_SNACKBAR,
                        payload: { content: 'Account could not be created', severity: 'error' }
                    });
                    return;
                }
                dispatchSnackbar({
                    type: OPEN_SNACKBAR,
                    payload: { content: 'Account created successfully', severity: 'success' }
                });
                loginUser();
            })
            .catch((error) => console.log(error));
    }

    const navigate = useNavigate();

    async function loginUser() {
        const loginDetails = {
            phoneNumber: signUpInfo.phoneNumber,
            password: signUpInfo.password,
        };

        axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/login`, loginDetails, { withCredentials: true })
            .then((response) => {
                if (response) {
                    setTrigger(prevValue => !prevValue)
                    navigate('/');
                }
            })
            .catch((error) => console.log(error));
    }

    return (
        <Container 
            maxWidth='xl' 
            sx={{ 
                background: 'url(/Images/signupbg.jpg)', 
                backgroundSize: 'cover', 
                backgroundPosition: 'center', 
                py: '3rem'
            }}>
            <Card sx={{ width: 500, mx: 'auto' }}>
                <CardContent sx={{ p: 5 }} component='form' onSubmit={createUser} noValidate>
                    <Stack>
                        <img
                            src='/Images/main-logo.png'
                            alt='FarmHub'
                            style={{ width: '5em', height: '5em', margin: 'auto' }}
                        />
                        <Typography align='center' variant='h6' mt={2}>Create Your Account</Typography>
                        <Avatar
                            sx={{ mx: 'auto', width: '5em', height: '5em', mt: '1rem' }}
                            src={signUpInfo.avatarSrc}
                        />
                        <Button variant="contained" color='tertiary' component="label" sx={{ mx: 'auto', my: 3 }}>
                            Upload your Image
                            <input
                                hidden
                                onChange={handleAvatarUpload}
                                name='avatar'
                                accept="image/*"
                                type="file"
                            />
                        </Button>
                        {fields.map(field => (
                            <Box key={field.name}>
                                <Typography variant='subtitle2' gutterBottom>
                                    {startCase(field.name)}
                                </Typography>
                                <TextFieldx
                                    required
                                    value={signUpInfo[field.name]}
                                    onChange={handleChange}
                                    onBlur={validateChange}
                                    name={field.name}
                                    label={field.label}
                                    type={field.type}
                                    fullWidth
                                    error={signUpErrors[field.name] !== ''}
                                    helperText={signUpErrors[field.name] ? signUpErrors[field.name] : ' '}
                                />
                            </Box>
                        ))}
                        <Button
                            variant='contained'
                            color='tertiary'
                            size='large'
                            type='submit'
                            sx={{ my: 3 }}
                        >
                            Submit
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Container>
    )
}