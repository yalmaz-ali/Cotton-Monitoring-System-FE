import React, { useState, useEffect } from "react";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, Modal, Select, TextField, Tooltip, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from "@mui/icons-material/Add"; // Import the Add Icon

import AddFarmModal from "components/AddFarmModal";

const styles = {
    formControl: {
        width: 140,
        height: "38px",
    },
    menuItemContainer: {
        width: 120,
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
    addFarmButton: {
        cursor: "pointer",
        display: "flex",
        justifyContent: "space-between",
        color: "#3f51b5",
        fontWeight: "bold",
        backgroundColor: "#e8eaf6",
    },
};

function FarmDropdownMenu({ onFarmSelect }) {
    const [farmNames, setFarmNames] = useState([]);
    const [farm, setFarm] = useState("");

    const [isEditingFarm, setIsEditingFarm] = useState(false);
    const [editedFarmName, setEditedFarmName] = useState("");
    const [selectedFarmId, setSelectedFarmId] = useState(null);

    const [isAddFarmModalOpen, setAddFarmModalOpen] = useState(false);


    useEffect(() => {
        // Fetch farm names from the API
        // console.log("farm::", farm);
        // console.log("farmName::", farmNames);
        axios
            .get("http://localhost:8000/api/farm/", { withCredentials: true })
            .then((response) => {
                setFarmNames(response.data);
                if (response.data.length > 0) {
                    setFarm(response.data[0].id);
                    onFarmSelect(response.data[0]); // Notify parent component
                }
            })
            .catch((error) => {
                // Handle error
                console.error("Error displaying farm:", error);
            });
    }, []);

    const handleChange = (event) => {
        const selectedFarm = event.target.value;

        // Update the selected farm only if it's not the "None" option
        if (selectedFarm !== "" && selectedFarm !== " ") {
            const farmSent = farmNames.find((farm) => farm.id === selectedFarm);
            setFarm(selectedFarm);
            onFarmSelect(farmSent); // Notify parent component
        }
    };

    const handleDeleteFarm = (farmId) => {
        // Send a request to delete the farm with the specified ID
        axios
            .delete(`http://localhost:8000/api/farm/${farmId}/`, { withCredentials: true })
            .then(() => {
                axios
                    .get("http://localhost:8000/api/farm/", { withCredentials: true })
                    .then((response) => {
                        setFarmNames(response.data);
                        // Set a default value (empty string) when a farm is deleted
                        if (response.data.length > 0) {
                            setFarm(response.data[0].id);
                            onFarmSelect(response.data[0]); // Notify parent component
                        } else {
                            setFarm("");
                            onFarmSelect(""); // Notify parent component with null
                        }
                    })
                    .catch((error) => {
                        // Handle error
                        console.error("Error displaying farm:", error);
                    });
            })
            .catch((error) => {
                // Handle error
                console.error("Error deleting farm:", error);
            });
    };

    const handleMenuClick = () => {
        axios
            .get("http://localhost:8000/api/farm/", { withCredentials: true })
            .then((response) => {
                setFarmNames(response.data);
                if (response.data.length === 1) {
                    setFarm(response.data[0].id);
                    onFarmSelect(response.data[0]); // Notify parent component
                }
            })
            .catch((error) => {
                // Handle error
                console.error("Error displaying farm:", error);
            });
    };


    const handleEditFarmName = (farmId) => {
        setIsEditingFarm(true);
        setSelectedFarmId(farmId);
        const farm = farmNames.find((farm) => farm.id === farmId);
        setEditedFarmName(farm ? farm.name : "");
    };

    const handleSaveFarmName = () => {
        setIsEditingFarm(false);
        // Send a request to update the farm name
        if (selectedFarmId && editedFarmName) {
            axios
                .patch(
                    `http://localhost:8000/api/farm/${selectedFarmId}/`,
                    { name: editedFarmName },
                    { withCredentials: true }
                )
                .then(() => {
                    // Reload the farm names
                    handleMenuClick();
                })
                .catch((error) => {
                    // Handle error
                    console.error("Error updating farm name:", error);
                    Alert("Error updating farm name!");
                });
        }
    };

    const handleOpenAddFarmModal = () => {
        setAddFarmModalOpen(true);
    };
    const handleCloseAddFarmModal = () => {
        setAddFarmModalOpen(false);
    };
    const farmAdded = () => {
        handleMenuClick();
    };

    return (
        <FormControl style={styles.formControl}>
            <Select
                onClick={handleMenuClick}
                value={farm}
                onChange={handleChange}
                displayEmpty
                style={{ height: "100%" }}
                IconComponent={() => {
                    if (farm) {
                        return (
                            <EditIcon
                                // fontSize="small"
                                style={{ cursor: "pointer", marginRight: 5 }}
                                onClick={() => handleEditFarmName(farm)}
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
            >
                {farmNames.length === 0 && (
                    <MenuItem value="">
                        <em>Farms</em>
                    </MenuItem>
                )}
                {farmNames.map((farmName) => (
                    <MenuItem key={farmName.id} value={farmName.id}>
                        <div style={styles.menuItemContainer}>
                            <div style={styles.ellipsis}>{farmName.name}</div>
                            <DeleteIcon
                                style={{ cursor: "pointer" }}
                                onClick={() => handleDeleteFarm(farmName.id)}
                            />
                        </div>
                    </MenuItem>
                ))}
                <MenuItem
                    value=" "
                    onClick={handleOpenAddFarmModal}
                    style={styles.addFarmButton}
                >
                    <div>Add Farm</div>
                    <AddIcon fontSize="small" />
                </MenuItem>
            </Select>
            <AddFarmModal
                open={isAddFarmModalOpen}
                onClose={handleCloseAddFarmModal}
                farmAdded={farmAdded}
            />
            < Dialog
                open={isEditingFarm}
                onClose={() => setIsEditingFarm(false)}
            >
                <DialogTitle>Edit Farm</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Update Farm
                    </DialogContentText>
                    <TextField
                        autoFocus
                        label="Farm Name"
                        variant="outlined"
                        value={editedFarmName}
                        onChange={(e) => setEditedFarmName(e.target.value)}
                        fullWidth
                        type="text"
                        style={{ marginTop: "10px" }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSaveFarmName}>Update</Button>
                </DialogActions>
            </Dialog>
        </FormControl >
    );
}

export default FarmDropdownMenu;
