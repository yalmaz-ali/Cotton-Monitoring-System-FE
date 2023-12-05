import React, { useState } from "react";
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
    latLngCoordinates,
    deleteSelectedShape,
    addSelectedShape,
    onSubmit
}) => {
    // console.log("fieldData in RenderBar", fieldData);

    const [anchorElAdd, setAnchorElAdd] = useState(null);
    const [selectedElement, setSelectedElement] = useState(null);
    const [isMain, setIsMain] = useState(true);

    const [isEdit, setIsEdit] = useState(false);
    const [fieldName, setFieldName] = useState('');
    const [cropName, setCropName] = useState("");
    const [cropNameToChange, setCropNameToChange] = useState("");
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
        console.log("selectedElement", selectedElement);
        setFieldName(selectedElement.name);
        setCropName(selectedElement.Field_Data.crop_name);
    };

    const handleFieldNameChange = (event) => {
        setFieldName(event.target.value);
    };


    const handleEditSubmit = async () => {
        await editedField(selectedElement.id, fieldName, cropNameToChange);
        setIsEdit(false);
        setIsMain(true);
        // edit(false, selectedElement.id);
        setFieldName("");
        setCropName("");
        setCropNameToChange("");
    };

    const handleEditCancel = () => {
        setIsEdit(false);
        setIsMain(true);
        edit(false, selectedElement.id);
        setFieldName("");
        setCropName("");
        setCropNameToChange("");
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
        <div style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#eeeff2",
            width: "30%",
            height: "100%",
            boxShadow: "inset -10px 0px 10px -10px rgba(0,0,0,0.5)"
        }}>
            <div>
                <h1 style={{ textAlign: "center" }}>Fields</h1>
            </div>
            {isEdit &&
                <EditForm
                    fieldName={fieldName}
                    handleFieldNameChange={handleFieldNameChange}
                    cropName={cropName}
                    setCropNameToChange={setCropNameToChange}
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
                    latLngCoordinates={latLngCoordinates}
                    onSubmit={onSubmit}
                    fieldName={fieldName}
                    setFieldName={setFieldName}
                    handleFieldNameChange={handleFieldNameChange}
                />
            }
        </div >
    );
};

export default RenderFields;