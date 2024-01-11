import React, { useEffect, useState } from "react";

function PalleteBar(props) {
    const [filling, setFilling] = useState('No Filling');

    var display = props.filling === 'No Filling' ? 'none' : 'block';
    display = props.polygons.length === 0 ? 'none' : display;
    const height = props.filling === 'Crop' ? '25px' : '40px';
    useEffect(() => {
        setFilling(props.filling);
    }, [props.filling]);

    useEffect(() => {
        console.log("props.polygons", props.polygons);
    }, [props.polygons]);


    const cropColors = {
        "#FFA07A": "Alfalfa",
        "#7FFF00": "Apple",
        "#FF4500": "Apricot",
        "#20B2AA": "Artichoke",
        "#00CED1": "Asparagus",
        "#32CD32": "Avocado",
        "#FFD700": "Banana",
        "#DAA520": "Barley",
        "#8A2BE2": "Bean",
        "#DC143C": "Beet",
        "#8B008B": "Blackberry",
        "#FF6347": "Blackgram",
        "#4169E1": "Blueberry",
        "#00FF00": "Broccoli",
        "#228B22": "Brussels Sprouts",
        "#7CFC00": "Cabbage",
        "#FF8C00": "Cantaloupe",
        "#FFA500": "Carrot",
        "#FFFACD": "Cauliflower",
        "#FF69B4": "Cherry",
        "#9932CC": "Chickpea",
        "#FFE4C4": "Coconut",
        "#A0522D": "Coffee",
        "#FF0000": "Cotton",
        "#DCDCDC": "Cranberry",
        "#00FFFF": "Cucumber",
        "#800080": "Date Palm",
        "#9370DB": "Eggplant",
        "#FF1493": "Fig",
        "#2E8B57": "Garlic",
        "#FFFF00": "Ginger",
        "#4B0082": "Grapes",
        "#FF8C69": "Hazelnut",
        "#008080": "Jute",
        "#7B68EE": "Kale",
        "#8B4513": "Kiwi",
        "#F0E68C": "Lemon",
        "#DDA0DD": "Lentil",
        "#90EE90": "Lettuce",
        "#F08080": "Lychee",
        "#FF7F50": "Maize",
        "#FFB6C1": "Mango",
        "#800000": "Moth Beans",
        "#66CDAA": "Mung Bean",
        "#FF00FF": "Muskmelon",
        "#FA8072": "Nectarine",
        "#dadada": "No Crop",
        "#808000": "Olive",
        "#8ea2f0": "Onion",
        "#fcad1b": "Orange",
        "#FFFFFF": "Other Crop",
        "#FFEFD5": "Papaya",
        "#FFDAB9": "Peach",
        "#E9967A": "Pear",
        "#105a03": "Pigeon Peas",
        "#FFE4B5": "Pineapple",
        "#ed593f": "Plum",
        "#ff0000": "Pomegranate",
        "#be6141": "Potato",
        "#F0FFF0": "Quinoa",
        "#c532e9": "Raspberry",
        "#938175": "Rice",
        "#2c7823": "Soybean",
        "#104316": "Spinach",
        "#7760a8": "Sugarcane",
        "#ff595e": "Strawberry",
        "#D2691E": "Sweet Potato",
        "#c0bebe": "Taro",
        "#e4180e": "Tomato",
        "#A52A2A": "Walnut",
        "#418125": "Watermelon",
        "#F5DEB3": "Wheat",
        "#68a4a8": "Yam",
        "#1e0ead": "Zucchini",
    };

    function getCropNameByColor(color) {
        const cropName = cropColors[color] || "No Crop"; // Returns crop name or 'Unknown Crop' if not found
        console.log(cropName);
        return cropName;
    }

    return (
        <div
            style={{
                backgroundColor: "#222",
                border: "2px solid #222",
                borderRadius: "5px",
                boxShadow: "0 2px 6px rgba(0,0,0,.3)",
                cursor: "default",
                textAlign: "center",
                minWidth: "320px",
                maxWidth: "500px",
                bottom: "30px",
                left: "-65px",
                position: "absolute",
                height: height,
                color: "white",
                display: display
            }}
        >
            {filling !== 'Crop' ?
                <div
                    style={{
                        display: "flex",
                        flexDirection: "row"
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "80%",
                            height: "100%",
                            padding: "5px"
                        }}
                    >
                        <div
                            style={{
                                fontSize: "10px",
                                fontFamily: "Graphik, Roboto, sans-serif",
                                display: "flex",
                                justifyContent: "space-between",
                                marginBottom: "5px"
                            }}
                        >
                            {filling === 'Average NDVI' &&
                                <>
                                    <div style={{ fontSize: "12px" }}>0</div>
                                    <div style={{ fontSize: "12px" }}>0.5</div>
                                    <div style={{ fontSize: "12px" }}>1</div>
                                </>
                            }
                            {(filling === 'NDVI' || filling === 'Contrasted NDVI') &&
                                <>
                                    <div style={{ fontSize: "12px" }}>Low vegetation index</div>
                                    <div style={{ fontSize: "12px" }}>High</div>
                                </>
                            }
                        </div>

                        <ul style={{
                            display: "flex",
                            height: "4px",
                            margin: "0",
                            padding: "0",
                            listStyleType: "none"
                        }}>
                            {filling === 'Average NDVI' &&
                                <>
                                    <li style={{ width: "calc(100% / 18)", backgroundColor: "#422112" }}></li>
                                    <li style={{ width: "calc(100% / 18)", backgroundColor: "#7f4020" }}></li>
                                    <li style={{ width: "calc(100% / 18)", backgroundColor: "#b76135" }}></li>
                                    <li style={{ width: "calc(100% / 18)", backgroundColor: "#c6974e" }}></li>
                                    <li style={{ width: "calc(100% / 18)", backgroundColor: "#e6c957" }}></li>
                                    <li style={{ width: "calc(100% / 18)", backgroundColor: "#fdfe03" }}></li>
                                    <li style={{ width: "calc(100% / 18)", backgroundColor: "#e6ec06" }}></li>
                                    <li style={{ width: "calc(100% / 18)", backgroundColor: "#d0df00" }}></li>
                                    <li style={{ width: "calc(100% / 18)", backgroundColor: "#b9cf02" }}></li>
                                    <li style={{ width: "calc(100% / 18)", backgroundColor: "#a2c000" }}></li>
                                    <li style={{ width: "calc(100% / 18)", backgroundColor: "#8aaf00" }}></li>
                                    <li style={{ width: "calc(100% / 18)", backgroundColor: "#72a000" }}></li>
                                    <li style={{ width: "calc(100% / 18)", backgroundColor: "#5b8e03" }}></li>
                                    <li style={{ width: "calc(100% / 18)", backgroundColor: "#458100" }}></li>
                                    <li style={{ width: "calc(100% / 18)", backgroundColor: "#2d7000" }}></li>
                                    <li style={{ width: "calc(100% / 18)", backgroundColor: "#25602d" }}></li>
                                    <li style={{ width: "calc(100% / 18)", backgroundColor: "#15542d" }}></li>
                                    <li style={{ width: "calc(100% / 18)", backgroundColor: "#15442d" }}></li>
                                </>
                            }
                            {filling === 'NDVI' &&
                                <>
                                    <li
                                        className="sx4jg6a"
                                        style={{
                                            background: "linear-gradient(90deg, #350801 0%, #7e1805 5.555555555555555%, #af3a03 11.11111111111111%, #ecb225 16.666666666666664%, #fcd731 22.22222222222222%, #fee85f 27.77777777777778%, #fefe00 33.33333333333333%, #f2f900 38.88888888888889%, #c4e700 44.44444444444444%, #97d500 50%, #5fc100 55.55555555555556%, #379f00 61.111111111111114%, #1c8300 66.66666666666666%, #0b6400 72.22222222222221%, #064b0a 77.77777777777779%, #033a0f 83.33333333333334%, #02310c 88.88888888888889%, #02310c 94.44444444444444%)",
                                            width: "100%"

                                        }}
                                    >
                                    </li>
                                </>
                            }
                            {filling === 'Contrasted NDVI' &&
                                <>
                                    <li
                                        className="sx4jg6a"
                                        style={{
                                            background: "linear-gradient(90deg, #960850 0%, #bf052a 5.555555555555555%, #e90205 11.11111111111111%, #f5320c 16.666666666666664%, #fd6919 22.22222222222222%, #ff9026 27.77777777777778%, #ffb133 33.33333333333333%, #ffd028 38.88888888888889%, #feef0f 44.44444444444444%, #effc02 50%, #d0f501 55.55555555555556%, #a7ee02 61.111111111111114%, #6be709 66.66666666666666%, #38dc17 72.22222222222221%, #1ec73d 77.77777777777779%, #07b25f 83.33333333333334%, #099d6b 88.88888888888889%, #0b8877 94.44444444444444%)",
                                            width: "100%"

                                        }}
                                    >
                                    </li>
                                </>
                            }
                        </ul>
                    </div>
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            width: "20%",
                            height: "100%",
                            padding: "5px"
                        }}
                    >
                        <div
                            style={{
                                fontFamily: "Graphik, Roboto, sans-serif",
                                display: "flex",
                                justifyContent: "center",
                                marginBottom: "5px"
                            }}
                        >
                            {(filling === 'NDVI' || filling === 'Contrasted NDVI' || filling === 'Average NDVI') &&
                                <>
                                    <div style={{ fontSize: "12px" }}>Cloud</div>
                                </>
                            }
                        </div>

                        <ul style={{
                            display: "flex",
                            height: "4px",
                            margin: "0",
                            padding: "0",
                            listStyleType: "none"
                        }}>
                            {(filling === 'Average NDVI' || filling === 'NDVI' || filling === 'Contrasted NDVI') &&
                                <>
                                    <li style={{ width: "100%", backgroundColor: "white" }}></li>
                                </>
                            }
                        </ul>
                    </div>
                </div>
                :
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    width: '100%',
                    height: '100%',
                    fontSize: '11px',
                    overflowX: 'hidden',
                }}>
                    {Array.from(new Set(props.polygons.map(polygon => polygon.fillColor))).map((color, index) => (
                        <div key={index}
                            style={{
                                display: 'flex',
                                flexDirection: 'row',
                                alignItems: 'center',
                                marginRight: '10px',
                                marginLeft: '5px',
                                fontFamily: "Graphik, Roboto, sans-serif",
                            }}
                        >
                            <div
                                style={{
                                    width: '15px',
                                    height: '15px',
                                    borderRadius: '50%',
                                    backgroundColor: color,
                                    marginRight: '5px'
                                }}
                            >
                            </div>
                            <span style={{ whiteSpace: 'nowrap' }}>{getCropNameByColor(color)}</span>
                        </div>
                    ))}
                </div>
            }

        </div>
    );
}

export default PalleteBar;