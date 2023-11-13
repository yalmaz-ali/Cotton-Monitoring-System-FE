import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, IconButton, Menu, MenuItem, Button, TextField, ButtonBase, Popper } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

const RenderFields = ({ fieldData, drawPolygon, deleteField, edit, editedField, handleFieldClick }) => {
    // console.log("fieldData in RenderBar", fieldData);

    const [anchorElAdd, setAnchorElAdd] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);

    const [isDrawing, setIsDrawing] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [isInputVisible, setInputVisible] = useState(false);
    const [drawnPolygon, setDrawnPolygon] = useState([]);
    const [polygonName, setPolygonName] = useState("");
    const [name, setName] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClickAdd = (event) => {
        setAnchorElAdd(anchorElAdd ? null : event.currentTarget);
    };

    const open = Boolean(anchorElAdd);
    const id = open ? 'simple-popper' : undefined;

    const handleClick = (event, element) => {
        console.log("event", event);
        setAnchorEl(event.currentTarget); // Use event.currentTarget as the anchor element
        setSelectedElement(element);
    };

    const handleAddFieldClick = () => {
        setIsDrawing(true);
        setInputVisible(true);
        drawPolygon(true);
    };

    const handleClose = () => {
        setAnchorEl(null);
        // setSelectedElement(null);
    };

    const handleEdit = () => {
        console.log("Edit element with id:", selectedElement.id);
        setIsEdit(true);
        edit(true, selectedElement.id);
        setName(selectedElement.name);
        handleClose();
    };

    const handleBack = () => {
        // Hide the drawing mode and input field
        // setDrawnPolygon([]);
        // setPolygonName("");
        // setInputVisible(false);
        setIsEdit(false);
        console.log("1");
        edit(false, selectedElement.id);
        console.log("2");
        setIsDrawing(false);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleEditSubmit = async () => {
        //send the name to the parent component to update the name in the database
        await editedField(selectedElement.id, name);
        setIsEdit(false);
    };

    const handleEditCancel = () => {
        // Handle the cancel action
        // ...
        setIsEdit(false);
        edit(false, selectedElement.id);
    };

    const handleDelete = () => {
        console.log("Delete element with id:", selectedElement.id);
        // Show a confirmation dialog (e.g., a modal)
        handleClose();
        const confirmDelete = window.confirm("Are you sure you want to delete this field?");

        if (confirmDelete) {
            // Send a request to delete the field to your backend
            deleteField(selectedElement.id); // Replace with the actual field identifier (ID or something)
        }
    };

    // const FieldsShow = () => {
    //     return (
    //         <div style={{
    //             overflowY: "auto",
    //             position: "relative",
    //             flex: 1
    //         }}>
    //             {fieldData.length === 0 ?
    //                 <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>No Fields</div>
    //                 :
    //                 <div style={{ overflowY: "auto", height: "100%", paddingRight: "10px", boxSizing: "content-box" }}>
    //                     <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
    //                         {fieldData.map((field) => (
    //                             // <ButtonBase  key={field.id}>
    //                             <Card 
    //                             key={field.id} 
    //                             style={{ margin: "10px" }}
    //                             onClick={ () => handleFieldClick(field.id)}
    //                             >
    //                                 <CardContent style={{ display: "flex", justifyContent: "space-between" }}>
    //                                     <Typography variant="h5" component="div" style={{ display: "flex" }}>
    //                                         <div style={{ marginRight: 5 }}>{field.name}</div>
    //                                         <div style={{ marginRight: 5 }}>{field.id}</div>
    //                                         <div style={{ color: "red" }}>{field.Field_Data.area + " ha"}</div>
    //                                     </Typography>
    //                                     <div style={{ width: "25px", height: "10px" }}>
    //                                         <IconButton disableRipple onClick={(event) => handleClick(event, field)}>
    //                                             <MoreVertIcon />
    //                                         </IconButton>
    //                                         <Menu
    //                                             anchorEl={anchorEl}
    //                                             open={Boolean(anchorEl)}
    //                                             onClose={handleClose}
    //                                         >
    //                                             <MenuItem onClick={handleEdit}>Edit</MenuItem>
    //                                             <MenuItem onClick={handleDelete}>Delete</MenuItem>
    //                                         </Menu>
    //                                     </div>
    //                                 </CardContent>
    //                                 <CardContent>
    //                                     <Typography variant="subtitle1" component="div" style={{ display: "flex", justifyContent: "space-between" }}>
    //                                         <div style={{ color: "gray" }}> {field.Field_Data.crop_name}</div>
    //                                         <div style={{ color: "green" }}>
    //                                             {field.Field_Data.avg_ndvi ? field.Field_Data.avg_ndvi.toFixed(3) : "N/A"}
    //                                         </div>
    //                                     </Typography>
    //                                 </CardContent>
    //                             </Card>
    //                             // </ButtonBase>
    //                         ))}
    //                     </div>
    //                 </div>
    //             }
    //             <div style={{ position: "sticky", bottom: "10px", display: "flex", justifyContent: "center", zIndex: 1 }}>
    //                 <Button variant="contained" color="error" style={{ borderRadius: "5%" }} onClick={handleAddFieldClick}>
    //                     <AddIcon />
    //                     <Typography variant="subtitle1" component="div" style={{ color: "white", fontSize: "17px" }}>
    //                         Add Field
    //                     </Typography>
    //                 </Button>
    //             </div>
    //         </div>
    //     );
    // };

    const EditFieldShow = () => {
        return (
            <div style={{
                display: "flex",
                flexDirection: "column",
            }}>
                <Divider>
                    <Chip label="UPDATE FIELD" />
                </Divider>
                <TextField
                    label="Name"
                    variant="outlined"
                    value={name}
                    onChange={(e) => handleNameChange(e)}
                    // fullWidth
                    style={{ margin: "15px" }}
                />
                {/* <br /> */}
                <div style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    width: "100%"
                }}>
                    <Button variant="contained" color="secondary"
                        onClick={handleEditCancel}
                    >
                        Cancel
                    </Button>
                    <Button variant="contained" color="primary"
                        onClick={handleEditSubmit}
                    >
                        Update
                    </Button>
                </div>
            </div>

        );
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#eeeff2", width: "25%", height: "100%", boxShadow: "inset -10px 0px 10px -10px rgba(0,0,0,0.5)" }}>
            <div>
                <h1 style={{ textAlign: "center" }}>Fields</h1>
            </div>
            <div>
                {(isDrawing || isEdit) && (
                    <IconButton onClick={handleBack} style={{ alignSelf: "flex-start" }}>
                        <ArrowBackIcon />
                    </IconButton>
                )}
            </div>
            {isEdit ?
                <EditFieldShow />
                :
                <div style={{
                    overflowY: "auto",
                    position: "relative",
                    flex: 1
                }}>
                    {fieldData.length === 0 ?
                        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>No Fields</div>
                        :
                        <div style={{ height: "100%", paddingRight: "10px", boxSizing: "content-box", display: "flex", flexDirection: "column", }}>
                            {/* <div style={{ height: "100%" }}> */}
                            {fieldData.map((field) => (
                                // <ButtonBase  key={field.id}>
                                <Card key={field.id} onClick={() => handleFieldClick(field.id)} style={{ margin: "10px" }}>
                                    <CardContent style={{ display: "flex", justifyContent: "space-between" }}>
                                        <Typography variant="h5" component="div" style={{ display: "flex" }}>
                                            <div style={{ marginRight: 5 }}>{field.name}</div>
                                            <div style={{ marginRight: 5 }}>{field.id}</div>
                                            <div style={{ color: "red" }}>{field.Field_Data.area + " ha"}</div>
                                        </Typography>
                                        <div style={{ width: "25px", height: "10px" }}>
                                            <IconButton
                                                disableRipple
                                                onClick={(event) => {
                                                    event.stopPropagation(); // Prevent the event from propagating
                                                    handleClick(event, field)
                                                }}>
                                                <MoreVertIcon />
                                            </IconButton>
                                            <Menu
                                                anchorEl={anchorEl}
                                                open={Boolean(anchorEl)}
                                                onClose={handleClose}
                                            >
                                                <MenuItem onClick={handleEdit}>Edit</MenuItem>
                                                <MenuItem onClick={handleDelete}>Delete</MenuItem>
                                            </Menu>
                                        </div>
                                    </CardContent>
                                    <CardContent>
                                        <Typography variant="subtitle1" component="div" style={{ display: "flex", justifyContent: "space-between" }}>
                                            <div style={{ color: "gray" }}> {field.Field_Data.crop_name}</div>
                                            <div style={{ color: "green" }}>
                                                {field.Field_Data.avg_ndvi ? field.Field_Data.avg_ndvi.toFixed(3) : "N/A"}
                                            </div>
                                        </Typography>
                                    </CardContent>
                                </Card>
                                // </ButtonBase>
                            ))}
                            {/* </div> */}
                        </div>
                    }
                    <div style={{
                        position: "sticky",
                        bottom: "0px",
                        backgroundColor: "#eeeff2",
                        padding: "10px",
                        display: "flex",
                        justifyContent: "center",
                        zIndex: 2,
                        boxShadow: "1px -3px 10px -10px rgba(0,0,0,0.5)"
                    }}>
                        <Button variant="contained" color="error" style={{ borderRadius: "5%" }} onClick={handleClickAdd}>
                            <AddIcon />
                            <Typography variant="subtitle1" component="div" style={{ color: "white", fontSize: "17px" }}>
                                Add Fields
                            </Typography>
                        </Button>
                        <Popper
                            id={id}
                            open={open}
                            anchorEl={anchorElAdd}
                            placement="top"
                            style={{ zIndex: 2 }}

                        >
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                }}
                            >
                                <Button variant="contained" color="primary" style={{ borderRadius: 0 }}>
                                    <Typography variant="subtitle1" component="div" style={{ color: "white", fontSize: "17px" }}>
                                        Draw Field
                                    </Typography>
                                </Button>
                                <Button variant="contained" color="primary" style={{ borderRadius: 0 }}>
                                    <Typography variant="subtitle1" component="div" style={{ color: "white", fontSize: "17px" }}>
                                        Upload File
                                    </Typography>
                                </Button>
                            </div>
                        </Popper>
                    </div>
                </div >
            }
        </div >
    );
};

export default RenderFields;