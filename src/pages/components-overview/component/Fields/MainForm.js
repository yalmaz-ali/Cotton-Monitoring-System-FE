import React, { useState } from "react";
import { Card, CardContent, Typography, IconButton, Menu, MenuItem, Button, Tooltip, Popper } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import ClickAwayListener from '@mui/material/ClickAwayListener';

function MainForm(
    props
) {

    return (
        <div style={{
            overflowY: "auto",
            position: "relative",
            flex: 1
        }}>
            {props.fieldData.length === 0 ?
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>No Fields</div>
                :
                <div style={{ height: "100%", paddingRight: "10px", boxSizing: "content-box", display: "flex", flexDirection: "column", }}>
                    {props.fieldData.map((field) => (
                        <Card key={field.id} onClick={() => props.handleFieldClick(field.id)} style={{ margin: "10px" }}>
                            <CardContent style={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="h5" component="div" style={{ display: "flex" }}>
                                    <div style={{ marginRight: 5 }}>{field.name}</div>
                                    {/* <div style={{ marginRight: 5 }}>{field.id}</div> */}
                                    <div style={{ color: "red" }}>{field.Field_Data.area + " ha"}</div>
                                </Typography>
                                <div style={{ width: "25px", height: "10px" }}>
                                    <IconButton
                                        disableRipple
                                        onClick={(event) => {
                                            event.stopPropagation(); // Prevent the event from propagating
                                            props.handleMenuClick(event, field)
                                        }}>
                                        <MoreVertIcon />
                                    </IconButton>
                                    <Menu
                                        anchorEl={props.anchorEl}
                                        open={Boolean(props.anchorEl)}
                                        onClose={props.handleCloseMenu}
                                    >
                                        <MenuItem onClick={props.handleEdit}>Edit</MenuItem>
                                        <MenuItem onClick={props.handleDelete}>Delete</MenuItem>
                                    </Menu>
                                </div>
                            </CardContent>
                            <CardContent>
                                <Typography variant="subtitle1" component="div" style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div style={{ color: "gray" }}> {field.Field_Data.crop_name}</div>
                                    <Tooltip title="NDVI" placement="top">
                                        <div style={{ color: "green" }}>
                                            {field.Field_Data.avg_ndvi ? field.Field_Data.avg_ndvi.toFixed(3) : "N/A"}
                                        </div>
                                    </Tooltip>
                                </Typography>
                            </CardContent>
                        </Card>
                    ))}
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
                <Button variant="contained" color="error" style={{ borderRadius: "5%" }} onClick={props.handleAddFieldPopper}>
                    <AddIcon />
                    <Typography variant="subtitle1" component="div" style={{ color: "white", fontSize: "17px" }}>
                        Add Fields
                    </Typography>
                </Button>
                <ClickAwayListener onClickAway={props.handleCloseAddFieldPopper}>
                    <Popper
                        id={props.id}
                        open={props.open}
                        anchorEl={props.anchorElAdd}
                        placement="top"
                        style={{ zIndex: 2 }}

                    >
                        <div
                            style={{
                                borderRadius: "5px",
                                boxShadow: "0px 0px 10px -5px rgba(0,0,0,0.5)",
                                alignItems: "center",
                                padding: "10px"
                            }}
                        >
                            <Button variant="contained" color="primary" style={{ borderRadius: "5%", margin: "5px" }}
                                onClick={
                                    props.handleDrawField
                                }
                            >
                                <Typography variant="subtitle1" component="div" style={{ color: "white", fontSize: "17px" }}>
                                    Draw Field
                                </Typography>
                            </Button>
                            <Button variant="contained" color="primary" style={{ borderRadius: "5%", margin: "5px" }}
                                onClick={
                                    props.handleUploadField
                                }
                            >
                                <Typography variant="subtitle1" component="div" style={{ color: "white", fontSize: "17px" }}>
                                    Upload File
                                </Typography>
                            </Button>
                        </div>
                    </Popper>
                </ClickAwayListener>
            </div>
        </div >
    )
}

export default MainForm;