import React, { useState, useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Modal, Select, TextField, Tooltip } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import AddIcon from "@mui/icons-material/Add"; // Import the Add Icon
import AddSeasonModal from "components/AddSeasonModal/index";

import { useNavigate } from "react-router-dom";
import { useAuth } from './../../context/auth-context/AuthContext';
import Cookies from "js-cookie";


const styles = {
    formControl: {
        width: "90%",
        height: "38px",
        marginTop: "10px",
        marginBottom: "10px",
        marginLeft: "10px",
        marginRight: "10px",
    },
    menuItemContainer: {
        width: "160px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        overflow: "hidden",
        whiteSpace: "nowrap",
        // maxWidth: "100%",
    },
    ellipsis: {
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
        maxWidth: "70%", // Adjust as needed
    },
    addSeasonButton: {
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        color: "#53b84d",
        fontWeight: "bold",
        backgroundColor: "#aad8a7",
    },
};

function SeasonDropdownMenu({ onSeasonSelect, selectedFarm }) {
    const [seasonNames, setSeasonNames] = useState([]);
    const [season, setSeason] = useState("");

    const [isEditingSeason, setIsEditingSeason] = useState(false);
    const [editedSeasonName, setEditedSeasonName] = useState("");
    const [selectedSeasonId, setSelectedSeasonId] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [isAddSeasonModalOpen, setAddSeasonModalOpen] = useState(false);
    const farmId = selectedFarm ? selectedFarm.id : null;

    const { authenticated, logout } = useAuth();
    const navigate = useNavigate();

    const [dropdownClicked, setDropdownClicked] = useState(false);

    useEffect(() => {
        const jwtToken = Cookies.get('jwt');
        if (!jwtToken) {
            console.log("no jwt token");
            logout();
            navigate('/auth/login');
            return;
        }
        getUser();
    }, [authenticated, dropdownClicked]);

    const getUser = async () => {
        try {
            const response = await axios.get('http://localhost:8000/auth/user/', {
                withCredentials: true,
            });
            const user = response.data;
            if (user) {
                console.log("user", user);
            } else {
                logout();
                navigate('/auth/login');
            }
        } catch (error) {
            logout();
            navigate('/auth/login');
        }
    };

    useEffect(() => {
        // Fetch farm names from the API
        console.log("farmId in SDM", farmId);
        if (farmId !== null && farmId !== undefined) {
            axios
                .get(`http://localhost:8000/api/season/getSeason/${farmId}/`, { withCredentials: true })
                .then((response) => {
                    setSeasonNames(response.data);
                    if (response.data.length > 0) {
                        setSeason(response.data[0].id);
                        onSeasonSelect(response.data[0].id); // Notify parent component
                    } else {
                        setSeason("");
                        onSeasonSelect(""); // Notify parent component with null
                    }
                })
                .catch((error) => {
                    // Handle error
                    console.error("Error displaying Season:", error);
                });
        } else {
            setSeasonNames([]);
            setSeason("");
            onSeasonSelect(""); // Notify parent component with null
        }
    }, [farmId]);

    const handleChange = (event) => {
        const selectedSeason = event.target.value;

        // Update the selected Season only if it's not the "None" option
        if (selectedSeason !== "" && selectedSeason !== " ") {
            console.log(selectedSeason);
            setSeason(selectedSeason);
            onSeasonSelect(selectedSeason); // Notify parent component
        }
    };

    const handleDeleteSeason = (seasonId) => {
        // Send a request to delete the farm with the specified ID
        axios
            .delete(`http://localhost:8000/api/season/${seasonId}/`, {
                headers: {
                    'X-CSRFToken': Cookies.get('csrftoken')
                }, withCredentials: true
            })
            .then(() => {
                axios
                    .get(`http://localhost:8000/api/season/getSeason/${farmId}/`, { withCredentials: true })
                    .then((response) => {
                        setSeasonNames(response.data);
                        if (response.data.length > 0) {
                            setSeason(response.data[0].id);
                            onSeasonSelect(response.data[0].id); // Notify parent component
                        } else {
                            setSeason("");
                            onSeasonSelect(""); // Notify parent component with null
                        }
                    })
                    .catch((error) => {
                        // Handle error
                        console.error("Error displaying Season:", error);
                    });
            })
            .catch((error) => {
                // Handle error
                console.error("Error deleting Season:", error);
            });
    };

    const handleMenuClick = () => {
        setDropdownClicked(!dropdownClicked);
        if (farmId !== null && farmId !== undefined) {
            axios
                .get(`http://localhost:8000/api/season/getSeason/${farmId}/`, { withCredentials: true })
                .then((response) => {
                    setSeasonNames(response.data);
                    if (response.data.length === 1) {
                        setSeason(response.data[0].id);
                        onSeasonSelect(response.data[0].id); // Notify parent component
                    }
                })
                .catch((error) => {
                    // Handle error
                    console.error("Error displaying Season:", error);
                });
        } else {
            setSeason("");
            onSeasonSelect(""); // Notify parent component with null
        }
    };


    const handleEditSeasonName = (seasonId) => {
        setIsEditingSeason(true);
        setSelectedSeasonId(seasonId);
        const season = seasonNames.find((season) => season.id === seasonId);
        setEditedSeasonName(season ? season.name : "");
        setStartDate(season ? new Date(season.start_date) : null);
        setEndDate(season ? new Date(season.end_date) : null);
    };


    const handleSaveSeasonName = () => {
        setIsEditingSeason(false);
        // Send a request to update the season name, start date, and end date
        if (selectedSeasonId && editedSeasonName) {
            const requestData = {
                name: editedSeasonName,
                start_date: startDate ? startDate.toISOString().split('T')[0] : null,
                end_date: endDate ? endDate.toISOString().split('T')[0] : null,
            };

            axios
                .patch(
                    `http://localhost:8000/api/season/${selectedSeasonId}/`,
                    requestData, // Include start_date and end_date in the request data
                    {
                        headers: {
                            'X-CSRFToken': Cookies.get('csrftoken')
                        }, withCredentials: true
                    }
                )
                .then(() => {
                    // Reload the season names
                    handleMenuClick();
                })
                .catch((error) => {
                    // Handle error
                    console.error("Error updating farm name:", error);
                    Alert("Error updating farm name!");
                });
        }
        else {
            Alert("Error updating farm name!");
        }
    };

    const handleOpenAddSeasonModal = () => {
        if (farmId !== null && farmId !== undefined) {
            setAddSeasonModalOpen(true);
        } else {
            // openWarningSB();
        }
    };

    const handleCloseAddSeasonModal = () => {
        setAddSeasonModalOpen(false);
    };

    const seasonAdded = () => {
        handleMenuClick();
    }

    return (
        <FormControl style={styles.formControl}>
            <Select
                onClick={handleMenuClick}
                value={season}
                onChange={handleChange}
                displayEmpty
                style={{ height: "100%" }}
                IconComponent={() => {
                    if (season) {
                        return (
                            <EditIcon
                                // fontSize="small"
                                style={{ cursor: "pointer", marginRight: 5 }}
                                onClick={() => handleEditSeasonName(season)}
                            />
                        );
                    } else {
                        return <ExpandMoreIcon fontSize="medium" />;
                    }
                }}
                MenuProps={{
                    PaperProps: {
                        style: {
                            maxHeight: 200
                        },
                    },
                }}
            // disabled={!farmId || seasonNames.length === 0} // Disable when no farm is selected
            >
                {seasonNames.length === 0 && (
                    <MenuItem value="">
                        <em>Season</em>
                    </MenuItem>
                )}
                {seasonNames.map((seasonName) => (
                    <MenuItem key={seasonName.id} value={seasonName.id}>
                        <div style={styles.menuItemContainer}>
                            <div style={styles.ellipsis}>{seasonName.name}</div>
                            <DeleteIcon
                                style={{ cursor: "pointer" }}
                                onClick={() => handleDeleteSeason(seasonName.id)}
                            />
                        </div>
                    </MenuItem>
                ))}
                <MenuItem
                    value=" "
                    onClick={handleOpenAddSeasonModal}
                    style={styles.addSeasonButton}
                >
                    <div>Add Season</div>
                    <AddIcon fontSize="small" />
                </MenuItem>
            </Select>
            <AddSeasonModal
                open={isAddSeasonModalOpen}
                onClose={handleCloseAddSeasonModal}
                selectedFarm={selectedFarm}
                seasonAdded={seasonAdded}
                seasonNumber={seasonNames.length}
            />
            <Dialog open={isEditingSeason} onClose={() => setIsEditingSeason(false)}>
                <DialogTitle>Edit Season</DialogTitle>
                <DialogContent>
                    <DialogContentText>Update Season</DialogContentText>
                    <TextField
                        autoFocus
                        label="Season Name"
                        variant="outlined"
                        value={editedSeasonName}
                        onChange={(e) => setEditedSeasonName(e.target.value)}
                        fullWidth
                        type="text"
                        style={{ marginTop: "10px" }}
                    />
                    <div style={{ marginTop: "15px" }}>
                        <LocalizationProvider dateAdapter={AdapterDateFns}>
                            <DatePicker
                                sx={{ width: 200 }}
                                label="Start Date"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                            <DatePicker
                                sx={{ width: 200, marginLeft: "20px" }}
                                label="End Date"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </LocalizationProvider>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSaveSeasonName}>Update</Button>
                </DialogActions>
            </Dialog>
        </FormControl>
    );
}

export default SeasonDropdownMenu;
