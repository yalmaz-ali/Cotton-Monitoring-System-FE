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
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: "calc(100% - 50px)",
                    }}>
                    <h3>
                        No Fields
                    </h3>
                </div>
                :
                <div style={{
                    minHeight: "100%",
                    display: "flex",
                    flexDirection: "column",
                    boxSizing: "border-box",
                }}>
                    {props.fieldData.map((field) => (
                        <Card
                            key={field.id}
                            onClick={() => props.handleFieldClick(field.id)}
                            style={{
                                margin: "10px",
                                cursor: "pointer",
                                boxShadow: "0px 0px 10px -5px rgba(0,0,0,0.5)",
                                borderRadius: "5px",
                                height: "120px",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between"

                            }}
                        >
                            <CardContent style={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="h5" component="div" style={{ display: "flex" }}>
                                    <div
                                        style={{
                                            marginRight: 5,
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                            // width: '50%' // Adjust this value as needed
                                        }}
                                    >
                                        {field.name}
                                    </div>
                                    <div
                                        style={{
                                            color: "#b50000",
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                            whiteSpace: 'nowrap',
                                        }}>
                                        {field.Field_Data.area + " ha"}
                                    </div>
                                </Typography>
                                <div style={{
                                    width: "25px",
                                    height: "10px"
                                }}>
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
                                        onClose={(event) => {
                                            event.stopPropagation();
                                            props.handleCloseMenu();
                                        }}
                                    >
                                        <MenuItem onClick={(event) => {
                                            event.stopPropagation();
                                            props.handleEdit();
                                        }}>Edit</MenuItem>
                                        <MenuItem onClick={(event) => {
                                            event.stopPropagation();
                                            props.handleDelete();
                                        }}>Delete</MenuItem>
                                    </Menu>
                                </div>
                            </CardContent>
                            <CardContent>
                                <Typography variant="subtitle1" component="div" style={{ display: "flex", justifyContent: "space-between" }}>
                                    <div style={{
                                        color: "#585858",
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                        whiteSpace: 'nowrap',
                                        width: '100px' // Adjust this value as needed
                                    }}>
                                        {field.Field_Data.crop_name}
                                    </div>
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
                display: "flex",
                justifyContent: "center",
                zIndex: 2,
                boxShadow: "1px -3px 10px -10px rgba(0,0,0,0.5)",
            }}>
                <Button
                    variant="contained"
                    fullWidth
                    style={{ margin: "5px", color: "white" }}
                    onClick={props.handleAddFieldPopper}
                >
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
                        style={{ zIndex: 2, }}

                    >
                        <div
                            style={{
                                borderRadius: "5px",
                                boxShadow: "0px 0px 10px -5px rgba(0,0,0,0.5)",
                                alignItems: "center",
                                padding: "10px",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                width: "300px",

                            }}
                        >
                            <Button variant="contained" fullWidth color="primary" style={{ margin: "5px" }}
                                onClick={
                                    props.handleDrawField
                                }
                            >
                                <Typography variant="subtitle1" component="div" style={{ fontSize: "17px" }}>
                                    Draw Field
                                </Typography>
                            </Button>
                            <Button variant="contained" fullWidth color="primary" style={{ margin: "5px" }}
                                onClick={
                                    props.handleUploadField
                                }
                            >
                                <Typography variant="subtitle1" component="div" style={{ fontSize: "17px" }}>
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