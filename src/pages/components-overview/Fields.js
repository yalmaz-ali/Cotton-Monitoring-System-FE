import React, { useEffect, useState } from "react";
import axios from "axios";
// import MDSnackbar from "components/MDSnackbar";
import Map from "./component/Map";
import RenderFields from "pages/components-overview/component/Fields/RenderFields";
import LoadingScreen from "components/LoadingScreen";

const Fields = ({
  farm,
  season,
  filling,
  value,
}) => {

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
  const [selectedValue, setSelectedValue] = useState("Without Values");


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
  const points = [];

  let ndviColor = "black";
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

  const handleEditField = (id, name) => {
    console.log("id:", id);
    console.log("name:", name);
    polygons.forEach((polygon) => {
      if (polygon.id === id) {
        updateField(polygon, name);
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

  const handleFieldSubmission = async (fieldName) => {
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
          isCalculating: true
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
      openWarningSB();
    }
  };

  const calculateNDVIAndFieldGrid = async (fieldId, fieldPoints) => {
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
        crop_name: "Cotton", // Replace with the actual crop name or retrieve it from your state
      },
      Field_Grid: {
        lat_lng: JSON.stringify(fieldPoints), // Replace with your coordinates data
      },
    };
    console.log("sent........");
    if (formattedCoords && fieldPoints) {
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
      console.log("fetch fieldData:", response.data);
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

  async function updateField(fieldPolygon, name) {
    setOpenLoading(true); // start loading screen

    // Extract the updated coordinates from the polygon's path
    const updatedCoordinates = fieldPolygon.getPath().getArray().map(coord => ({
      lat: parseFloat(coord.lat()).toFixed(4),
      lng: parseFloat(coord.lng()).toFixed(4)
    }));

    console.log(name);
    console.log(updatedCoordinates);

    const data = {
      "Field": {
        "name": name
      },
      "Field_Data": {
        "coordinates": JSON.stringify(updatedCoordinates),
        "crop_name": "CotMuttton"
      }
    }
    if (infoWindow) {
      infoWindow.close();
    }
    fieldPolygon.setEditable(false);
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

  }

  function getColor(ndvi) {
    const colorScale = [
      { value: -1, color: "#FF0000" },   // Red for very low NDVI
      { value: -0.8, color: "#FF3300" }, // Red-Orange
      { value: -0.6, color: "#FF6600" }, // Orange
      { value: -0.4, color: "#FF9900" }, // Orange-Yellow
      { value: -0.2, color: "#FFCC00" }, // Yellow
      { value: 0, color: "#FFFF00" },    // Yellow-Green
      { value: 0.2, color: "#CCFF00" },  // Green-Yellow
      { value: 0.4, color: "#99FF00" },  // Green
      { value: 0.6, color: "#66FF00" },  // Green-Light Green
      { value: 0.8, color: "#33FF00" },  // Light Green
      { value: 1, color: "#00FF00" }     // Bright Green for high NDVI
    ];

    for (const scale of colorScale) {
      if (ndvi <= scale.value) {
        return scale.color;
      }
    }

    return "#000000"; // Default color for undefined NDVI values
  }

  // Function to map NDVI values to colors with a custom palette
  function getColorBasedOnNDVI(ndvi) {
    // Define a custom color palette with 50 shades from yellow to green
    const colorPalette = [
      'rgb(255, 255, 0)',
      'rgb(254, 255, 0)',
      'rgb(253, 255, 0)',
      'rgb(252, 255, 0)',
      'rgb(251, 255, 0)',
      'rgb(250, 255, 0)',
      'rgb(249, 255, 0)',
      'rgb(248, 255, 0)',
      'rgb(247, 255, 0)',
      'rgb(246, 255, 0)',
      'rgb(245, 255, 0)',
      'rgb(244, 255, 0)',
      'rgb(243, 255, 0)',
      'rgb(242, 255, 0)',
      'rgb(241, 255, 0)',
      'rgb(240, 255, 0)',
      'rgb(239, 255, 0)',
      'rgb(238, 255, 0)',
      'rgb(237, 255, 0)',
      'rgb(236, 255, 0)',
      'rgb(235, 255, 0)',
      'rgb(234, 255, 0)',
      'rgb(233, 255, 0)',
      'rgb(232, 255, 0)',
      'rgb(231, 255, 0)',
      'rgb(230, 255, 0)',
      'rgb(229, 255, 0)',
      'rgb(228, 255, 0)',
      'rgb(227, 255, 0)',
      'rgb(226, 255, 0)',
      'rgb(225, 255, 0)',
      'rgb(224, 255, 0)',
      'rgb(223, 255, 0)',
      'rgb(222, 255, 0)',
      'rgb(221, 255, 0)',
      'rgb(220, 255, 0)',
      'rgb(219, 255, 0)',
      'rgb(218, 255, 0)',
      'rgb(217, 255, 0)',
      'rgb(216, 255, 0)',
      'rgb(215, 255, 0)',
      'rgb(214, 255, 0)',
      'rgb(213, 255, 0)',
      'rgb(212, 255, 0)',
      'rgb(211, 255, 0)',
      'rgb(210, 255, 0)',
      'rgb(0, 245, 0)', // Green
    ];

    // Normalize NDVI values to the palette length
    const normalizedNDVI = (ndvi + 1) / 2; // Normalize from [-1, 1] to [0, 1]

    // Calculate the index in the color palette
    const paletteIndex = Math.floor(normalizedNDVI * (colorPalette.length - 1));

    // Return the color from the palette
    return colorPalette[paletteIndex];
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

    // Clear the previous NDVI markers
    gridPolygons.forEach((polygon) => {
      polygon.setMap(null);
    });

    // Clear the NDVI markers array
    setGridPolygons([]);

  };

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

      // Calculate grid points within the polygon
      const polygonBounds = new window.google.maps.LatLngBounds();

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

      // Store grid points within the field object
      field.points = points;

      const hasAvgNDVI = typeof field.Field_Data.avg_ndvi === 'number';




      if (hasAvgNDVI) {
        ndviColor = getColor(field.Field_Data.avg_ndvi);


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
            strokeColor: ndviColor,
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: ndviColor,
            fillOpacity: 1,
            // editable: true,
            clickable: true
          });
        } else if (selectedFilling === "NDVI") {
          // Display fields with NDVI filling
          const field_Grid = field.Field_Data.Field_Grid;
          console.log("field_Grid:", field_Grid);
          if (field_Grid !== undefined && field_Grid.length > 0) {
            fieldPolygon = new window.google.maps.Polygon({
              paths: polygonCoordinates,
              strokeColor: "blue",
              clickable: false,
            });
            RendergridData(field_Grid);
          } else {
            fieldPolygon = new window.google.maps.Polygon({
              paths: polygonCoordinates,
              strokeColor: "red",
              strokeOpacity: 1,
              strokeWeight: 2,
              fillColor: "red",
              fillOpacity: 0,
              // editable: true,
              // clickable: true
            });
          }
        } else if (selectedFilling === "Contrasted NDVI") {
          // Display fields with contrasted NDVI filling
          const field_Grid = field.Field_Data.Field_Grid;
          console.log("field_Grid:", field_Grid);
          if (field_Grid !== undefined && field_Grid.length > 0) {
            fieldPolygon = new window.google.maps.Polygon({
              paths: polygonCoordinates,
              strokeColor: "blue",
              clickable: false,
            });
            RendergridData(field_Grid);
          } else {
            fieldPolygon = new window.google.maps.Polygon({
              paths: polygonCoordinates,
              strokeColor: "red",
              strokeOpacity: 1,
              strokeWeight: 2,
              fillColor: "red",
              fillOpacity: 0,
              // editable: true,
              // clickable: true
            });
          }
        } else if (selectedFilling === "Crop") {
          // Display fields with crop-based filling
          fieldPolygon = new window.google.maps.Polygon({
            paths: polygonCoordinates,
            strokeColor: ndviColor,
            strokeOpacity: 1,
            strokeWeight: 2,
            fillColor: ndviColor,
            fillOpacity: 1,
            // editable: true,
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
      fieldPolygon.addListener("click", () => {
        if (selectedPolygon) {
          selectedPolygon.setEditable(false); // Make the previously selected polygon not editable
        }
        fieldPolygon.setEditable(true); // Make the clicked polygon editable
        selectedPolygon = fieldPolygon; // Update the selected polygon
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
                          <label for="fieldCoordinates">Coordinates:</label>
                          <textarea id="fieldCoordinates">${displayCoordinates(fieldPolygon.coordinates)}</textarea>
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
              fieldPolygon.setEditable(false);
            });

            updateEditBtn.addEventListener("click", function () {
              const newName = document.getElementById("fieldName").value;
              updateField(fieldPolygon, newName);
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
          selectedPolygon.setEditable(false);
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
    calculateNDVIAndFieldGrid(currentField.id, currentField.points);
    // fetchNDVIForGridPoints(gridPoints);

  }

  function RendergridData(gridPoints) {
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
        fillOpacity: 0.7, // Adjust as needed
        strokeWeight: 1,
        strokeColor: "black", // No border
        map: mainMap, // Your map instance
        zIndex: 1,
      });
      setGridPolygons((gridPolygons) => [...gridPolygons, rectangle]);

      // Add a mouseover event listener to the rectangle
      rectangle.addListener("mouseover", (event) => {
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
        ndviWindow.setPosition(event.latLng);

        // Open the InfoWindow on the mainMap
        ndviWindow.open(mainMap);
      });

      // Add a mouseout event listener to close the InfoWindow when the mouse leaves the rectangle
      rectangle.addListener("mouseout", () => {
        if (ndviWindow) {
          ndviWindow.close(); // Close the InfoWindow
        }
      });
    });
  }

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
    if (value) {
      console.log("value:", value);
      setSelectedValue(value);
    }
  }, [filling, value])





  let [selectedShape, setSelectedShape] = useState(null);

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

    // document.getElementById('info').innerHTML = coordinates


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
      setFlagFieldComplete(true);
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






  return (
    <>
      <div style={{
        display: "flex",
        flexDirection: "row",
        height: "91vh",
      }}>
        <RenderFields
          fieldData={dataField}
          deleteField={deleteField}
          edit={handleEdit}
          editedField={handleEditField}
          handleFieldClick={handleFieldClick}
          drawingManager={drawingManager}
          flagFieldComplete={flagFieldComplete}
          deleteSelectedShape={deleteSelectedShape}
          addSelectedShape={addSelectedShape}
          onSubmit={(fieldName) => handleFieldSubmission(fieldName)}

        />
        <Map
          // handleCoordinatesChange={handleCoordinatesChange}
          // setIsDialogOpen={setIsDialogOpen}
          handleMapLoad={handleMapLoad}
          handleDrawingManager={handleDrawingManager}
        />
        {/* {renderSuccessSB}
        {renderErrorSB}
        {renderWarningSB} */}
        <LoadingScreen openLoading={openLoading} />
      </div>
      {/* </MainLayout> */}
    </>
  );
};

export default Fields;