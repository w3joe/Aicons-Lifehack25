import { ProgressTracker } from "@/models/ProgressTracker";
import api from "../api/api";

export const createProgressTracker = async (progressTrackerData: ProgressTracker) => {
  try {
    const response = await api.post(
      "/progress/status",
      progressTrackerData
    );
    return response.data;
  } catch (error) {
    console.error("Failed to create lesson:", error);
    throw error;
  }
};
