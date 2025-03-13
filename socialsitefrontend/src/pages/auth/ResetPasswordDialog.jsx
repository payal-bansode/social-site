import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

import axiosInstance from '../../utils/axiosInstance';

import IconButton from '@mui/material/IconButton';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InputAdornment from '@mui/material/InputAdornment'; // Import InputAdornment
import { useAlert } from '../../context/AlertContext';


// THIS IS THE MODLE BOX FOR SETPASSWORD WHEN USER IS LOGINED
const ResetPasswordDialog = ({ open, onClose }) => {

    const { showAlert } = useAlert();

    const [newPassword, setNewPassword] = useState('');
    const [reNewPassword, setReNewPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');

    const [isLoading,setIsLoading] =useState(false)
    // Single state object to control visibility of all password fields
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        reNew: false,
    });

    // Toggle password visibility
    const togglePasswordVisibility = (field) => {
        setShowPasswords(prevState => ({
            ...prevState,
            [field]: !prevState[field], // Toggle visibility for the specific field
        }));
    };

    //   SUBMIT THE NEW PASSWORD TO SERVER 
    const handleSubmit = async () => {
        if (!currentPassword || !newPassword || !reNewPassword) {
            showAlert('All fields are required!', 'error');
            return; // Exit the function if fields are empty
        }
        // Check if the new password and re-entered password match
    if (newPassword !== reNewPassword) {
        showAlert('New passwords do not match!', 'error');
        return; // Exit the function if passwords do not match
    }
        try {
            setIsLoading(true)
            const response = await axiosInstance.post('auth/users/set_password/', {
                current_password: currentPassword,
                new_password: newPassword,
                re_new_password: reNewPassword
            });
            showAlert('password has been reset!', 'success')
            onClose(); // Close the dialog
        } catch (error) {
            if (error.response && error.response.data) {
                // Pass the error response to the alert context
                showAlert(error.response.data, 'error',);
            } else {
                // Fallback error if the server does not respond
                showAlert('Something went wrong, please try again.', 'error');
            }
        }
        finally{
            setIsLoading(false)
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogContent>

                {/* Current Password */}
                <TextField
                    autoFocus
                    margin="dense"
                    label="Current Password"
                    type={showPasswords.current ? 'text' : 'password'}
                    fullWidth
                    variant="standard"
                    value={currentPassword}
                    required
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => togglePasswordVisibility('current')}
                                        edge="end"
                                    >
                                        {showPasswords.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                {/* New Password */}
                <TextField
                    margin="dense"
                    label="New Password"
                    type={showPasswords.new ? 'text' : 'password'}
                    fullWidth
                    variant="standard"
                    value={newPassword}
                    required
                    onChange={(e) => setNewPassword(e.target.value)}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => togglePasswordVisibility('new')}
                                        edge="end"
                                    >
                                        {showPasswords.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />

                {/* Re-enter New Password */}
                <TextField
                    margin="dense"
                    label="Re-enter New Password"
                    type={showPasswords.reNew ? 'text' : 'password'}
                    fullWidth
                    variant="standard"
                    value={reNewPassword}
                    required
                    onChange={(e) => setReNewPassword(e.target.value)}
                    slotProps={{
                        input: {
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => togglePasswordVisibility('reNew')}
                                        edge="end"
                                    >
                                        {showPasswords.reNew ? <VisibilityOffIcon /> : <VisibilityIcon />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        },
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} disabled = {isLoading}>Submit</Button>
            </DialogActions>
        </Dialog>
    );
};

export default ResetPasswordDialog;