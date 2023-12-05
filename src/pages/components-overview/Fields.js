import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
// import MDSnackbar from "components/MDSnackbar";
import Map from "./component/Map";
import RenderFields from "pages/components-overview/component/Fields/RenderFields";
import LoadingScreen from "components/LoadingScreen";
import PalleteBar from "components/PalleteBar/index";
import { createRoot } from 'react-dom/client';

const Fields = ({
  farm,
  season,
  filling,
  value,
}) => {
  const paletteBarRef = useRef(null);

  const [openLoading, setOpenLoading] = useState(false);

  const [selectedFarmId, setSelectedFarmId] = useState(farm);
  const [selectedSeasonId, setSelectedSeasonId] = useState(season);

  const [coordinates, setCoordinates] = useState([]);
  const [gridPoints, setGridPoints] = useState([]);

  let [mainMap, setMainMap] = useState(null);
  // let [fieldPolygon, setfieldPolygon] = useState(null);

  const [polygons, setPolygons] = useState([]);
  const [ndviMarkers, setNdviMarkers] = useState([]);
  const [gridPolygons, setGridPolygons] = useState([]);

  let [infoWindow, setInfoWindow] = useState(null);
  let [deleteWindow, setDeleteWindow] = useState(null);
  let [ndviWindow, setNdviWindow] = useState(null);

  const [fieldData, setFieldData] = useState([]);
  const [dataField, setDataField] = useState([]);

  const [selectedFilling, setSelectedFilling] = useState("No Filling");
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
  const gridSpacing = 0.000065; // Adjust the spacing as needed
  var points = [];

  let ndviColor = "black";
  let cropColor = "white";

  let selectedPolygon = null; // Track the selected polygon
  // let fieldPolygon; // Define fieldPolygon here

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
    const selectedPolygon = polygons.find((polygon) => polygon.id === id);

    console.log("selectedPolygon:", selectedPolygon);
    const polygonBounds = new window.google.maps.LatLngBounds();
    selectedPolygon.coordinates.forEach((coord) => {
      polygonBounds.extend(coord);
    });
    mainMap.fitBounds(polygonBounds);
    mainMap.setZoom(18);

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
        const response = await axios.post("http://localhost:8000/api/field/", Data, { withCredentials: true });
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
        setOpenLoading(false); // stop loading screen

      }

      // Reset the state and close the dialog
      // setCoordinates([]);
    } else {
      openWarningSB();
    }
  };

  const calculateNDVIAndFieldGrid = async (fieldId, fieldPoints, cropName) => {
    setOpenLoading(true); // start loading

    // Define the data to be sent in the POST request
    console.log("calculate, seasonID", selectedSeasonId);
    console.log("calculate, coordinates", coordinates);
    console.log("calculate, fieldPoints", fieldPoints);

    const formattedCoords = formattedCoordinates(coordinates);

    const requestData = {
      Field_Data: {
        season: selectedSeasonId, // Replace with the actual selected season ID
        coordinates: JSON.stringify(formattedCoords), // Replace with your coordinates data
        crop_name: cropName,
      },
      Field_Grid: {
        lat_lng: JSON.stringify(fieldPoints), // Replace with your coordinates data
      },
    };
    console.log("sent........");
    if (formattedCoords && fieldPoints && cropName) {
      try {
        // Send a POST request to initiate NDVI and field_grid calculation
        const response = await axios.post(`http://localhost:8000/api/field/putStats/${fieldId}/`, requestData, { withCredentials: true });
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
      await axios.delete(`http://localhost:8000/api/field/deleteField/${fieldId}/${selectedSeasonId}/`, { withCredentials: true });
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
      points = CalculatePoints(updatedCoordinates);
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

    if (infoWindow) {
      infoWindow.close();
    }
    fieldPolygon.setEditable(false);
    console.log("data:", data);
    // Send a patch request to update the polygon data
    try {
      const response = await axios.patch(`http://localhost:8000/api/field/patchField/${fieldPolygon.id}/${selectedSeasonId}/`, data, { withCredentials: true });
      console.log("fieldUpdated:", response.data);
      fetchFieldData(selectedFarmId, selectedSeasonId);
    } catch (error) {
      console.error("Error updating field:", error);
      // Handle the error, e.g., show an error message to the user
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
      "No Crop": "#dadada",
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


  // const renderSuccessSB = (
  //   <MDSnackbar
  //     color="success"
  //     icon="check"
  //     title="Field Added"
  //     content="Your field is added!"
  //     // dateTime="11 mins ago"
  //     open={successSB}
  //     onClose={closeSuccessSB}
  //     close={closeSuccessSB}
  //     bgWhite
  //   />
  // );

  // const renderErrorSB = (
  //   <MDSnackbar
  //     color="error"
  //     icon="warning"
  //     title="Error"
  //     content="Your Field is not added please try again!"
  //     // dateTime="11 mins ago"
  //     open={errorSB}
  //     onClose={closeErrorSB}
  //     close={closeErrorSB}
  //     bgWhite
  //   />
  // );

  // const renderWarningSB = (
  //   <MDSnackbar
  //     color="warning"
  //     icon="star"
  //     title="Warning"
  //     content="Please Select Farm and Season to add Field"
  //     // dateTime="11 mins ago"
  //     open={warningSB}
  //     onClose={closeWarningSB}
  //     close={closeWarningSB}
  //     bgWhite
  //   />
  // );

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
    let value = " ";
    const labelOptions = {
      text: value, // Set the label text
      fontSize: '12px', // Adjust the font size as needed
    };
    if (typeof ndviValue === 'number' || typeof ndviValue === 'string') {
      value = (typeof ndviValue === 'number') ? ndviValue.toFixed(3) : ndviValue;
      value = value.length > 12 ? value.substring(0, 10) + '...' : value; // Truncate the string if it's longer than 10 characters
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

    // Accumulate the marker in the state
    setNdviMarkers((markers) => [...markers, marker]);
  }


  function ClearMap() {
    if (deleteWindow) {
      deleteWindow.close();
    }
    if (infoWindow) {
      infoWindow.close();
    }
    // Clear the previous polygons from the map
    polygons.forEach((polygon) => {
      polygon.setMap(null);
    });
    // Clear the polygons array
    setPolygons([]);

    // Clear the previous NDVI markers
    ndviMarkers.forEach((marker) => {
      marker.setMap(null);
    });

    // Clear the NDVI markers array
    setNdviMarkers([]);

    console.log("gridPolygons", gridPolygons);
    // Clear the previous NDVI markers
    gridPolygons.forEach((polygon) => {
      polygon.setMap(null);
    });

    // Clear the NDVI markers array
    setGridPolygons([]);

  };

  function CalculatePoints(polygonCoordinates) {
    // Calculate grid points within the polygon
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
    return points;
  }



  function RenderFieldData() {
    ClearMap();
    console.log("Before rendering:", fieldData);

    fieldData.forEach((field) => {
      let fieldPolygon = null;

      const coordinates = JSON.parse(field.Field_Data.coordinates);

      const polygonCoordinates = coordinates.map((coord) => ({
        lat: parseFloat(coord.lat),
        lng: parseFloat(coord.lng),
      }));

      points = CalculatePoints(polygonCoordinates);
      console.log("points:", points);
      // Store grid points within the field object
      field.points = points;

      const hasAvgNDVI = typeof field.Field_Data.avg_ndvi === 'number';




      if (hasAvgNDVI) {
        ndviColor = getAvgNdviColor(field.Field_Data.avg_ndvi);
        cropColor = getCropColor(field.Field_Data.crop_name);

        if (selectedFilling === "No Filling") {
          fieldPolygon = new window.google.maps.Polygon({
            paths: polygonCoordinates,
            strokeColor: "yellow",
            strokeOpacity: 1,
            strokeWeight: 2,
            fillOpacity: 0,
            // editable: true,
            clickable: true
          });
        } else if (selectedFilling === "Average NDVI") {
          fieldPolygon = new window.google.maps.Polygon({
            paths: polygonCoordinates,
            strokeColor: "black",
            strokeOpacity: 1,
            strokeWeight: 1,
            fillColor: ndviColor,
            fillOpacity: 1,
            clickable: true
          });
        } else if (selectedFilling === "NDVI") {
          // Display fields with NDVI filling
          const field_Grid = field.Field_Data.Field_Grid;
          console.log("field_Grid:", field_Grid);
          if (field_Grid !== undefined && field_Grid.length > 0) {
            fieldPolygon = new window.google.maps.Polygon({
              paths: polygonCoordinates,
              strokeColor: "yellow",
              clickable: true,
              zIndex: 2,
              fillOpacity: 0,
            });
            RendergridData(field_Grid, fieldPolygon);
          } else {
            fieldPolygon = new window.google.maps.Polygon({
              paths: polygonCoordinates,
              strokeColor: "yellow",
              strokeOpacity: 1,
              strokeWeight: 2,
              fillOpacity: 0,
              clickable: false,
            });
          }
        } else if (selectedFilling === "Contrasted NDVI") {
          // Display fields with contrasted NDVI filling
          const field_Grid = field.Field_Data.Field_Grid;
          console.log("field_Grid:", field_Grid);
          if (field_Grid !== undefined && field_Grid.length > 0) {
            fieldPolygon = new window.google.maps.Polygon({
              paths: polygonCoordinates,
              strokeColor: "yellow",
              clickable: true,
            });
            RendergridData(field_Grid, fieldPolygon);
          } else {
            fieldPolygon = new window.google.maps.Polygon({
              paths: polygonCoordinates,
              strokeColor: "yellow",
              strokeOpacity: 1,
              strokeWeight: 2,
              fillOpacity: 0,
              clickable: false,
            });
          }
        } else if (selectedFilling === "Crop") {
          // Display fields with crop-based filling
          fieldPolygon = new window.google.maps.Polygon({
            paths: polygonCoordinates,
            strokeColor: "black",
            strokeOpacity: 1,
            strokeWeight: 1,
            fillColor: cropColor,
            fillOpacity: 1,
            clickable: true
          });
        }

        if (selectedValue === "Without Values") {
          fieldPolygon.marker = null;
        } else if (selectedValue === "Field names") {
          fieldPolygon.marker = field.name;
        } else if (selectedValue === "Area") {
          fieldPolygon.marker = field.Field_Data.area + " ha";
        } else if (selectedValue === "Crop") {
          fieldPolygon.marker = field.Field_Data.crop_name;
        } else if (selectedValue === "Average NDVI") {
          fieldPolygon.marker = field.Field_Data.avg_ndvi;
        }



      } else {

        // Create a polygon with black fill for the field
        fieldPolygon = new window.google.maps.Polygon({
          paths: polygonCoordinates,
          strokeColor: "#000000",
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: "#000000",
          fillOpacity: 0.35,
          clickable: false,
        });

        fieldPolygon.marker = null;
      }

      console.log(coordinates);

      // Set the polygon name and coordinates as properties
      console.log("fieldPolygon", fieldPolygon);
      fieldPolygon.fieldName = field.name;
      fieldPolygon.id = field.id;
      fieldPolygon.coordinates = polygonCoordinates;
      // fieldPolygon.selected = false; // Add this line inside the loop

      // Add a click event listener to each polygon
      fieldPolygon.addListener("mousemove", () => {
        // if (selectedPolygon) {
        //   selectedPolygon.setEditable(false); // Make the previously selected polygon not editable
        //   //change the bordercolor of the field polygon back to the original color
        //   selectedPolygon.setOptions({
        //     strokeColor: "yellow",
        //     strokeOpacity: 1,
        //     strokeWeight: 2,
        //   });
        // }
        // fieldPolygon.setEditable(true); // Make the clicked polygon editable
        //change the bordercolor of the field polygon to yellow
        fieldPolygon.setOptions({
          strokeColor: "white",
          strokeOpacity: 1,
          strokeWeight: 3,
        });
        selectedPolygon = fieldPolygon; // Update the selected polygon
      });

      fieldPolygon.addListener("mouseout", () => {
        if (selectedPolygon) {
          // selectedPolygon.setEditable(false); // Make the previously selected polygon not editable
          //change the bordercolor of the field polygon back to the original color
          if (selectedFilling === "No Filling" || selectedFilling === "NDVI" || selectedFilling === "Contrasted NDVI") {
            selectedPolygon.setOptions({
              strokeColor: "yellow",
              strokeOpacity: 1,
              strokeWeight: 2,
            });
          } else if (selectedFilling === "Average NDVI" || selectedFilling === "Crop") {
            selectedPolygon.setOptions({
              strokeColor: "black",
              strokeOpacity: 1,
              strokeWeight: 1,
            });
          }
        }
      });



      // Add a mouseover or click event listener
      window.google.maps.event.addListener(fieldPolygon, "click", function (event) {
        if (deleteWindow) {
          deleteWindow.close();
        }
        if (infoWindow) {
          infoWindow.close();
        }
        if (event.vertex !== undefined) { // Check if a vertex was clicked
          const vertexIndex = event.vertex;


          // Create an InfoWindow with a Delete button
          const deleteWindowContent = `
                      <button id="deleteVertexBtn">Delete</button>
                  `;

          deleteWindow = new window.google.maps.InfoWindow({
            content: deleteWindowContent,
          });
          setDeleteWindow(deleteWindow);


          deleteWindow.setPosition(event.latLng);
          deleteWindow.open(mainMap);

          deleteWindow.addListener("domready", function () {

            const deleteVertexBtn = document.getElementById("deleteVertexBtn");

            // Add a click event listener to the "Delete" button
            deleteVertexBtn.addEventListener("click", function () {
              const path = fieldPolygon.getPath();
              path.removeAt(vertexIndex); // Remove the clicked vertex

              // Update the polygon with the modified path
              fieldPolygon.setPath(path);

              // Close the InfoWindow
              deleteWindow.close();
              if (infoWindow) {
                infoWindow.close();
              }
            });
          });
        } else {
          if (deleteWindow) {
            deleteWindow.close();
          }
          if (infoWindow) {
            infoWindow.close();
          }

          function displayCoordinates(coordinates) {
            return coordinates.map(coord => `(${coord.lat}, ${coord.lng})`).join(", ");
          }

          // Create an InfoWindow with a Delete button
          const infoWindowContent = `
                  <strong>Name:</strong> ${fieldPolygon.fieldName}<br>
                  <strong>Id:</strong> ${fieldPolygon.id}<br>
                  <button id="deleteFieldBtn">Delete</button>
                  <button id="editFieldBtn">Edit</button>
                  <div id="editForm" style="display: none;">
                      <form id="editFormField">
                          <label for="fieldName">Name:</label>
                          <input type="text" id="fieldName" value="${fieldPolygon.fieldName}">
                          <label for="cropName">Crop Name:</label>
                          <input type="text" id="cropName">
                          <br>
                          <br>
                          <button type="button" id="updateEditBtn">Update</button>
                          <button type="button" id="cancelEditBtn">Cancel</button>
                      </form>
                  </div>
              `;

          infoWindow = new window.google.maps.InfoWindow({
            content: infoWindowContent,
            // maxWidth: 150,
          });
          setInfoWindow(infoWindow);

          // Listen for the 'domready' event of the InfoWindow
          infoWindow.addListener("domready", function () {
            const deleteFieldBtn = document.getElementById("deleteFieldBtn");
            const editFieldBtn = document.getElementById("editFieldBtn");

            const editForm = document.getElementById("editForm");
            const updateEditBtn = document.getElementById("updateEditBtn");
            const cancelEditBtn = document.getElementById("cancelEditBtn");

            // Inside your polygon click event listener for "Edit" button
            editFieldBtn.addEventListener("click", function () {
              // fieldPolygon.setEditable(false);
              editFieldBtn.style.display = "none";
              deleteFieldBtn.style.display = "none";
              editForm.style.display = "block";

              // updateFieldBtn.style.display = "block";
            });

            deleteFieldBtn.addEventListener("click", function () {
              // Show a confirmation dialog (e.g., a modal)
              const confirmDelete = window.confirm("Are you sure you want to delete this field?");

              if (confirmDelete) {
                // Send a request to delete the field to your backend
                deleteField(field.id); // Replace with the actual field identifier (ID or something)
              }
            });

            cancelEditBtn.addEventListener("click", function () {
              infoWindow.close();
              // fieldPolygon.setEditable(false);
            });

            updateEditBtn.addEventListener("click", function () {
              const newName = document.getElementById("fieldName").value;
              const newCropName = document.getElementById("cropName").value;
              updateField(fieldPolygon, newName, newCropName);
            });
          });

          infoWindow.setPosition(event.latLng);
          infoWindow.open(mainMap);
        }
      });
      fieldPolygon.setMap(mainMap);
      console.log("fieldPolygon:", fieldPolygon);

      setPolygons((polygons) => [...polygons, fieldPolygon]);

      const center = getPolygonCenter(polygonCoordinates); // Implement getPolygonCenter function
      if (center) {
        // Add the NDVI marker above the field polygon
        addNDVIMarker(center, fieldPolygon.marker);
      }

      console.log("field.isCalculating:", field.isCalculating);
      if (field.isCalculating === true) {
        console.log("Setting gridPoints");
        gridPointsCalculate(field);
        field.isCalculating = false;
        checkForAvgNDVI(field);
      }
    });
    if (mainMap) {
      mainMap.addListener("click", () => {

        if (selectedPolygon) {
          // selectedPolygon.setEditable(false);
          // selectedPolygon.setOptions({
          //   strokeColor: "yellow",
          //   strokeOpacity: 1,
          //   strokeWeight: 2,
          // });
          selectedPolygon = null;
        }
        if (infoWindow) {
          infoWindow.close();
        }
        if (deleteWindow) {
          deleteWindow.close();
        }
      });
    }
  };

  async function checkForAvgNDVI(field) {
    setOpenLoading(true); // start loading screen

    console.log("field.isCalculating:", field.isCalculating);
    console.log("polygons:", polygons);
    const seasonId = selectedSeasonId;
    let itr = 0;

    // Define an interval to check for avg_ndvi data every few seconds
    const interval = setInterval(async () => {
      itr = itr + 1;
      if (itr === 50) {
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
          field.Field_Data.avg_ndvi = avg_ndvi;
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

  function gridPointsCalculate(currentField) {
    setGridPoints(currentField.points);
    console.log("after await gridPoints:", gridPoints);

    // const field = fieldData[fieldData.length - 1];
    console.log("id:", currentField.id);
    calculateNDVIAndFieldGrid(currentField.id, currentField.points, currentField.cropName);
    // fetchNDVIForGridPoints(gridPoints);

  }

  function RendergridData(gridPoints, fieldPolygon) {
    // Once NDVI data is fetched, process gridDataPoints
    gridPoints.forEach((point) => {
      // Parse the lat_lng string into a valid object
      const latLng = JSON.parse(point.lat_lng.replace(/'/g, '"'));

      // Extract latitude and longitude
      const lat = latLng.lat;
      const lng = latLng.lng;

      const ndviValue = point.ndvi; // Replace with your actual NDVI calculation function
      const color = getColorBasedOnNDVI(ndviValue); // Implement getColorBasedOnNDVI function to map NDVI to colors

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
      // Add rectangles to the main polygon
      rectangle.setMap(null); // Initially hide the rectangles

      const recPath = new window.google.maps.LatLng(lat, lng);
      console.log("recPath", recPath);
      if (window.google.maps.geometry.poly.containsLocation(recPath, fieldPolygon)) {
        rectangle.setMap(mainMap);
        setGridPolygons((gridPolygons) => [...gridPolygons, rectangle]);
      }


      rectangle.addListener("mousemove", (event) => {
        if (ndviWindow) {
          ndviWindow.close(); // Close any open InfoWindow
        }

        // Create an InfoWindow with the NDVI value
        const ndviWindowContent = `<strong>NDVI:</strong> ${ndviValue.toFixed(3)}`;

        ndviWindow = new window.google.maps.InfoWindow({
          content: ndviWindowContent,
          // maxWidth: 150,
        });

        // Set the InfoWindow position where the mouse hovered over the rectangle
        // ndviWindow.setPosition(event.latLng);
        ndviWindow.setPosition(new window.google.maps.LatLng(event.latLng.lat() + 0.00001, event.latLng.lng()));

        // Open the InfoWindow on the mainMap
        ndviWindow.open(mainMap);

      });
      // Add a mouseout event listener to the map
      rectangle.addListener("mouseout", () => {
        if (ndviWindow) {
          ndviWindow.close(); // Close the InfoWindow
        }
      });

    });
  };

  // Function to start drawing
  // const startDrawing = () => {
  //   console.log("startDrawing");
  //   // drawingMode = true;
  //   // drawingPolygon = new window.google.maps.Polygon({
  //   //   mainMap,
  //   //   editable: true,
  //   //   fillColor: '#ffff00',
  //   //   fillOpacity: 0.5,
  //   //   clickable: true,
  //   //   draggable: false,
  //   // })
  // };

  // function InitMap() {


  //   var Location = new window.google.maps.LatLng(31.402300, 74.210191);
  //   var mapOptions = {
  //     zoom: 17,
  //     center: Location,
  //     mapTypeId: "hybrid",
  //     mapTypeControl: false, // Set mapTypeControl to false to remove the map type control
  //     streetViewControl: false, // Set streetViewControl to false to remove the Pegman control
  //     zoomControlOptions: { position: window.google.maps.ControlPosition.TOP_LEFT } // Set zoomControlOptions to move the zoom controls to the top left corner

  //   }

  //   mainMap = new window.google.maps.Map(document.getElementById("mapcanvas"), mapOptions);
  //   setMainMap(mainMap);

  //   var all_overlays = [];
  //   var selectedShape;

  //   if (drawPolygon) {
  //     console.log("drawPolygon:", drawPolygon);
  //     drawingMode = true;
  //     drawingPolygon = new window.google.maps.Polygon({
  //       map: mainMap,
  //       editable: true,
  //       fillColor: '#ffff00',
  //       fillOpacity: 0.5,
  //       clickable: true,
  //       draggable: false,
  //     })
  //   }

  //   var drawingManager = new window.google.maps.drawing.DrawingManager({
  //     drawingControlOptions: {
  //       position: window.google.maps.ControlPosition.TOP_CENTER,
  //       drawingModes: [
  //         window.google.maps.drawing.OverlayType.POLYGON,
  //       ]
  //     },
  //     polygonOptions: {
  //       clickable: true,
  //       draggable: false,
  //       editable: true,
  //       fillColor: '#ffff00',
  //       fillOpacity: 0.5,
  //     },
  //   });

  //   function clearSelection() {
  //     if (selectedShape) {
  //       selectedShape.setEditable(false);
  //       selectedShape = null;
  //     }
  //   }

  //   //to disable drawing tools
  //   function stopDrawing() {
  //     drawingManager.setMap(null);
  //   }

  //   function setSelection(shape) {
  //     clearSelection();
  //     stopDrawing()
  //     selectedShape = shape;
  //     shape.setEditable(true);
  //   }

  //   function deleteSelectedShape() {
  //     if (selectedShape) {
  //       selectedShape.setMap(null);
  //       drawingManager.setMap(mainMap);
  //       coordinates.splice(0, coordinates.length)
  //       console.log(coordinates);
  //       // document.getElementById('info').innerHTML = ""
  //     }
  //   }

  //   function addSelectedShape() {
  //     setIsDialogOpen(true); // Open the dialog for field name input
  //     // deleteSelectedShape();
  //     selectedShape.setMap(null);
  //     drawingManager.setMap(mainMap);
  //     // document.getElementById('info').innerHTML = ""
  //     mainMap.controls[window.google.maps.ControlPosition.BOTTOM_LEFT].pop();
  //     mainMap.controls[window.google.maps.ControlPosition.BOTTOM_LEFT].pop();
  //   }

  //   function CenterControl(controlDiv, mainMap) {

  //     // Set CSS for the control border.
  //     var controlUI = document.createElement('div');
  //     controlUI.style.backgroundColor = '#fff';
  //     controlUI.style.border = '2px solid #fff';
  //     controlUI.style.borderRadius = '3px';
  //     controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  //     controlUI.style.cursor = 'pointer';
  //     controlUI.style.marginBottom = '5px';
  //     controlUI.style.textAlign = 'center';
  //     controlUI.style.width = '70px';
  //     controlUI.style.marginRight = '10px';
  //     // controlUI.style.display = 'none';
  //     controlUI.title = 'Select to delete the poygon';
  //     controlDiv.appendChild(controlUI);

  //     // Set CSS for the control interior.
  //     var controlText = document.createElement('div');
  //     controlText.style.color = 'rgb(25,25,25)';
  //     controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
  //     controlText.style.fontSize = '13px';
  //     controlText.style.lineHeight = '28px';
  //     controlText.style.paddingLeft = '5px';
  //     controlText.style.paddingRight = '5px';
  //     controlText.innerHTML = 'Delete';
  //     controlUI.appendChild(controlText);

  //     //to delete the polygon
  //     controlUI.addEventListener('click', function () {
  //       mainMap.controls[window.google.maps.ControlPosition.BOTTOM_LEFT].pop();
  //       mainMap.controls[window.google.maps.ControlPosition.BOTTOM_LEFT].pop();
  //       deleteSelectedShape();
  //     });
  //   }

  //   function CenterControl2(controlDiv, mainMap) {

  //     // Set CSS for the control border.
  //     var addUI = document.createElement('div');
  //     addUI.style.backgroundColor = '#fff';
  //     addUI.style.border = '2px solid #fff';
  //     addUI.style.borderRadius = '3px';
  //     addUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  //     addUI.style.cursor = 'pointer';
  //     addUI.style.marginBottom = '5px';
  //     addUI.style.textAlign = 'center';
  //     addUI.style.width = '70px';
  //     // addUI.style.display = 'none';
  //     addUI.title = 'Select to add the shape';
  //     controlDiv.appendChild(addUI);

  //     // Set CSS for the control interior.
  //     var addText = document.createElement('div');
  //     addText.style.color = 'rgb(25,25,25)';
  //     addText.style.fontFamily = 'Roboto,Arial,sans-serif';
  //     addText.style.fontSize = '13px';
  //     addText.style.lineHeight = '28px';
  //     addText.style.paddingLeft = '5px';
  //     addText.style.paddingRight = '5px';
  //     addText.innerHTML = 'Add';
  //     addUI.appendChild(addText);

  //     //to delete the polygon
  //     addUI.addEventListener('click', function () {
  //       addSelectedShape();

  //     });
  //   }

  //   drawingManager.setMap(mainMap);

  //   var getPolygonCoords = function (newShape) {

  //     coordinates.splice(0, coordinates.length)
  //     console.log(coordinates)

  //     var len = newShape.getPath().getLength();

  //     for (var i = 0; i < len; i++) {
  //       coordinates.push(newShape.getPath().getAt(i).toUrlValue(4))
  //     }
  //     // document.getElementById('info').innerHTML = coordinates


  //   }

  //   window.google.maps.event.addListener(drawingManager, 'polygoncomplete', function (event) {

  //     mainMap.controls[window.google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv);
  //     mainMap.controls[window.google.maps.ControlPosition.BOTTOM_LEFT].push(centerControlDiv2);

  //     console.log("polygon");
  //     event.getPath().getLength();
  //     window.google.maps.event.addListener(event, "dragend", getPolygonCoords(event));

  //     window.google.maps.event.addListener(event.getPath(), 'insert_at', function () {
  //       getPolygonCoords(event)
  //     });

  //     window.google.maps.event.addListener(event.getPath(), 'set_at', function () {
  //       getPolygonCoords(event)
  //     })
  //   })

  //   window.google.maps.event.addListener(drawingManager, 'overlaycomplete', function (event) {
  //     all_overlays.push(event)
  //     console.log(all_overlays);
  //     console.log("overlay");

  //     drawingManager.setDrawingMode(null);

  //     var newShape = event.overlay;
  //     newShape.type = event.type;
  //     window.google.maps.event.addListener(newShape, 'click', function () {
  //       console.log("clicked");
  //       setSelection(newShape);
  //     });
  //     setSelection(newShape);

  //   })

  //   var centerControlDiv = document.createElement('div');
  //   var centerControl = new CenterControl(centerControlDiv, mainMap);


  //   var centerControlDiv2 = document.createElement('div');
  //   var centerControl2 = new CenterControl2(centerControlDiv2, mainMap);


  //   // centerControlDiv.index = 1;

  //   // RenderFieldData();

  // };

  // useEffect(() => {
  //   console.log(jwtToken);
  //   console.log(selectedFarmId);

  //   // If the JWT token is not present, redirect to the sign-in page
  //   if (!jwtToken) {
  //     navigate("/auth/login");
  //     // return null; // Or show a loading indicator
  //   }

  //   const script = document.createElement("script");
  //   script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=drawing,geometry&callback=InitMap`;
  //   script.async = true;
  //   script.defer = true;
  //   window.InitMap = InitMap;
  //   document.head.appendChild(script);

  //   return () => {
  //     document.head.removeChild(script);
  //   };
  // }, [apiKey, jwtToken]);

  useEffect(() => {
    ClearMap();
    if (!selectedSeasonId) {
      setDataField([]);
    }
    if (selectedFarmId && selectedSeasonId) {
      // InitMap();
      fetchFieldData(selectedFarmId, selectedSeasonId);
    }
  }, [selectedSeasonId, selectedFilling, selectedValue]);

  useEffect(() => {
    console.log("fieldData:", fieldData);
    if (fieldData.length !== 0) {
      RenderFieldData();
      // fieldPolygon.setMap(null);
      // InitMap();
    }
  }, [fieldData])

  useEffect(() => {
    // This code will run every time gridPoints is updated
    console.log("useState points:", gridPoints);
    console.log("fieldData:", fieldData);


  }, [gridPoints]);

  useEffect(() => {
    setSelectedFarmId(farm);
    setSelectedSeasonId(season);
  }, [farm, season]);

  useEffect(() => {
    if (filling) {
      console.log("filling:", filling);
      setSelectedFilling(filling);
    }
  }, [filling])

  useEffect(() => {
    if (value) {
      console.log("value:", value);
      setSelectedValue(value);
    }
  }, [value])



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
  }, [selectedFilling, polygons]);


  // useEffect(() => {
  //   var paletteBarDiv = document.createElement('div');
  //   ReactDOM.render(<PalleteBar
  //     filling={selectedFilling}
  //   />, paletteBarDiv);
  //   if (mainMap) {
  //     mainMap.controls[window.google.maps.ControlPosition.BOTTOM_LEFT].push(paletteBarDiv);
  //   }
  // }, [selectedFilling]);




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

        />
        <Map
          handleMapLoad={handleMapLoad}
          handleDrawingManager={handleDrawingManager}
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