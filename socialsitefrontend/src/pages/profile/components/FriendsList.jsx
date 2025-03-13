import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import axiosInstance from '../../../utils/axiosInstance';
import { Avatar } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

function ChildModal({ userData, fetchFriendList }) { // Add updateFriendList as a prop
    const { user } = useAuth();
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const removeFriend = async () => {
        try {
            const response = await axiosInstance.post(`/${userData.username}/friends/`,
                {
                    data: {  // Send data in the body
                        // target_username: userData.id
                    }
                }
            ); // Adjust endpoint as needed

            // console.log('Friend successfully removed',response.data.data);

            // Assuming the API returns the updated friend list in response.data.updatedFriends
            // If it doesn’t, you can filter the friend out manually (explained below)
            if (response.status) {
                fetchFriendList()
                // updateFriendList(response.data.data); // Pass updated list to parent
            }

            setOpen(false); // Close the child modal

        } catch (error) {
            console.error('Failed to remove friend:', error);
        }
    };

    return (
        <React.Fragment>
            {userData.username !== user.username && (
                userData.is_friend ? (
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            borderColor: '#dbdbdb',
                        }}
                        color="error"
                        onClick={handleOpen}
                    >
                        Unfollow
                    </Button>
                ) : (
                    <Button
                        variant="outlined"
                        size="small"
                        sx={{
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 600,
                            borderColor: '#dbdbdb',
                        }}
                        color="primary"
                        onClick={handleOpen}
                    >
                        Follow
                    </Button>
                )
            )}




            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: 200 }}>
                    <h2 id="child-modal-title">User Profile</h2>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Avatar src={userData.profile_pic || ''} alt="Profile" sx={{ width: 56, height: 56, mr: 2 }} />
                        <Typography variant="h6">{userData.username}</Typography>
                    </Box>

                    {userData.is_friend ? <Button variant='outlined' color="error" onClick={removeFriend}> Unfollow</Button>
                        :
                        <Button variant='outlined' color="primary" onClick={removeFriend}>Follow </Button>
                    }

                </Box>
            </Modal>
        </React.Fragment>
    );
}

export default function FriendsList({ username }) {
    const [open, setOpen] = React.useState(false);
    const [friendList, setFriendList] = React.useState([]);
    const { user } = useAuth();

    const handleOpen = () => {
        setOpen(true);
        fetchFriendList();
    };

    const handleClose = () => setOpen(false);

    const fetchFriendList = async () => {
        console.log(username);
        try {
            const response = await axiosInstance.get(`/${username}/friends/`);
            setFriendList(response.data);
            console.log(response.data);
        } catch (error) {
            console.error('Failed to fetch friend list:', error);
        }
    };




    // Fetch friend list when component mounts or username changes
    React.useEffect(() => {
        fetchFriendList(); // Properly invoke the function
    }, [username]); // Dependency array with username
    return (
        <div>
            <Typography mx={1} onClick={handleOpen} sx={{ cursor: 'pointer' }}>
                Friends

            </Typography>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="parent-modal-title"
                aria-describedby="parent-modal-description"
            >
                <Box sx={{ ...style, width: 400 }}>
                    <h2 id="parent-modal-title">Friend List</h2>
                    <Box sx={{ mt: 2 }}>

                        {friendList.length === 0 ? (
                            <Typography variant="body2">No friends available.</Typography>
                        ) : (
                            <ul>
                                {friendList.map((friend) => (

                                    <li key={friend.id}>
                                        <Avatar
                                            src={friend.profile_pic || ''}
                                            alt="Profile"
                                            sx={{ width: 56, height: 56, mr: 2 }}
                                        />
                                        {friend.username}
                                        <ChildModal userData={friend} fetchFriendList={fetchFriendList} /> {/* Pass the callback */}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Box>
                </Box>
            </Modal>
        </div>
    );
}