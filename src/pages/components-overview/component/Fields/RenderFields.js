import React, { useEffect, useState } from "react";
import { Divider, Chip } from "@mui/material";
import MainForm from "./MainForm";
import EditForm from "./EditForm";
import FieldDrawForm from "./FieldDrawForm";

const RenderFields = ({
    fieldData,
    deleteField,
    edit,
    editedField,
    handleFieldClick,
    drawingManager,
    flagFieldComplete,
    deleteSelectedShape,
    addSelectedShape,
    onSubmit
}) => {
    // console.log("fieldData in RenderBar", fieldData);

    const [anchorElAdd, setAnchorElAdd] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);
    const [isMain, setIsMain] = useState(true);

    const [isEdit, setIsEdit] = useState(false);
    const [name, setName] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);

    const [isDrawing, setIsDrawing] = useState(false);

    const handleAddFieldPopper = (event) => {
        event.stopPropagation();
        setAnchorElAdd(anchorElAdd ? null : event.currentTarget);
    };
    const handleCloseAddFieldPopper = () => {
        setAnchorElAdd(null);
    };

    const open = Boolean(anchorElAdd);
    const id = open ? "simple-popper" : undefined;

    const handleMenuClick = (event, element) => {
        console.log("event", event);
        setAnchorEl(event.currentTarget); // Use event.currentTarget as the anchor element
        setSelectedElement(element);
    };

    const handleDrawField = () => {
        drawingManager.setDrawingMode(window.google.maps.drawing.OverlayType.POLYGON);
        setAnchorElAdd(null);
        setIsDrawing(true);
        setIsMain(false);
    };

    const handleUploadField = () => {
        console.log("Upload field");
        setAnchorElAdd(null);
    };

    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const handleEdit = () => {
        handleCloseMenu();
        setIsEdit(true);
        setIsMain(false);
        edit(true, selectedElement.id);
        setName(selectedElement.name);
    };

    const handleNameChange = (event) => {
        setName(event.target.value);
    };

    const handleEditSubmit = async () => {
        await editedField(selectedElement.id, name);
        setIsEdit(false);
        setIsMain(true);
    };

    const handleEditCancel = () => {
        setIsEdit(false);
        setIsMain(true);
        edit(false, selectedElement.id);
    };

    const handleDelete = () => {
        console.log("Delete element with id:", selectedElement.id);
        handleCloseMenu();
        const confirmDelete = window.confirm("Are you sure you want to delete this field?");

        if (confirmDelete) {
            deleteField(selectedElement.id);
        }
    };



    const handleDeleteFieldDraw = async () => {
        console.log("Delete field draw");
        await deleteSelectedShape();
        setIsDrawing(false);
        setIsMain(true);
        drawingManager.setDrawingMode(null);
    };

    const handleAddFieldDraw = async () => {
        await addSelectedShape();
        setIsDrawing(false);
        setIsMain(true);
        drawingManager.setDrawingMode(null);
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#eeeff2", width: "25%", height: "100%", boxShadow: "inset -10px 0px 10px -10px rgba(0,0,0,0.5)" }}>
            <div>
                <h1 style={{ textAlign: "center" }}>Fields</h1>
            </div>
            {isEdit &&
                <EditForm
                    name={name}
                    handleNameChange={handleNameChange}
                    handleEditSubmit={handleEditSubmit}
                    handleEditCancel={handleEditCancel}
                />
            }
            {isMain &&
                <MainForm
                    fieldData={fieldData}
                    handleFieldClick={handleFieldClick}
                    handleMenuClick={handleMenuClick}
                    anchorEl={anchorEl}
                    handleCloseMenu={handleCloseMenu}
                    handleEdit={handleEdit}
                    handleDelete={handleDelete}
                    handleAddFieldPopper={handleAddFieldPopper}
                    handleCloseAddFieldPopper={handleCloseAddFieldPopper}
                    id={id}
                    open={open}
                    anchorElAdd={anchorElAdd}
                    handleDrawField={handleDrawField}
                    handleUploadField={handleUploadField}
                />
            }
            {isDrawing &&
                <FieldDrawForm
                    handleDeleteFieldDraw={handleDeleteFieldDraw}
                    handleAddFieldDraw={handleAddFieldDraw}
                    flagFieldComplete={flagFieldComplete}
                    onSubmit={onSubmit}
                />
            }
        </div >
    );
};

export default RenderFields;