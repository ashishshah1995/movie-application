import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5017/api/movies",
  timeout: 10000,
});

export const getMovies = async () => {
  try {
    const response = await api.get("/");
    return response.data;
  } catch (error) {
    console.error("API Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error("Failed to fetch movies. Please try again later.");
  }
};
