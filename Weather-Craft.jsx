//Made with Love by Yash Chittora [github.com/yashchittora]

//isDarkMode = true: Text is white and background is black
//isDarkMode = false: Text is black and background is white

// ~~~ USER SETTINGS ~~~
const isDarkMode = false; // Look above for description
const showBackground = true;
const location = "Udaipur"; // Location (Change this constant to your desired location)
export const refreshFrequency = 600000; // Refreshes the widget every 10 minutes
const layoutPosition = "bottomRight"; // Options: "topCenter", "topLeft", "topRight", "bottomCenter", "bottomLeft", "bottomRight"

// --- WIDGET CODE ---

// Linking of the FontAwesome Icon
const faScript = document.createElement("script");
faScript.src =
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/js/all.min.js";
document.head.appendChild(faScript);

// Importing necessary modules
import { run } from "uebersicht";
import { css } from "uebersicht";

// Margin variables for different positions
const margins = {
  topCenter: {
    marginRight: "auto",
    marginLeft: "auto",
    marginBottom: "auto",
  },
  topLeft: {
    marginRight: "auto",
    marginLeft: "2vw",
    marginBottom: "auto",
  },
  topRight: {
    // marginTop: "2vh",
    marginRight: "2vw",
    marginLeft: "auto",
    marginBottom: "auto",
  },
  bottomCenter: {
    marginTop: "auto",
    marginRight: "auto",
    marginLeft: "auto",
    marginBottom: "2vh",
  },
  bottomLeft: {
    marginTop: "auto",
    marginRight: "auto",
    marginLeft: "2vw",
    marginBottom: "2vh",
  },
  bottomRight: {
    marginTop: "auto",
    marginRight: "2vw",
    marginLeft: "auto",
    marginBottom: "2vh",
  },
};

const selectedMargins = margins[layoutPosition];

const container = css`
  pointer-events: none;
  user-select: none;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  animation: fadeIn 1s linear;
  @keyframes fadeIn {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
`;

const darkModeStyles = isDarkMode
  ? css`
      background-color: black; // For true
      color: white; // For true
    `
  : css`
      background-color: white; // For false
      color: black; // For false
    `;

const backgroundStyles = showBackground
  ? css`
      //If true Nothing to change
    `
  : css`
      background-color: rgba(0, 0, 0, 0);
    `;

const text = css`
  margin-top: ${selectedMargins.marginTop};
  margin-right: ${selectedMargins.marginRight};
  margin-left: ${selectedMargins.marginLeft};
  margin-bottom: ${selectedMargins.marginBottom};
  padding-left: 20px;
  padding-right: 20px;
  padding-top: 5px;
  padding-bottom: 5px;
  font-size: 14px;
  color: white; //Default text color
  font-family: futura;
  background-color: black; // Default Background color
  border-radius: 32px;
  user-select: none;
  cursor: default;
  ${darkModeStyles}
  ${backgroundStyles}
`;

const iconStyle = css`
  margin-right: 10px;
`;

// Function to get the current weather info by scraping wttr.in
const getWeatherInfo = async () => {
  const weatherConditionCommand = `curl -s "wttr.in/${location}?format=%C"`;
  const temperatureCommand = `curl -s "wttr.in/${location}?format=%t"`;
  const feelsLikeCommand = `curl -s "wttr.in/${location}?format=%f"`;

  try {
    const [conditionResult, temperatureResult, feelsLikeResult] =
      await Promise.all([
        run(weatherConditionCommand),
        run(temperatureCommand),
        run(feelsLikeCommand),
      ]);

    const weatherInfo = {
      location: location,
      condition: conditionResult.trim() || "N/A",
      temperature: temperatureResult.trim() || "N/A",
      feelsLike: feelsLikeResult.trim() || "N/A",
      icon: "fas fa-cloud", // Default icon, can be updated based on condition
    };

    if (weatherInfo.condition.toLowerCase().includes("sunny")) {
      weatherInfo.icon = "fas fa-sun";
    } else if (weatherInfo.condition.toLowerCase().includes("cloud")) {
      weatherInfo.icon = "fas fa-cloud";
    } else if (weatherInfo.condition.toLowerCase().includes("rain")) {
      weatherInfo.icon = "fas fa-cloud-showers-heavy";
    }

    return weatherInfo;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    return {
      location: location,
      condition: "N/A",
      temperature: "N/A",
      feelsLike: "N/A",
      icon: "fas fa-exclamation-triangle",
    };
  }
};

// Exported variables and functions
export const command = async (dispatch) => {
  const weatherInfo = await getWeatherInfo();
  dispatch({ type: "SET_INFO", weatherInfo });
};

export const initialState = { weatherInfo: {} };

export const updateState = (event, previousState) => {
  switch (event.type) {
    case "SET_INFO":
      return { ...previousState, weatherInfo: event.weatherInfo };
    default:
      return previousState;
  }
};

// Structure of the widget
export const render = ({ weatherInfo }, dispatch) => {
  const displayInfo = weatherInfo || {};

  return (
    <div className={container}>
      <p className={text}>
        <i className={`${displayInfo.icon} ${iconStyle}`}></i>
        {displayInfo.location}: {displayInfo.temperature} (Feels like{" "}
        {displayInfo.feelsLike}), {displayInfo.condition}
      </p>
    </div>
  );
};

// REFERENCE LINKS FOR FELLOW DEVELOPERS
// curl wttr.in/Udaipur?format="%l:+%c+%t\n"
// curl wttr.in/Udaipur?format="%l:+%c+%C+%x+%t+%f\n"
// curl wttr.in/Udaipur?format="%c"
// Weather emoji

// wttr.in/Udaipur?format="%C"
// Weather Text Line

// wttr.in/Udaipur?format="%t"
// Actual Temperature
//
// wttr.in/Udaipur?format="%f"
// Feels like Temperature
