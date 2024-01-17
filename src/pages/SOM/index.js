import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Map from '../components-overview/component/Map'
import LoadingScreen from "components/LoadingScreen/index";
import axios from "axios";

const SOM = ({ farm, season, Som }) => {

    const navigate = useNavigate();

    const [mainMap, setMainMap] = useState(null); // Map reference state
    const [selectedFarmId, setSelectedFarmId] = useState(farm);
    const [selectedSeasonId, setSelectedSeasonId] = useState(season);

    const [fieldData, setFieldData] = useState([]);
    const [openLoading, setOpenLoading] = useState(false);

    const [polygons, setPolygons] = useState([]);
    const [som, setSom] = useState(Som);
    const [clickedPolygon, setClickedPolygon] = useState(null);

    const handleMapLoad = (map) => {
        setMainMap(map); // Update the map reference
    };

    const handleDrawingManager = (drawingManager) => {
        console.log(drawingManager);
    }


    const fetchFieldData = async (farmId, seasonID) => {
        setOpenLoading(true); // start loading screen

        setFieldData([]);
        try {
            const response = await axios.get(`http://localhost:8000/api/field/${farmId}/${seasonID}/`, { withCredentials: true });
            console.log("response data fields:", response.data);
            setFieldData(response.data.fields_data);
            if (response.data.fields_data.length === 0) {
                ClearMap();
            }
        } catch (error) {
            console.error("Error fetching field data:", error);
            setFieldData([]);
        } finally {
            setOpenLoading(false); // stop loading screen
        }
    };

    function ClearMap() {
        // Clear the previous polygons from the map
        polygons.forEach((polygon) => {
            polygon.setMap(null);
        });
        setPolygons([]);
    };


    function RenderFieldData() {
        ClearMap();
        console.log("Before rendering:", fieldData);

        fieldData.forEach(async (field) => {
            let fieldPolygon = null;

            const coordinates = JSON.parse(field.Field_Data.coordinates);

            const polygonCoordinates = coordinates.map((coord) => ({
                lat: parseFloat(coord.lat),
                lng: parseFloat(coord.lng),
            }));

            const hasAvgNDVI = typeof field.Field_Data.avg_ndvi === 'number';

            if (hasAvgNDVI) {
                fieldPolygon = new window.google.maps.Polygon({
                    paths: polygonCoordinates,
                    strokeColor: "yellow",
                    strokeOpacity: 1,
                    strokeWeight: 2,
                    fillOpacity: 0,
                    clickable: true
                });

                fieldPolygon.area = field.Field_Data.area;
                fieldPolygon.crop_name = field.Field_Data.crop_name;
                fieldPolygon.avg_ndvi = field.Field_Data.avg_ndvi;
                fieldPolygon.Field_Grid = field.Field_Data.Field_Grid;

            } else {
                // Create a polygon with black fill for the field
                fieldPolygon = new window.google.maps.Polygon({
                    paths: polygonCoordinates,
                    strokeColor: "black",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "black",
                    fillOpacity: 0.35,
                    clickable: false,
                });

                fieldPolygon.area = "N/A";
                fieldPolygon.crop_name = "N/A";
                fieldPolygon.avg_ndvi = "N/A";
                fieldPolygon.Field_Grid = [];
            }

            console.log(coordinates);

            // Set the polygon name and coordinates as properties
            console.log("fieldPolygon", fieldPolygon);
            fieldPolygon.fieldName = field.name;
            fieldPolygon.id = field.id;
            fieldPolygon.coordinates = polygonCoordinates;

            window.google.maps.event.addListener(fieldPolygon, "click", function (event) {

                setClickedPolygon(fieldPolygon);

                // add the id of FieldPolygon in the url of the page
                navigate(`/SOM/${fieldPolygon.id}`, { replace: true });

                const polygonBounds = new window.google.maps.LatLngBounds();
                fieldPolygon.coordinates.forEach((coord) => {
                    polygonBounds.extend(coord);
                });
                mainMap.fitBounds(polygonBounds);
                mainMap.setZoom(19);

            });
            fieldPolygon.setMap(mainMap);
            console.log("fieldPolygon:", fieldPolygon);

            setPolygons((polygons) => [...polygons, fieldPolygon]);
        });
    };


    useEffect(() => {
        console.log("fieldData:", fieldData);
        if (fieldData.length !== 0) {
            RenderFieldData();
            // fieldPolygon.setMap(null);
            // InitMap();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fieldData])

    useEffect(() => {
        ClearMap();
        if (selectedFarmId && selectedSeasonId) {
            fetchFieldData(selectedFarmId, selectedSeasonId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSeasonId]);

    useEffect(() => {
        setSelectedFarmId(farm);
        setSelectedSeasonId(season);
    }, [farm, season]);

    useEffect(() => {
        setSom(Som);
    }, [Som]);

    useEffect(() => {
        if (mainMap) {
            mainMap.addListener("click", () => {
                navigate(`/SOM`, { replace: true });
            });
        }
    }, [mainMap]);

    useEffect(() => {
        if (polygons.length > 0) {
            const bounds = new window.google.maps.LatLngBounds();

            polygons.forEach(polygon => {
                if (Array.isArray(polygon.coordinates)) {
                    polygon.coordinates.forEach(coordPair => {
                        bounds.extend(new window.google.maps.LatLng(coordPair.lat, coordPair.lng));
                    });
                }
            });

            mainMap.fitBounds(bounds);
        }
    }, [polygons]);

    return (
        <div style={{
            display: "flex",
            flexDirection: "row",
            height: "calc(100vh - 60px)"
        }}>
            <Map
                handleMapLoad={handleMapLoad}
                handleDrawingManager={handleDrawingManager}
                width={"100%"}
                widthSmall={"100%"}
            />
            <LoadingScreen openLoading={openLoading} />
        </div>
    );
}

export default SOM;