import { ProgressTracker } from "@/models/ProgressTracker";
import api from "../api/api";
import { StudentProgress } from "@/models/StudentProgress";

export const createProgressTracker = async (
  progressTrackerData: ProgressTracker
) => {
  try {
    const response = await api.post("/progress/status", progressTrackerData);
    return response.data;
  } catch (error) {
    console.error("Failed to create lesson:", error);
    throw error;
  }
};

export const updateProgressTracker = async (
  studentProgressData: StudentProgress
) => {
  try {
    const response = await api.put("/progress", studentProgressData);
    return response.data;
  } catch (error) {
    console.error("Failed to update student progress:", error);
    throw error;
  }
};
