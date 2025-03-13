import React, { useState, useEffect } from 'react';
import {
  Box, Tab, Button, Stack, TextField, Switch, FormControlLabel,
   RadioGroup, Radio, FormControl, FormLabel, Avatar
} from '@mui/material';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import axiosInstance from '../../../utils/axiosInstance';

import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../../context/AuthContext';
import { useAlert } from '../../../context/AlertContext';

import { styled } from "@mui/material/styles";
import {CircularProgress} from '@mui/material';
import Paper from "@mui/material/Paper";

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { validateUsername } from '../../auth/Register';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});



const ProfilePaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
  marginBottom: theme.spacing(3),

  overflowWrap: "break-word", // Ensures long text wraps properly
}));



const EditProfile = () => {
  const [value, setValue] = useState('1');

  const handleChangeTab = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChangeTab} aria-label="profile edit tabs">
            <Tab label="Personal Data" value="1" />
            {/* <Tab label="Subscription" value="2" />
            <Tab label="Advanced Settings" value="3" /> */}
          </TabList>
        </Box>

        {/* TabPanel for Personal Data */}
        <TabPanel value="1">
          <PersonalDataForm />
        </TabPanel>

        {/* TabPanel for Subscription
        <TabPanel value="2">
          <SubscriptionForm />
        </TabPanel>

        TabPanel for Advanced Settings
        <TabPanel value="3">
          <AdvancedSettingsForm />
        </TabPanel> */}


      </TabContext>
    </Box>
  );
};




const PersonalDataForm = () => {
  const navigate = useNavigate()
  const { showAlert } = useAlert();
  const { updateUser } = useAuth();

  const [formData, setFormData] = useState({
    profilePic: '',
    name: '',
    username: '',

    headline: '',
    address: '',
    gender: 'M', // default gender as 'M'
    publicProfile: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // To handle the selected profile picture
  const [preview, setPreview] = useState(''); // To store the blob URL for previewing the image

  // Fetch the profile data on component mount
  const fetchProfileData = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/auth/users/me/');
      // Initialize formData with the response data
      setFormData({
        ...response.data,
        profilePic: response.data.profile_pic || '', // If no profile pic, set an empty string
        publicProfile: response.data.is_public || false, // Make sure it's set to false if not provided
      });


    } catch (error) {
      if (error.response && error.response.data) {
        // Pass the error response to the alert context
        showAlert(error.response.data, 'error',);
      } else {
        // Fallback error if the server does not respond
        showAlert('Something went wrong, please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  // Handle input changes for other fields
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" || type === "radio") {
      // Ensure that `checked` is a boolean
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // Handle file input change for profile picture
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const objectUrl = URL.createObjectURL(file); // Create a Blob URL for preview
      setPreview(objectUrl); // Set the Blob URL as the preview
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    const form = new FormData();
    form.append('name', formData.name);
    form.append('username', formData.username);

    form.append('headline', formData.headline);
    form.append('address', formData.address);
    form.append('gender', formData.gender); // Send gender as 'M', 'F', or 'O'

    // Ensure publicProfile is a boolean before submitting
    form.append('is_public', formData.publicProfile ? 'true' : 'false');

    // If there's a selected file (new profile picture), append it to the form
    if (selectedFile) {
        // console.log(selectedFile)
      form.append('profile_pic', selectedFile);
    }


    // VALIDATE USERNAME BASED ON THE URL PATTERS
    const validateUsernameError = validateUsername(formData.username);
    if (validateUsernameError){
      showAlert(validateUsernameError, "error");
    return;
    }
    // Validate username for special characters
    const usernameRegex = /^(?!.*[_.-]{2})[a-zA-Z0-9._-]{1,30}(?<![._-])$/; // Only allows letters, numbers, periods, dashes, and underscores
  if (!usernameRegex.test(formData.username)) {
    showAlert(
      "Username can only contain letters, numbers, periods (.), dashes (-), and underscores (_).",
      "error"
    );
    return;
  }

    setLoading(true);
    try {
      const response = await axiosInstance.patch('/auth/users/me/', form, {
        headers: {
            'Content-Type': 'multipart/form-data',
          },
      });

      if (response && response.data) {
        updateUser(response.data);
        // console.log(response.data)
       
        showAlert('profile updated successfully!', 'success',);
        navigate(`/${response.data.username}/setting`, { replace: true });
      } else {
        console.error('Unexpected response:', response);
        setError('Unexpected server response.');
      }

      
    } catch (error) {
      if (error.response && error.response.data) {
        // Pass the error response to the alert context
        showAlert(error.response.data, 'error',);
      } else {
        // Fallback error if the server does not respond
        showAlert('Something went wrong, please try again.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  // Profile Picture Preview (show selected image or default)
  const ProfilePicPreview = () => {
    if (preview) {
      return <img src={preview} alt="Selected Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />;
    } else if (formData.profilePic) {
      return <img src={formData.profilePic} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />;
    }
    return (<Avatar src='/broken-image.jpg' alt="Profile"
       style={{ width: '100px', height: '100px', borderRadius: '50%' }} >
        {formData.name.charAt(0).toUpperCase()}
        </Avatar>);
  };

  return (
    <Stack spacing={3}>
      {loading ? (
        <Box sx={{
              display: 'flex', justifyContent: 'center', // Horizontally center
              alignItems: 'center',    // Vertically center (if needed)
              width: '100%',
            }}>
              <CircularProgress />
            </Box>
      ) : error ? (
        <span>{error}</span>
      ) : (
        <>

          <Box
            sx={{
              flexGrow: 1,
              margin: "0 auto",
              maxWidth: "1200px",
              padding: 2,
            }}
          >
            <ProfilePaper>

              <Stack direction="row" spacing={2} paddingBottom={3}>
                <Box>
                  <ProfilePicPreview />
                </Box>

                <Box sx={{
                          display: 'flex',          // Enables flexbox
                          justifyContent: 'center', // Centers the button horizontally
                          alignItems: 'center',     // Centers the button vertically
                              // Optional: Makes the box take the full height of the viewport
                        }}>
                      <Button
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        size="small"   >
                        Upload file
                        <VisuallyHiddenInput
                          type="file"
                          onChange={handleFileChange}
                          inputProps={{ accept: 'image/*' }}
                           id="profile-pic-input"
                        />
                      </Button>
                </Box>
                {/* <Input
                  type="file"
                  inputProps={{ accept: 'image/*' }}
                  onChange={handleFileChange}
                  sx={{ display: 'none' }}
                  id="profile-pic-input"
                />
                <label htmlFor="profile-pic-input">
                  <IconButton component="span">
                    <PhotoCamera />
                  </IconButton>
                </label> */}

              </Stack>
              {/* Profile Picture Preview */}

              {/* Profile Picture File Input */}

              <Box

                sx={{
                  display: "grid",
                  gap: 2,
                }}
              >
                <TextField
                  label="Name"
                  variant="outlined"
                  fullWidth
                  value={formData.name}
                  onChange={handleInputChange}
                  name="name"
                />
                <TextField
                  label="Username"
                  variant="outlined"
                  fullWidth
                  value={formData.username}
                  onChange={handleInputChange}
                  name="username"
                />

                <TextField
                  label="Headline"
                  variant="outlined"
                  fullWidth
                  value={formData.headline}
                  onChange={handleInputChange}
                  name="headline"
                />
                <TextField
                  label="Address"
                  variant="outlined"
                  fullWidth
                  value={formData.address}
                  onChange={handleInputChange}
                  name="address"
                />

                {/* Gender Radio Buttons */}
                <FormControl component="fieldset">
                  <FormLabel component="legend">Gender</FormLabel>
                  <RadioGroup
                    row
                    value={formData.gender}
                    onChange={handleInputChange}
                    name="gender"
                  >
                    <FormControlLabel value="M" control={<Radio />} label="Male" />
                    <FormControlLabel value="F" control={<Radio />} label="Female" />
                    <FormControlLabel value="O" control={<Radio />} label="Other" />
                    <FormControlLabel value="N" control={<Radio />} label="Prefer not" />
                  </RadioGroup>
                </FormControl>

                {/* Public Profile Toggle */}
                <FormControlLabel
                  control={<Switch checked={formData.publicProfile} onChange={handleInputChange} name="publicProfile" />}
                  label="Public Profile"
                />

                {/* Save Button */}
                <Button variant="contained" color="primary" onClick={handleSubmit}>
                  Save Changes
                </Button>

              </Box>
            </ProfilePaper>

          </Box>
        </>
      )}
    </Stack>


  );
};






const SubscriptionForm = () => {
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSubscriptionData = async () => {
    setLoading(true);
    try {
      const dataresponse = ['list this is the subscrption data']
      // const response = await axios.get('/api/user/subscription');
      setSubscriptionData(dataresponse);
    } catch (err) {
      setError('Failed to load subscription data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionData();
  }, []);

  return (
    <Stack spacing={3}>
      {loading ? (
        <span>Loading subscription data...</span>
      ) : error ? (
        <span>{error}</span>
      ) : (
        <div>{subscriptionData ? 'Subscription Data Here' : 'No Subscription Data'}</div>
      )}
    </Stack>
  );
};

const AdvancedSettingsForm = () => {
  const [settingsData, setSettingsData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchSettingsData = async () => {
    setLoading(true);
    try {
      const response = ["this is the first thig"]; // API endpoint for advanced settings
      setSettingsData(response);
    } catch (err) {
      setError('Failed to load settings data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettingsData();
  }, []);

  return (
    <Stack spacing={3}>
      {loading ? (
        <span>Loading settings...</span>
      ) : error ? (
        <span>{error}</span>
      ) : (
        <div>{settingsData ? 'Advanced Settings Data Here' : 'No Settings Data'}</div>
      )}
      <Button variant="contained" color="primary">
        Save Settings
      </Button>
    </Stack>
  );
};

export default EditProfile;