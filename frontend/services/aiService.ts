import { Query } from "@/models/Query";
import api from "../api/api";

export const askAITutor = async (
  query:Query
) => {
  try {
    const response = await api.post("/ai/query", query);
    return response.data;
  } catch (error) {
    console.error("Failed to reply:", error);
    throw error;
  }
};