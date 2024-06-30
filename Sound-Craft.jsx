//Made with Love by Yash Chittora [github.com/yashchittora]

//isDarkMode = true: Text is white and background is black
//isDarkMode = false: Text is black and background is white

// ~~~ USER SETTINGS ~~~
const isDarkMode = false; // Look above for description
const showBackground = true;
const layoutPosition = "bottomLeft"; // Options: "topCenter", "topLeft", "topRight", "bottomCenter", "bottomLeft", "bottomRight"

// --- WIDGET CODE ---

// Linking of the Music Icon
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
    // marginBottom: "2vh",
  },
};

const selectedMargins = margins[layoutPosition];

const container = css`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  animation: fadeIn 1s linear;
  pointer-events: none; /* Disable mouse interactions */
  user-select: none; /* Disable text selection */
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
  padding-bottom: 7px;
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

// Function to check if Spotify app is running
const isSpotifyRunning = async () => {
  try {
    const result = await run(
      'osascript -e \'tell application "System Events" to (name of processes) contains "Spotify"\'',
    );
    return result.trim() === "true";
  } catch (error) {
    console.error("Error checking if Spotify is running:", error);
    return false;
  }
};

// Function to get the currently playing song for Spotify
const getSpotifyInfo = async () => {
  try {
    const isRunning = await isSpotifyRunning();
    if (isRunning) {
      const result = await run(
        'osascript -e \'tell application "Spotify" to if player state is playing then return artist of current track & " - " & name of current track\'',
      );
      return result.trim();
    } else {
      return "No music playing";
    }
  } catch (error) {
    console.error("Error getting Spotify info:", error);
    return "Spotify: Not playing";
  }
};

// Exported variables and functions
export const command = async (dispatch) => {
  const spotifyInfo = await getSpotifyInfo();
  dispatch({ type: "SET_INFO", spotifyInfo });
};

export const refreshFrequency = 1000; // Refreshes the widget (milli-seconds)

export const initialState = { spotifyInfo: "" };

export const updateState = (event, previousState) => {
  switch (event.type) {
    case "SET_INFO":
      return { ...previousState, spotifyInfo: event.spotifyInfo };
    default:
      return previousState;
  }
};

// Structure of the widget
export const render = ({ spotifyInfo }, dispatch) => {
  const displayInfo = spotifyInfo || "No music playing";

  return (
    <div className={container}>
      <p className={text}>
        <i className="fas fa-music"></i> {displayInfo}
      </p>
    </div>
  );
};

// REFERENCE LINKS FOR FELLOW DEVELOPERS
// osascript -e 'tell application "Spotify" to if player state is playing then return artist of current track & " - " & name of current track'
