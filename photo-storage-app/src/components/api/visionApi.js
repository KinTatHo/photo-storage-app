import axios from "axios";

const API_KEY="AIzaSyCTmGZ9Q_5Jr-tMRTC2eH8-ubV8JySMWAU"
const API_ENDPOINT="https://vision.googleapis.com/v1/images:annotate"

export const analyzeImage = async (imageUrl) => {
  try {
    const response = await axios.post(`${API_ENDPOINT}?key=${API_KEY}`, {
      requests: [
        {
          image: {
            source: {
              imageUri: imageUrl,
            },
          },
          features: [
            { type: "LABEL_DETECTION", maxResults: 5 },
            { type: "TEXT_DETECTION" },
            { type: "FACE_DETECTION" },
          ],
        },
      ],
    });

    const result = response.data.responses[0];

    return {
      labels: result.labelAnnotations?.map((label) => label.description) || [],
      text: result.textAnnotations?.[0]?.description || "",
      faces: result.faceAnnotations?.length || 0,
    };
  } catch (error) {
    console.error("Error analyzing image:", error);
    throw new Error("Failed to analyze image");
  }
};