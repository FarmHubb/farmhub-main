import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import axios from 'axios';
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

export default function SignIn({ open, setOpen, status, setStatus, signInStatus, setSignInStatus, setTrigger }) {

    const [loginInfo, setLoginInfo] = useState({
        phoneNumber: "",
        password: "",
    });

    const handleChange = (event) => {
        setSignInStatus('typing');
        setLoginInfo({ ...loginInfo, [event.target.name]: event.target.value });
    };

    // -------------------------------- Login User -------------------------------- 

    async function submitUser(e) {
        e.preventDefault();
        setSignInStatus('authenticating');

        const loginDetails = {
            phoneNumber: loginInfo.phoneNumber,
            password: loginInfo.password,
        };

        axios.post(`${process.env.REACT_APP_BACKEND_URL}/user/login`, loginDetails, { withCredentials: true })
            .then(() => {
                setSignInStatus('typing');
                setTrigger(prevValue => !prevValue);
                setOpen(false);
            })
            .catch((error) => {
                const res = error.response.data;
                if(res === 'Invalid Phone Number') setSignInStatus('Invalid Phone Number');
                if(res === 'Invalid Password') setSignInStatus('Invalid Password');
            });
    }

    // -------------------------------- Forgot Password -------------------------------- 

    const [forgotPass, setForgotPass] = useState({
        phoneNumber: "",
        otp: "",
        password: '',
        confirmPassword: ''
    });

    const changeForgotPass = (event) => {
        setForgotPass({ ...forgotPass, [event.target.name]: event.target.value });
    };

    const [validOtp, setValidOtp] = useState(true);

    async function getOtp(e) {
        e.preventDefault();

        const PassDetails = {
            phoneNumber: forgotPass.phoneNumber
        };

        axios.post(`${process.env.REACT_APP_BACKEND_URL}/password/forgot`, PassDetails, { withCredentials: true })
            .then(() => {
                setStatus('otp');
            })
            .catch((error) => console.log(error));
    }

    async function checkOtp(e) {
        e.preventDefault();

        const PassDetails = {
            phoneNumber: forgotPass.phoneNumber,
            otp: forgotPass.otp
        };

        axios.post(`${process.env.REACT_APP_BACKEND_URL}/password/otpCheck`, PassDetails, { withCredentials: true })
            .then((response) => {
                if(response.data.message === 'Invalid OTP') {
                    setValidOtp(false);
                    return;
                }
                setStatus('change');
            })
            .catch((error) => console.log(error));
    }

    // -------------------------------- Change Password -------------------------------- 

    async function submitPass(e) {
        e.preventDefault();

        const PassDetails = {
            phoneNumber: forgotPass.phoneNumber,
            password: forgotPass.password,
        };

        axios.post(`${process.env.REACT_APP_BACKEND_URL}/password/changePassword`, PassDetails, { withCredentials: true })
            .then(() => {
                setStatus('signIn')
            })
            .catch((error) => console.log(error));
    }

    // ---------------------------------------------------------------- 

    return (
        <Dialog open={open} onClose={() => setOpen(false)} disableScrollLock={true}>
            {status === 'signIn' &&
                <Box component='form' onSubmit={submitUser}>
                    <DialogTitle>SIGN IN</DialogTitle>
                    <DialogContent>
                        <TextField
                            value={loginInfo.phoneNumber}
                            onChange={handleChange}
                            color='tertiary'
                            autoFocus
                            margin="dense"
                            name="phoneNumber"
                            label="Phone No."
                            fullWidth
                            variant="standard"
                            error={signInStatus === 'Invalid Phone Number'}
                            helperText={signInStatus === 'Invalid Phone Number' && 'Invalid Phone Number'}
                        />
                        <TextField
                            value={loginInfo.password}
                            onChange={handleChange}
                            color='tertiary'
                            autoFocus
                            margin="dense"
                            name="password"
                            label="Password"
                            type='password'
                            fullWidth
                            variant="standard"
                            error={signInStatus === 'Invalid Password'}
                            helperText={signInStatus === 'Invalid Password' && 'Invalid Password'}
                        />
                    <Link variant="subtitle2" color="tertiary.main" onClick={() => setStatus('forgot')}>
                        Forgot Password?
                    </Link>
                        <Typography mt={3} variant="subtitle2">
                            {'New User? '}
                            <Link component={RouterLink} to='/signup' onClick={() => setOpen(false)} color='tertiary.main'>
                                Create an Account
                            </Link>
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        {signInStatus === 'authenticating' &&
                            <CircularProgress sx={{ ml: 3 }} color='tertiary' size='2rem' />
                        }
                        <Button color='tertiary' type='submit' disabled={loginInfo.phoneNumber.trim() === '' || loginInfo.password.trim() === ''}>
                            Sign In
                        </Button>
                        <Button color='tertiary' onClick={() => setOpen(false)}>Cancel</Button>
                    </DialogActions>
                </Box>
            }
            {status === 'forgot' &&
                <Box component='form' onSubmit={getOtp}>
                    <DialogTitle>Forgot Password</DialogTitle>
                    <DialogContent component='form' > 
                    {/* add onsubmit here */}
                    <TextField
                        value={forgotPass.phoneNumber}
                        onChange={changeForgotPass}
                        color='tertiary'
                        autoFocus
                        margin="dense"
                        name="phoneNumber"
                        label="Phone No."
                        sx={{
                            width: '25rem'
                        }}
                        variant="standard"
                    />
                    </DialogContent>
                    <DialogActions>
                        <Button color='tertiary' type='submit'>
                            Send OTP
                        </Button>
                        <Button color='tertiary' onClick={() => setOpen(false)}>Cancel</Button>
                    </DialogActions>
                </Box>
            }
            {status === 'otp' &&
                <Box component='form' onSubmit={checkOtp}>
                    <DialogTitle>Enter OTP</DialogTitle>
                    <DialogContent component='form' > 
                    {/* add onsubmit here */}
                    <TextField
                        value={forgotPass.otp}
                        onChange={changeForgotPass}
                        color='tertiary'
                        autoFocus
                        margin="dense"
                        name="otp"
                        label="OTP"
                        sx={{
                            width: '25rem'
                        }}
                        variant="standard"
                        error={!validOtp}
                        helperText={!validOtp ? 'Invalid OTP' : ' '}
                    />
                    </DialogContent>
                    <DialogActions>
                        <Button color='tertiary' type='submit'>
                            Submit
                        </Button>
                        <Button color='tertiary' onClick={() => setOpen(false)}>Cancel</Button>
                    </DialogActions>
                </Box>
            }
            {status === 'change' &&
                <Box component='form' onSubmit={submitPass}>
                    <DialogTitle>Change Password</DialogTitle>
                    <DialogContent component='form' > 
                    {/* add onsubmit here */}
                    <TextField
                        value={forgotPass.password}
                        onChange={changeForgotPass}
                        color='tertiary'
                        autoFocus
                        margin="dense"
                        name="password"
                        type='password'
                        label="New Password"
                        sx={{
                            width: '25rem'
                        }}
                        variant="standard"
                    />
                    <TextField
                        value={forgotPass.confirmPassword}
                        onChange={changeForgotPass}
                        color='tertiary'
                        autoFocus
                        margin="dense"
                        name="confirmPassword"
                        type='password'
                        label="Confirm Password"
                        sx={{
                            width: '25rem'
                        }}
                        variant="standard"
                    />
                    </DialogContent>
                    <DialogActions>
                        <Button color='tertiary' type='submit'>
                            Submit
                        </Button>
                        <Button color='tertiary' onClick={() => setOpen(false)}>Cancel</Button>
                    </DialogActions>
                </Box>
            }
        </Dialog>
    );
}
