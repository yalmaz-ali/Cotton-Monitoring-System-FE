import React, { useState } from "react";
import MainForm from "./MainForm";
import EditForm from "./EditForm";
import FieldDrawForm from "./FieldDrawForm";
import { useMediaQuery } from '@mui/material';
import KmlModal from "components/KmlModal/index";
import KmlUploadForm from "./KmlUploadForm";

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
    onSubmit,
    mainMap
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

    const [isUpload, setIsUpload] = useState(false);
    const [file, setFile] = useState(null);
    const [polygons, setPolygons] = useState([]);
    const [isKmlUploaded, setIsKmlUploaded] = useState(false);

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
        setIsUpload(true);
        setIsKmlUploaded(true);
        setIsMain(false);
    };

    const handleCloseUpload = () => {
        setIsUpload(false);
        setFile(null);
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



    const handleFileUpload = async () => {
        await FileUpload(file);
        setIsUpload(false);
        setFile(null);
    };

    const handleCancelKml = () => {
        setIsKmlUploaded(false);
        setIsMain(true);
        setPolygons([]);
        mappedPolygons.forEach(polygon => polygon.setMap(null));
        setMappedPolygons([]);
    };

    const [mappedPolygons, setMappedPolygons] = useState([]);

    const FileUpload = async (file) => {
        let fileReader = new FileReader();
        fileReader.onload = async (event) => {
            let polygons = await ParserFile(event.target.result);
            console.log("polygons", polygons);
            let infoWindow = new window.google.maps.InfoWindow();
            for (const polygon of polygons.polygons) {
                let newPolygon = new window.google.maps.Polygon({
                    paths: polygon.paths,
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#FF0000",
                    fillOpacity: 0.35,
                    editable: false,
                    draggable: false,
                    geodesic: false,
                    zIndex: 1,
                });
                newPolygon.setMap(mainMap);
                setMappedPolygons(prevState => [...prevState, newPolygon]);

                // infoWindow for name for each polygon
                newPolygon.addListener("click", (event) => {
                    infoWindow.setMap(null);
                    infoWindow.setContent(polygon.name);
                    infoWindow.setPosition(event.latLng);
                    infoWindow.setMap(mainMap);
                });

            }

            //center map on polygons bounds
            let bounds = new window.google.maps.LatLngBounds();
            for (const polygon of polygons.polygons) {
                for (const path of polygon.paths) {
                    bounds.extend(path);
                }
            }
            mainMap.fitBounds(bounds);



            // const kmlLayer = new window.google.maps.KmlLayer({
            //     url: "file:///E:/Semester%207/FYP/DATA/Rangpur.kml",
            //     map: mainMap, // Replace with your Google Map instance
            //     // preserveViewport: true // Optional: Set to true if you don't want the map to pan and zoom to the KML
            // });

        };
        fileReader.addEventListener('progress', (event) => {
            if (event.loaded && event.total) {
                const percent = (event.loaded / event.total) * 100;
                console.log(`Progress: ${Math.round(percent)}`);
            }
        });
        fileReader.readAsText(file);
    };

    const ParserFile = async (plainText) => {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(plainText, "text/xml");
        console.log("XMLDoc", xmlDoc);
        let googlePolygons = []

        if (xmlDoc.documentElement.nodeName === "kml") {

            for (const item of xmlDoc.getElementsByTagName('Placemark')) {
                let placeMarkName = item.getElementsByTagName('name')[0].childNodes[0].nodeValue.trim()
                let polygons = item.getElementsByTagName('Polygon')

                /** POLYGONS PARSE **/
                let id = Math.random().toString(36).substr(2, 9);
                for (const polygon of polygons) {
                    let coords = polygon.getElementsByTagName('coordinates')[0].childNodes[0].nodeValue.trim()
                    let points = coords.split(" ")

                    let googlePolygonsPaths = []
                    for (const point of points) {
                        let coord = point.split(",")
                        googlePolygonsPaths.push(new window.google.maps.LatLng(+coord[1], +coord[0]))
                    }
                    // Calculate the area of the polygon in hectares
                    let area = window.google.maps.geometry.spherical.computeArea(googlePolygonsPaths) / 10000;

                    //also assign a unqiue id to each polygon
                    googlePolygons.push({ name: placeMarkName, paths: googlePolygonsPaths, id: id, area: area });

                }

            }
        } else {
            console.log("Invalid file");
        }
        setPolygons(googlePolygons);

        return { polygons: googlePolygons }

    }


    const matchesXs = useMediaQuery((theme) => theme.breakpoints.down('md'));

    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#eeeff2",
            width: matchesXs ? "50%" : "30%",
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
            {isKmlUploaded &&
                <KmlUploadForm
                    polygons={polygons}
                    handleCancelKml={handleCancelKml}
                />
            }
            <KmlModal
                isUpload={isUpload}
                setIsUpload={setIsUpload}
                handleCloseUpload={handleCloseUpload}
                file={file}
                setFile={setFile}
                handleFileUpload={handleFileUpload}
            />
        </div >
    );
};

export default RenderFields;