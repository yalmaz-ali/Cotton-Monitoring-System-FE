import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import Map from "../components-overview/component/Map";
import RenderFields from "pages/components-overview/Fields/RenderFields";
import LoadingScreen from "components/LoadingScreen/index";
import PalleteBar from "components/PalleteBar/index";
import { createRoot } from 'react-dom/client';
import { useNavigate, useParams } from "react-router-dom";
import loading_GIF from "assets/loading_GIF2.gif";
import Cookies from "js-cookie";

const Fields = ({
  farm,
  season,
  filling,
  value,
  flag
}) => {
  const { fieldId, date } = useParams();

  const navigate = useNavigate();

  const paletteBarRef = useRef(null);

  const [openLoading, setOpenLoading] = useState(false);

  const [selectedFarmId, setSelectedFarmId] = useState(farm);
  const [selectedSeasonId, setSelectedSeasonId] = useState(season);

  const [coordinates, setCoordinates] = useState([]);
  const [gridPoints, setGridPoints] = useState([]);

  const [mainMap, setMainMap] = useState(null);
  // let [fieldPolygon, setfieldPolygon] = useState(null);

  const [polygons, setPolygons] = useState([]);
  const [ndviMarkers, setNdviMarkers] = useState([]);
  const [gridPolygons, setGridPolygons] = useState([]);
  const [singleFieldPolygons, setSingleFieldPolygons] = useState([]);

  let [deleteWindow, setDeleteWindow] = useState(null);

  const [fieldData, setFieldData] = useState([]);
  const [dataField, setDataField] = useState([]);

  const [selectedFilling, setSelectedFilling] = useState("No Filling");
  const [fieldSelectFlag, setFieldSelectFlag] = useState(false);
  const [selectedValue, setSelectedValue] = useState("No Value");


  const [drawingManager, setDrawingManager] = useState(null);

  const [successSB, setSuccessSB] = useState(false);
  const [errorSB, setErrorSB] = useState(false);
  const [warningSB, setWarningSB] = useState(false);

  const openSuccessSB = () => setSuccessSB(true);
  const closeSuccessSB = () => setSuccessSB(false);
  const openErrorSB = () => setErrorSB(true);
  const closeErrorSB = () => setErrorSB(false);
  const openWarningSB = () => setWarningSB(true);
  const closeWarningSB = () => setWarningSB(false);


  // let mainMap;
  const gridSpacing = 0.000085; // Adjust the spacing as needed
  var points = [];

  const selectedPolygon = useRef(null);
  const [clickedPolygon, setClickedPolygon] = useState(null); // Define clickedPolygon here


  const handleEdit = (value, id) => {
    console.log("value:", value);
    console.log("id:", id);

    polygons.forEach((polygon) => {
      if (polygon.id === id) {
        polygon.setEditable(value); // Make the clicked polygon editable
      }
    });
  };

  const handleEditField = (id, name, cropName) => {
    console.log("id:", id);
    console.log("name:", name);
    polygons.forEach((polygon) => {
      if (polygon.id === id) {
        updateField(polygon, name, cropName);
      }
    });
  };

  const handleFieldClick = (id) => {
    console.log("id:", id);
    console.log(typeof id);
    console.log("polygons", polygons);
    const selectedPolygon = polygons.find((polygon) => polygon.id === id);

    console.log("selectedPolygon:", selectedPolygon);
    const polygonBounds = new window.google.maps.LatLngBounds();
    selectedPolygon.coordinates.forEach((coord) => {
      polygonBounds.extend(coord);
    });
    mainMap.fitBounds(polygonBounds);
    mainMap.setZoom(19);

  };

  const handleMapLoad = (map) => {
    setMainMap(map); // Update the map reference
  };
  const handleDrawingManager = (drawingManager) => {
    console.log("drawingManager:", drawingManager);
    setDrawingManager(drawingManager); // Update the drawingManager reference
  };

  const handleFieldSubmission = async (fieldName, cropName) => {
    setOpenLoading(true); // start loading screen

    console.log("Field Name:", fieldName);
    console.log("Selected Farm ID:", selectedFarmId);
    console.log("Coordinates:", coordinates);
    console.log("Selected Season id:", selectedSeasonId);

    const formattedCoords = formattedCoordinates(coordinates);
    console.log("Formatted Coordinates:", formattedCoords);

    if (selectedFarmId !== "" && selectedSeasonId !== "") {
      const Data = {
        Field: {
          name: fieldName,
          farm: selectedFarmId,
          coordinates: JSON.stringify(formattedCoords),
        },
      };
      try {
        const response = await axios.post("http://localhost:8000/api/field/", Data, {
          headers: {
            'X-CSRFToken': Cookies.get('csrftoken')
          }, withCredentials: true
        });
        var data = (response.data); // Pass the newly added farm data to the parent component
        console.log("response after adding field:", data);
        openSuccessSB();

        const newField = {
          ...data.Field,
          isCalculating: true,
          cropName: cropName,
        };
        // setIsCalculating(true);
        setFieldData([...fieldData, newField]);
        // calculateNDVIAndFieldGrid(newField.id);

        // fetchFieldData(selectedFarmId, selectedSeasonId);
      } catch (error) {
        console.error("Error adding farm:", error);
        openErrorSB();
      } finally {
        setOpenLoading(false); // stop loading screen
      }

      // Reset the state and close the dialog
      // setCoordinates([]);
    } else {
      setOpenLoading(false); // stop loading screen
      openWarningSB();
    }
  };

  const calculateNDVIAndFieldGrid = async (fieldId, coordinates, fieldPoints, cropName) => {
    setOpenLoading(true); // start loading

    // Define the data to be sent in the POST request
    console.log("calculate, seasonID", selectedSeasonId);
    console.log("calculate, fieldPoints", fieldPoints);

    const crop = cropName ? cropName : null;

    const requestData = {
      Field_Data: {
        season: selectedSeasonId, // Replace with the actual selected season ID
        coordinates: JSON.stringify(coordinates), // Replace with your coordinates data
        crop_name: crop,
      },
      Field_Grid: {
        lat_lng: JSON.stringify(fieldPoints), // Replace with your coordinates data
      },
    };
    console.log("sent........");
    if (coordinates && fieldPoints) {
      try {
        // Send a POST request to initiate NDVI and field_grid calculation
        const response = await axios.post(`http://localhost:8000/api/field/putStats/${fieldId}/`, requestData, {
          headers: {
            'X-CSRFToken': Cookies.get('csrftoken')
          }, withCredentials: true
        });
        console.log("data ndvi:", response.data);
        fetchFieldData(selectedFarmId, selectedSeasonId);
      } catch (error) {
        console.error("Error calculating NDVI and field_grid:", error);
        // Handle the error, e.g., show an error message to the user
      } finally {
        setOpenLoading(false); // stop loading screen
      }

    } else {
      setOpenLoading(false); // stop loading screen
      console.log("Unfilled Data");
    }
  };

  function formattedCoordinates(coordinates) {
    return coordinates.map(coord => ({
      lat: parseFloat(coord.split(',')[0]),
      lng: parseFloat(coord.split(',')[1])
    }));
  }

  const fetchFieldData = async (farmId, seasonID) => {
    setOpenLoading(true); // start loading screen

    console.log("before get farmID:", farmId);
    console.log("before get seasonID:", seasonID);

    setFieldData([]);
    try {
      const response = await axios.get(`http://localhost:8000/api/field/${farmId}/${seasonID}/`, { withCredentials: true });
      console.log("response dataaa:", response.data);
      setFieldData(response.data.fields_data);
      setDataField(response.data.fields_data);
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

  async function deleteField(fieldId) {
    setOpenLoading(true); // start loading screen
    try {
      await axios.delete(`http://localhost:8000/api/field/deleteField/${fieldId}/${selectedSeasonId}/`,
        {
          headers: {
            'X-CSRFToken': Cookies.get('csrftoken')
          },
          withCredentials: true
        });
      fetchFieldData(selectedFarmId, selectedSeasonId);
    } catch (error) {
      console.error("Error deleting field:", error);
      alert("Error Deleting Field");
    } finally {
      setOpenLoading(false); // stop loading screen
    }
  };

  function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val.lat === b[index].lat && val.lng === b[index].lng);
  }

  async function updateField(fieldPolygon, name, crop_name) {
    setOpenLoading(true); // start loading screen
    var data = null;
    console.log("fieldPolygon", fieldPolygon);

    const updatedCoordinates = fieldPolygon.getPath().getArray().map(coord => ({
      lat: parseFloat(parseFloat(coord.lat()).toFixed(4)),
      lng: parseFloat(parseFloat(coord.lng()).toFixed(4))
    }));
    console.log("fieldPolygon.coordinates.length", fieldPolygon.coordinates);
    console.log("updatedCoordinates.length", updatedCoordinates);

    if (arraysEqual(fieldPolygon.coordinates, updatedCoordinates)) {
      console.log("same");
      data = {
        "Field": {
          "name": name
        },
        "Field_Data": {
          "crop_name": crop_name
        },
        "Field_Grid": {
        }
      }

    } else {
      console.log("not same");
      points = await CalculatePoints(updatedCoordinates);
      data = {
        "Field": {
          "name": name
        },
        "Field_Data": {
          "coordinates": JSON.stringify(updatedCoordinates),
          "crop_name": crop_name
        },
        "Field_Grid": {
          "lat_lng": JSON.stringify(points)
        }
      }

    }

    // console.log(name);
    // console.log(crop_name);
    // console.log(updatedCoordinates);


    fieldPolygon.setEditable(false);
    console.log("data:", data);
    // Send a patch request to update the polygon data
    try {
      const response = await axios.patch(`http://localhost:8000/api/field/patchField/${fieldPolygon.id}/${selectedSeasonId}/`, data, {
        headers: {
          'X-CSRFToken': Cookies.get('csrftoken')
        }, withCredentials: true
      });
      console.log("fieldUpdated:", response.data);
      fetchFieldData(selectedFarmId, selectedSeasonId);
    } catch (error) {
      console.error("Error updating field:", error);
    } finally {
      setOpenLoading(false); // stop loading screen
    }
    setOpenLoading(false); // stop loading screen

  }

  function getAvgNdviColor(ndvi) {
    const colorScale = [
      { min: 0, max: 0.09, color: "#422112" },
      { min: 0.1, max: 0.14, color: "#7f4020" },
      { min: 0.15, max: 0.19, color: "#b76135" },
      { min: 0.2, max: 0.24, color: "#c6974e" },
      { min: 0.25, max: 0.29, color: "#e6c957" },
      { min: 0.3, max: 0.34, color: "#fdfe03" },
      { min: 0.35, max: 0.39, color: "#e6ec06" },
      { min: 0.4, max: 0.44, color: "#d0df00" },
      { min: 0.45, max: 0.49, color: "#b9cf02" },
      { min: 0.5, max: 0.54, color: "#a2c000" },
      { min: 0.55, max: 0.59, color: "#8aaf00" },
      { min: 0.6, max: 0.64, color: "#72a000" },
      { min: 0.65, max: 0.69, color: "#5b8e03" },
      { min: 0.7, max: 0.74, color: "#458100" },
      { min: 0.75, max: 0.79, color: "#2d7000" },
      { min: 0.8, max: 0.84, color: "#25602d" },
      { min: 0.85, max: 0.89, color: "#15542d" },
      { min: 0.9, max: 0.94, color: "#15442d" },
      { min: 0.95, max: 1.00, color: "#113a26" }
    ];

    for (const scale of colorScale) {
      if (ndvi >= scale.min && ndvi <= scale.max) {
        return scale.color;
      }
    }

    return "#000000"; // Default color for undefined NDVI values
  };

  function getCropColor(cropName) {
    const cropColors = {
      "Alfalfa": "#FFA07A",
      "Apple": "#7FFF00",
      "Apricot": "#FF4500",
      "Artichoke": "#20B2AA",
      "Asparagus": "#00CED1",
      "Avocado": "#32CD32",
      "Banana": "#FFD700",
      "Barley": "#DAA520",
      "Bean": "#8A2BE2",
      "Beet": "#DC143C",
      "Blackberry": "#8B008B",
      "Blackgram": "#FF6347",
      "Blueberry": "#4169E1",
      "Broccoli": "#00FF00",
      "Brussels Sprouts": "#228B22",
      "Cabbage": "#7CFC00",
      "Cantaloupe": "#FF8C00",
      "Carrot": "#FFA500",
      "Cauliflower": "#FFFACD",
      "Cherry": "#FF69B4",
      "Chickpea": "#9932CC",
      "Coconut": "#FFE4C4",
      "Coffee": "#A0522D",
      "Cotton": "#FF0000",
      "Cranberry": "#DCDCDC",
      "Cucumber": "#00FFFF",
      "Date Palm": "#800080",
      "Eggplant": "#9370DB",
      "Fig": "#FF1493",
      "Garlic": "#2E8B57",
      "Ginger": "#FFFF00",
      "Grapes": "#4B0082",
      "Hazelnut": "#FF8C69",
      "Jute": "#008080",
      "Kale": "#7B68EE",
      "Kiwi": "#8B4513",
      "Lemon": "#F0E68C",
      "Lentil": "#DDA0DD",
      "Lettuce": "#90EE90",
      "Lychee": "#F08080",
      "Maize": "#FF7F50",
      "Mango": "#FFB6C1",
      "Moth Beans": "#800000",
      "Mung Bean": "#66CDAA",
      "Muskmelon": "#FF00FF",
      "Nectarine": "#FA8072",
      "No Cotton": "white",
      "Olive": "#808000",
      "Onion": "#8ea2f0",
      "Orange": "#fcad1b",
      "Other Crop": "#FFFFFF",
      "Papaya": "#FFEFD5",
      "Peach": "#FFDAB9",
      "Pear": "#E9967A",
      "Pigeon Peas": "#105a03",
      "Pineapple": "#FFE4B5",
      "Plum": "#ed593f",
      "Pomegranate": "#ff0000",
      "Potato": "#be6141",
      "Quinoa": "#F0FFF0",
      "Raspberry": "#c532e9",
      "Rice": "#938175",
      "Soybean": "#2c7823",
      "Spinach": "#104316",
      "Sugarcane": "#7760a8",
      "Strawberry": "#ff595e",
      "Sweet Potato": "#D2691E",
      "Taro": "#c0bebe",
      "Tomato": "#e4180e",
      "Walnut": "#A52A2A",
      "Watermelon": "#418125",
      "Wheat": "#F5DEB3",
      "Yam": "#68a4a8",
      "Zucchini": "#1e0ead"
    };

    return cropName ? (cropColors[cropName] || "white") : "white";
  }

  function getColorBasedOnNDVI(ndvi) {
    // Define the color stops for the gradient
    const colorStops = [
      { stop: 0, color: '#350801' },
      { stop: 0.0556, color: '#7e1805' },
      { stop: 0.1111, color: '#af3a03' },
      { stop: 0.1667, color: '#ecb225' },
      { stop: 0.2222, color: '#fcd731' },
      { stop: 0.2778, color: '#fee85f' },
      { stop: 0.3333, color: '#fefe00' },
      { stop: 0.3889, color: '#f2f900' },
      { stop: 0.4444, color: '#c4e700' },
      { stop: 0.5, color: '#97d500' },
      { stop: 0.5556, color: '#5fc100' },
      { stop: 0.6111, color: '#379f00' },
      { stop: 0.6667, color: '#1c8300' },
      { stop: 0.7222, color: '#0b6400' },
      { stop: 0.7778, color: '#064b0a' },
      { stop: 0.8333, color: '#033a0f' },
      { stop: 0.8889, color: '#02310c' },
      { stop: 0.9444, color: '#02310c' },
    ];

    // Find the appropriate stops for the given NDVI value
    let minStop, maxStop;
    for (let i = 0; i < colorStops.length - 1; i++) {
      if (ndvi >= colorStops[i].stop && ndvi <= colorStops[i + 1].stop) {
        minStop = colorStops[i];
        maxStop = colorStops[i + 1];
        break;
      }
    }

    if (!minStop || !maxStop) {
      return '#FFFFFF'; // Return white for invalid cases
    }

    // Calculate the percentage interpolation between the stops
    const percentage =
      ((ndvi - minStop.stop) / (maxStop.stop - minStop.stop)) * 100 || 0;

    // Interpolate color based on percentage between stops
    const color = interpolateColor(minStop.color, maxStop.color, percentage);

    return color;
  }

  function getColorContrastedNDVI(ndvi) {
    // Define the color stops for the gradient
    const colorStops = [
      { stop: 0, color: '#960850' },
      { stop: 0.0556, color: '#bf052a' },
      { stop: 0.1111, color: '#e90205' },
      { stop: 0.1667, color: '#f5320c' },
      { stop: 0.2222, color: '#fd6919' },
      { stop: 0.2778, color: '#ff9026' },
      { stop: 0.3333, color: '#ffb133' },
      { stop: 0.3889, color: '#ffd028' },
      { stop: 0.4444, color: '#feef0f' },
      { stop: 0.5, color: '#effc02' },
      { stop: 0.5556, color: '#d0f501' },
      { stop: 0.6111, color: '#a7ee02' },
      { stop: 0.6667, color: '#6be709' },
      { stop: 0.7222, color: '#38dc17' },
      { stop: 0.7778, color: '#1ec73d' },
      { stop: 0.8333, color: '#07b25f' },
      { stop: 0.8889, color: '#099d6b' },
      { stop: 0.9444, color: '#0b8877' },
    ];

    // Find the appropriate stops for the given NDVI value
    let minStop, maxStop;
    for (let i = 0; i < colorStops.length - 1; i++) {
      if (ndvi >= colorStops[i].stop && ndvi <= colorStops[i + 1].stop) {
        minStop = colorStops[i];
        maxStop = colorStops[i + 1];
        break;
      }
    }

    if (!minStop || !maxStop) {
      return 'white'; // Return white for invalid cases
    }

    // Calculate the percentage interpolation between the stops
    const percentage =
      ((ndvi - minStop.stop) / (maxStop.stop - minStop.stop)) * 100 || 0;

    // Interpolate color based on percentage between stops
    const color = interpolateColor(minStop.color, maxStop.color, percentage);

    return color;
  }

  // Function to interpolate color between two colors based on percentage
  function interpolateColor(startColor, endColor, percentage) {
    const getColorComponent = (start, end) =>
      Math.round(start + (end - start) * (percentage / 100));

    const startRGB = hexToRgb(startColor);
    const endRGB = hexToRgb(endColor);

    const interpolatedColor = {
      r: getColorComponent(startRGB.r, endRGB.r),
      g: getColorComponent(startRGB.g, endRGB.g),
      b: getColorComponent(startRGB.b, endRGB.b),
    };

    return `rgb(${interpolatedColor.r}, ${interpolatedColor.g}, ${interpolatedColor.b})`;
  }

  // Function to convert hex color to RGB object
  function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    return {
      r: (bigint >> 16) & 255,
      g: (bigint >> 8) & 255,
      b: bigint & 255,
    };
  }

  function getPolygonCenter(coordinates) {
    if (coordinates.length === 0) {
      return null;
    }

    let latSum = 0;
    let lngSum = 0;

    coordinates.forEach((coord) => {
      latSum += coord.lat;
      lngSum += coord.lng;
    });

    const latCenter = latSum / coordinates.length;
    const lngCenter = lngSum / coordinates.length;

    return { lat: latCenter, lng: lngCenter };
  }

  function addNDVIMarker(position, ndviValue) {
    console.log("MARKERS");
    let value = " ";
    const labelOptions = {
      text: value, // Set the label text
      fontSize: '12px', // Adjust the font size as needed
    };
    if (typeof ndviValue === 'number' || typeof ndviValue === 'string') {
      value = (typeof ndviValue === 'number') ? ndviValue.toFixed(3) : ndviValue;
      value = value.length > 12 ? value.substring(0, 10) + '...' : value; // Truncate the string if it's longer than 12 characters
      labelOptions.text = value; // Set the label text
      labelOptions.color = 'black'; // Set the text color to white
    }

    const marker = new window.google.maps.Marker({
      position: position,
      map: mainMap,
      label: labelOptions,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 0, // Set scale to 0 to hide the default marker icon
      },
    });

    setNdviMarkers((markers) => [...markers, marker]);
  };


  function ClearMap() {
    if (deleteWindow) {
      deleteWindow.close();
    }
    // Clear the previous polygons from the map
    polygons.forEach((polygon) => {
      polygon.setMap(null);
    });
    setPolygons([]);

    // Clear the previous NDVI markers
    ndviMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    setNdviMarkers([]);

    ClearGrid();

    singleFieldPolygons.forEach((polygon) => {
      polygon.setMap(null);
    });
    setSingleFieldPolygons([]);

  };

  function CalculatePoints(polygonCoordinates) {
    return new Promise((resolve) => {
      console.log("polygonCoordinates:", polygonCoordinates);
      const polygonBounds = new window.google.maps.LatLngBounds();
      const points = [];
      polygonCoordinates.forEach((coord) => {
        polygonBounds.extend(coord);
      });

      for (
        let lat = polygonBounds.getSouthWest().lat() + gridSpacing / 2;
        lat <= polygonBounds.getNorthEast().lat();
        lat += gridSpacing
      ) {
        for (
          let lng = polygonBounds.getSouthWest().lng() + gridSpacing / 2;
          lng <= polygonBounds.getNorthEast().lng();
          lng += gridSpacing
        ) {
          const point = { lat, lng };
          if (typeof lat === "number" && typeof lng === "number") {
            const latLng = new window.google.maps.LatLng(lat, lng);
            if (window.google.maps.geometry.poly.containsLocation(latLng, new window.google.maps.Polygon({ paths: polygonCoordinates }))) {
              points.push(point);
            }
          }
        }
      }
      resolve(points);
    });
  }

  const [loadingOverlay, setLoadingOverlay] = useState(null);
  let cancelTokenSource = axios.CancelToken.source();

  async function FetchFieldPoints(fieldId, seasonId, date) {

    if (cancelTokenSource) {
      cancelTokenSource.cancel('Operation canceled due to new request.');
    }
    // Create a new cancel token
    cancelTokenSource = axios.CancelToken.source();

    clickedPolygon.setOptions({
      strokeColor: "yellow",
      fillOpacity: 0
    });

    singleFieldPolygons.forEach((polygon) => {
      polygon.setMap(null);
    });
    setSingleFieldPolygons([]);

    const polygonBounds = new window.google.maps.LatLngBounds();
    clickedPolygon.coordinates.forEach((coord) => {
      polygonBounds.extend(coord);
    });

    // Remove the old overlay if it exists on the map
    console.log("loadingOverlay:", loadingOverlay);
    if (loadingOverlay) {
      loadingOverlay.setMap(null);
    }

    // Add a new overlay with the loading GIF
    const overlay = new window.google.maps.GroundOverlay(
      loading_GIF,
      polygonBounds
    );
    overlay.setMap(mainMap);

    setLoadingOverlay(overlay);

    const data = {
      fieldId: fieldId,
      seasonId: seasonId,
      date: date
    };
    console.log("data:", data);
    console.log("filling", filling);
    try {
      console.log("loadingOverlay:", loadingOverlay);
      const response = await axios.post(`http://localhost:8000/api/field/getPointsNdvi/`, data,
        {
          headers: {
            'X-CSRFToken': Cookies.get('csrftoken')
          }, withCredentials: true
        });
      console.log("response data:", response.data);
      // RendergridData(response.data.Field_Grid, filling);
      setPastData(response.data.Field_Grid);
    } catch (error) {
      if (axios.isCancel(error)) {
        console.log('Request canceled:', error.message);
      } else {
        console.error("Error fetching field data:", error);
      }
    } finally {
      overlay.setMap(null);
      if (loadingOverlay) {
        loadingOverlay.setMap(null);
      }
    }
  };

  const [pastData, setPastData] = useState([]);

  useEffect(() => {
    if (date && fieldId) {
      console.log("running!!");
      FetchFieldPoints(fieldId, selectedSeasonId, date);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, fieldId]);

  function ChangeMarker() {

    console.log("polygons:", polygons);
    console.log("selectedValue:", selectedValue);

    if (!polygons) {
      return;
    }
    ndviMarkers.forEach((marker) => {
      marker.setMap(null);
    });
    setNdviMarkers([]);

    if (selectedValue === "Without Values") {
      polygons.forEach((polygon) => {
        polygon.marker = null;
      });
    }
    else if (selectedValue === "Field names") {
      polygons.forEach((polygon) => {
        polygon.marker = polygon.fieldName;
      });
    } else if (selectedValue === "Area") {
      polygons.forEach((polygon) => {
        polygon.marker = polygon.area + " ha";
      });
    }
    else if (selectedValue === "Crop") {
      polygons.forEach((polygon) => {
        polygon.marker = polygon.crop_name;
      });
    }
    else if (selectedValue === "Average NDVI") {
      polygons.forEach((polygon) => {
        polygon.marker = polygon.avg_ndvi;
      });
    }

    polygons.forEach((polygon) => {
      addNDVIMarker(getPolygonCenter(polygon.coordinates), polygon.marker);
    }
    );

  }

  const ClearGrid = () => {
    isRectangleOnMap = false;

    gridPolygons.forEach((polygon) => {
      polygon.setMap(null);
      window.google.maps.event.clearInstanceListeners(polygon);
    });
    setGridPolygons([]);
  };

  const getOptionsBasedOnFilling = (filling, polygon) => {
    switch (filling) {
      case "No Filling":
        return {
          strokeColor: "yellow",
          strokeOpacity: 1,
          strokeWeight: 2,
          fillOpacity: 0,
          clickable: true
        };
      case "Average NDVI":
        return {
          strokeColor: "black",
          strokeOpacity: 1,
          strokeWeight: 1,
          fillColor: polygon.avg_ndvi ? getAvgNdviColor(polygon.avg_ndvi) : "black",
          fillOpacity: 1,
          clickable: true
        };
      case "NDVI":
      case "Contrasted NDVI":
        return {
          strokeColor: "yellow",
          fillOpacity: 0,
          clickable: false,
        };
      case "Crop":
        return {
          strokeColor: "black",
          strokeOpacity: 1,
          strokeWeight: 1,
          fillColor: polygon.crop_name ? getCropColor(polygon.crop_name) : "white",
          fillOpacity: 1,
          clickable: true
        };
      default:
        return {};
    }
  };
  const ChangeFilling = useCallback(() => {
    if (!polygons) {
      return;
    }
    ClearGrid();

    const mouseMoveHandler = (polygon) => {
      polygon.setOptions({
        strokeColor: "white",
        strokeOpacity: 1,
        strokeWeight: 4,
      });
      selectedPolygon.current = polygon; // Update the selected polygon
    };

    const mouseOutHandler = (polygon) => {
      if (selectedPolygon.current) {
        const options = ["No Filling", "NDVI", "Contrasted NDVI"].includes(selectedFilling)
          ? { strokeColor: "yellow", strokeOpacity: 1, strokeWeight: 2 }
          : { strokeColor: "black", strokeOpacity: 1, strokeWeight: 1 };
        selectedPolygon.current.setOptions(options);
      }
    };

    const listeners = [];

    polygons.forEach((polygon) => {
      // Add a click event listener to each polygon
      listeners.push(polygon.addListener("mousemove", () => mouseMoveHandler(polygon)));
      listeners.push(polygon.addListener("mouseout", () => mouseOutHandler(polygon)));

      const options = getOptionsBasedOnFilling(selectedFilling, polygon);
      polygon.setOptions(options);

      if (selectedFilling === "NDVI" || selectedFilling === "Contrasted NDVI") {
        const field_Grid = polygon.Field_Grid;
        if (field_Grid !== undefined && field_Grid.length > 0) {
          RendergridData(field_Grid, selectedFilling);
        }
      }
    });

    // Return a cleanup function
    return () => {
      listeners.forEach(listener => listener.remove());
    };
  }, [polygons, selectedFilling]);

  function ChangeSingleFilling() {
    console.log("fieldId", fieldId);
    console.log("clickedPolygon", clickedPolygon);

    clickedPolygon.setOptions({
      strokeColor: "yellow",
      fillOpacity: 0
    });

    singleFieldPolygons.forEach((polygon) => {
      polygon.setMap(null);
    });
    setSingleFieldPolygons([]);
    
    if (selectedFilling === "NDVI" || selectedFilling === "Contrasted NDVI") {
      if (pastData) {
        RendergridData(pastData, selectedFilling);
      }
    }else if(selectedFilling === "SOM"){
      fetchSom();
    }
  };

  async function fetchSom(){
    console.log(clickedPolygon);
    
    const polygonBounds = new window.google.maps.LatLngBounds();
    clickedPolygon.coordinates.forEach((coord) => {
      polygonBounds.extend(coord);
    });

    console.log("loadingOverlay:", loadingOverlay);
    if (loadingOverlay) {
      loadingOverlay.setMap(null);
    }

    // Add a new overlay with the loading GIF
    const overlay = new window.google.maps.GroundOverlay(
      loading_GIF,
      polygonBounds
    );
    overlay.setMap(mainMap);

    setLoadingOverlay(overlay);


    const data={
      coordinates:JSON.stringify (clickedPolygon.coordinates),
      date : date
    }
  console.log("data", data);
  try {
    const response = await axios.post(`http://localhost:8000/api/field/getSOMPrediction/`, data, {
      headers: {
        'X-CSRFToken': Cookies.get('csrftoken')
      },
      withCredentials: true
    });
    console.log("Respoonse SOM:", response.data);
    showSOM(response.data.prediction);
    }catch (error) {
        console.error("Error updating field:", error);
    }  finally {
      overlay.setMap(null);
      if (loadingOverlay) {
        loadingOverlay.setMap(null);
      }
    }
      
  }

  function showSOM(value){
    console.log(clickedPolygon);
    console.log(value);
    if(value==='high'){
      clickedPolygon.setOptions({
        strokeColor:'green',
        fillColor: 'green',
        fillOpacity:1
      });
    } else if(value==='low'){
      clickedPolygon.setOptions({
        strokeColor:'lightbrown',
        fillColor: 'lightbrown',
        fillOpacity:1
      });
    } else if(value==='moderate'){
      clickedPolygon.setOptions({
        strokeColor:'brown',
        fillColor: 'brown',
        fillOpacity:1
      });
    }else if(value==='adequate'){
      clickedPolygon.setOptions({
        strokeColor:'lightgreen',
        fillColor: 'lightgreen',
        fillOpacity:1
      });
    } 

  }

  useEffect(() => {
    if (clickedPolygon) {
      ChangeSingleFilling();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pastData]);

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


      // Create an InfoWindow with a Delete button
      let deleteWindowContent = `
        <button id="deleteVertexBtn">Delete</button>
        `;

      let deleteWindow = new window.google.maps.InfoWindow({
        content: deleteWindowContent,
      });

      // Add a click event listener to the "Delete" button
      let deleteVertexBtn = null;
      deleteWindow.addListener("domready", function () {
        deleteVertexBtn = document.getElementById("deleteVertexBtn");
      });

      // Add a closeclick event listener to remove the click event listener from the delete button
      deleteWindow.addListener("closeclick", function () {
        if (deleteVertexBtn) {
          deleteVertexBtn.removeEventListener("click", deleteVertexHandler);
          deleteVertexBtn = null;
        }
      });

      // The click event handler for the delete button
      let deleteVertexHandler = null;
      // Add a mouseover or click event listener
      window.google.maps.event.addListener(fieldPolygon, "click", function (event) {
        if (deleteWindow) {
          deleteWindow.close();
        }

        setClickedPolygon(fieldPolygon);

        // add the id of FieldPolygon in the url of the page
        navigate(`/Field/${fieldPolygon.id}`, { replace: true });

        const polygonBounds = new window.google.maps.LatLngBounds();
        fieldPolygon.coordinates.forEach((coord) => {
          polygonBounds.extend(coord);
        });
        mainMap.fitBounds(polygonBounds);
        mainMap.setZoom(19);

        if (event.vertex !== undefined) { // Check if a vertex was clicked
          const vertexIndex = event.vertex;

          deleteWindow.setPosition(event.latLng);
          deleteWindow.open(mainMap);

          // Remove the previous click event listener
          if (deleteVertexBtn && deleteVertexHandler) {
            deleteVertexBtn.removeEventListener("click", deleteVertexHandler);
          }

          // Add a new click event listener
          deleteVertexHandler = function () {
            const path = fieldPolygon.getPath();
            path.removeAt(vertexIndex); // Remove the clicked vertex

            // Update the polygon with the modified path
            fieldPolygon.setPath(path);

            // Close the InfoWindow
            deleteWindow.close();
          };
          deleteVertexBtn.addEventListener("click", deleteVertexHandler);
        }

      });
      fieldPolygon.setMap(mainMap);
      console.log("fieldPolygon:", fieldPolygon);

      setPolygons((polygons) => [...polygons, fieldPolygon]);

      console.log("field.isCalculating:", field.isCalculating);
      if (field.isCalculating === true) {
        points = await CalculatePoints(polygonCoordinates);
        console.log("points:", points);

        calculateNDVIAndFieldGrid(field.id, coordinates, points, field.cropName);

        field.isCalculating = false;
        checkForAvgNDVI(field);
      }
    });
    console.log("inside render");
    ChangeMarker();
    ChangeFilling();

    if (mainMap) {
      mainMap.addListener("click", () => {

        if (selectedPolygon.current) {
          selectedPolygon.current = null;
        }
        if (deleteWindow) {
          deleteWindow.close();
        }

        navigate(`/Field`, { replace: true });

      });
    }
  };

  async function checkForAvgNDVI(field) {
    setOpenLoading(true); // start loading screen

    const seasonId = selectedSeasonId;
    let itr = 0;

    // Define an interval to check for avg_ndvi data every few seconds
    const interval = setInterval(async () => {
      itr = itr + 1;
      if (itr === 20) {
        clearInterval(interval);
      }
      // Make a request to get the avg_ndvi data for the field by field.id
      try {
        const response = await axios.get(`http://localhost:8000/api/field/getAvgNdvi/${field.id}/${seasonId}/`, { withCredentials: true });
        const data = response.data;
        console.log("data avg:", data);

        const avg_ndvi = response.data.avg_ndvi;
        if (avg_ndvi !== null) {
          // If avg_ndvi is available, update the field and stop checking
          // field.Field_Data.avg_ndvi = avg_ndvi;
          clearInterval(interval);
          // Force a re-render to update the map and remove loading screen
          // ClearMap();
          // setFieldData([...fieldData]); // Assuming you're using React state
          // setDataField(fieldData);
          fetchFieldData(selectedFarmId, selectedSeasonId);
        }
      } catch (error) {
        // Handle errors
        console.error("Error checking for avg_ndvi:", error);
      } finally {
        setOpenLoading(false); // stop loading screen
      }

    }, 1000); // Check every 1 seconds, you can adjust the interval as needed
  }

  let ndviWindow = new window.google.maps.InfoWindow();
  let isRectangleOnMap = false; // Set to true when rectangle is added to the map

  function RendergridData(gridPoints, filling) {
    console.log("gridPoints:", gridPoints);

    gridPoints.forEach((point) => {
      // Parse the lat_lng string into a valid object
      const latLng = JSON.parse(point.lat_lng.replace(/'/g, '"'));

      // Extract latitude and longitude
      const lat = parseFloat(latLng.lat);
      const lng = parseFloat(latLng.lng);

      var color = "#000000";
      const ndviValue = point.ndvi; // Replace with your actual NDVI calculation function
      if (filling === 'NDVI') {
        color = getColorBasedOnNDVI(ndviValue);
      } else if (filling === 'Contrasted NDVI') {
        color = getColorContrastedNDVI(ndviValue);
      }

      // Create a rectangle on the map at the grid point with the calculated color
      const rectangle = new window.google.maps.Rectangle({
        bounds: {
          north: lat + gridSpacing / 2,
          south: lat - gridSpacing / 2,
          east: lng + gridSpacing / 2,
          west: lng - gridSpacing / 2,
        },
        fillColor: color,
        fillOpacity: 1, // Adjust as needed
        strokeWeight: 0,
        zIndex: 1,
        clickable: true,
      });

      rectangle.setMap(mainMap);

      if (fieldSelectFlag) {
        setSingleFieldPolygons((singleFieldPolygons) => [...singleFieldPolygons, rectangle]);
      } else {
        setGridPolygons((gridPolygons) => [...gridPolygons, rectangle]);
      }

      rectangle.addListener("mousemove", (event) => {


        var value = ndviValue.toFixed(3); // Replace with your actual NDVI calculation function

        if (value <= 0) {
          value = "cloud";
        }

        // Create an InfoWindow with the NDVI value
        const ndviWindowContent = `<strong>NDVI:</strong> ${value}`;
        ndviWindow.setContent(ndviWindowContent);

        // Set the InfoWindow position where the mouse hovered over the rectangle
        // ndviWindow.setPosition(event.latLng);
        ndviWindow.setPosition(new window.google.maps.LatLng(event.latLng.lat() + 0.00001, event.latLng.lng()));

        // Open the InfoWindow on the mainMap
        ndviWindow.open(mainMap);

      });
      // Add a mouseout event listener to the map
      rectangle.addListener("mouseout", () => {

        ndviWindow.close(); // Close the InfoWindow

      });
    });
    isRectangleOnMap = true;

  };

  useEffect(() => {
    if (fieldSelectFlag) {

    } else {
      ClearMap();
      if (!selectedSeasonId) {
        setDataField([]);
      }
      if (selectedFarmId && selectedSeasonId) {
        fetchFieldData(selectedFarmId, selectedSeasonId);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSeasonId]);

  useEffect(() => {
    if (polygons.length !== 0) {
      if (fieldSelectFlag) {
        ChangeSingleFilling();
      } else {

        singleFieldPolygons.forEach((polygon) => {
          polygon.setMap(null);
        });
        setSingleFieldPolygons([]);

        if (clickedPolygon) {
          setClickedPolygon(null);
        }

        setPastData([]);

        if (loadingOverlay) {
          loadingOverlay.setMap(null);
          setLoadingOverlay(null);
        }

        ChangeFilling();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilling, polygons]);


  // const ndviMarkersRef = useRef([]);

  useEffect(() => {
    if (polygons.length !== 0) {
      console.log("selectedValue:", selectedValue);
      ChangeMarker();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue]);

  // useEffect(() => {
  //   ndviMarkersRef.current = ndviMarkers;
  // }, [ndviMarkers]);

  // useEffect(() => {
  //   return () => {
  //     console.log("cleanup");
  //     console.log("ndviMarkers:", ndviMarkersRef.current);
  //     ndviMarkersRef.current.forEach((marker) => {
  //       marker.setMap(null);
  //     });
  //     setNdviMarkers([]);
  //   };
  // }, []);

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
    setSelectedFarmId(farm);
    setSelectedSeasonId(season);
  }, [farm, season]);

  useEffect(() => {
    if (filling) {
      console.log("filling:", filling);
      console.log("flag:", flag);
      // if (flag) {
      //   navigate(`/Field/${fieldId}/${date}`, { replace: true });
      // }
      setFieldSelectFlag(flag);
      setSelectedFilling(filling);
    }
  }, [filling, flag])

  useEffect(() => {
    if (value) {
      console.log("value:", value);
      setSelectedValue(value);
    }
  }, [value])

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

  let [selectedShape, setSelectedShape] = useState(null);
  const [latLngCoordinates, setLatLngCoordinates] = useState([]);

  function clearSelection() {
    if (selectedShape) {
      selectedShape.setEditable(false);
      setSelectedShape(null);
    }
  }

  function setSelection(shape) {
    clearSelection();
    setSelectedShape(shape);
    shape.setEditable(true);
  }

  const deleteSelectedShape = () => {
    if (selectedShape) {
      selectedShape.setMap(null);
      coordinates.splice(0, coordinates.length)
      setFlagFieldComplete(false);
    }
  }

  const addSelectedShape = () => {
    // setIsDialogOpen(true);
    // deleteSelectedShape();
    selectedShape.setMap(null);
    setFlagFieldComplete(false);
  }

  const addkmlShape = async (polygon) => {

    console.log("Field Name:", polygon.name);
    console.log("Selected Farm ID:", selectedFarmId);
    console.log("Selected Season id:", selectedSeasonId);

    const formattedCoords = polygon.paths.map(coordPair => ({
      lat: coordPair.lat(),
      lng: coordPair.lng()
    }));

    const fieldName = polygon.name;

    if (selectedFarmId !== "" && selectedSeasonId !== "") {
      const Data = {
        Field: {
          name: fieldName,
          farm: selectedFarmId,
          coordinates: JSON.stringify(formattedCoords),
        },
      };
      try {
        const response = await axios.post("http://localhost:8000/api/field/", Data, {
          headers: {
            'X-CSRFToken': Cookies.get('csrftoken')
          },
          withCredentials: true
        });
        var data = (response.data); // Pass the newly added farm data to the parent component
        console.log("response after adding field:", data);
        const field = data.Field;
        const fieldPoints = await CalculatePoints(formattedCoords);
        console.log("fieldPoints:", fieldPoints);
        const cropName = null;

        calculateNDVIAndFieldGrid(field.id, formattedCoords, fieldPoints, cropName);

      } catch (error) {
        console.error("Error adding farm:", error);
        openErrorSB();
      } finally {
        setOpenLoading(false); // stop loading screen
      }

    } else {
      setOpenLoading(false); // stop loading screen
      openWarningSB();
    }

  };


  var getPolygonCoords = function (newShape) {

    coordinates.splice(0, coordinates.length)

    var len = newShape.getPath().getLength();

    for (var i = 0; i < len; i++) {
      coordinates.push(newShape.getPath().getAt(i).toUrlValue(4))
    }
    console.log(coordinates)

    setLatLngCoordinates(formattedCoordinates(coordinates));

  }

  const [flagFieldComplete, setFlagFieldComplete] = useState(false);

  if (drawingManager) {

    window.google.maps.event.addListener(drawingManager, 'polygoncomplete', function (event) {

      // mainMap.controls[window.google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);
      // mainMap.controls[window.google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv2);

      console.log("polygon");
      setFlagFieldComplete(true);
      event.getPath().getLength();
      window.google.maps.event.addListener(event, "dragend", getPolygonCoords(event));

      window.google.maps.event.addListener(event.getPath(), 'insert_at', function () {
        getPolygonCoords(event)
      });

      window.google.maps.event.addListener(event.getPath(), 'set_at', function () {
        getPolygonCoords(event)
      })
    })

    window.google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
      // all_overlays.push(event);
      // console.log(all_overlays);

      drawingManager.setDrawingMode(null);

      var newShape = event.overlay;
      newShape.type = event.type;
      window.google.maps.event.addListener(newShape, 'click', function () {
        console.log("clicked");
        setSelection(newShape);
      });
      setSelection(newShape);

    })
  }


  useEffect(() => {
    const paletteBarDiv = document.createElement('div');
    paletteBarRef.current = paletteBarDiv;

    const renderPaletteBar = () => {
      createRoot(paletteBarDiv).render(
        <PalleteBar filling={selectedFilling} polygons={polygons} />
      );
    };

    if (mainMap) {
      mainMap.controls[window.google.maps.ControlPosition.BOTTOM_LEFT].push(paletteBarDiv);
      renderPaletteBar();
    }

    return () => {
      if (paletteBarRef.current) {
        paletteBarRef.current.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFilling, polygons]);


  return (
    <>
      <div style={{
        display: "flex",
        flexDirection: "row",
        height: "calc(100vh - 60px)"
      }}>
        <RenderFields
          fieldData={dataField}
          deleteField={deleteField}
          edit={handleEdit}
          editedField={handleEditField}
          handleFieldClick={handleFieldClick}
          drawingManager={drawingManager}
          flagFieldComplete={flagFieldComplete}
          latLngCoordinates={latLngCoordinates}
          deleteSelectedShape={deleteSelectedShape}
          addSelectedShape={addSelectedShape}
          onSubmit={(fieldName, cropName) => handleFieldSubmission(fieldName, cropName)}
          mainMap={mainMap}
          addkmlShape={addkmlShape}
        />
        <Map
          handleMapLoad={handleMapLoad}
          handleDrawingManager={handleDrawingManager}
          width={"70%"}
          widthSmall={"50%"}
        />
        {/* {renderSuccessSB}
        {renderErrorSB}
        {renderWarningSB} */}
      </div>
      <LoadingScreen openLoading={openLoading} />
      {/* </MainLayout> */}
    </>
  );
};

export default Fields;