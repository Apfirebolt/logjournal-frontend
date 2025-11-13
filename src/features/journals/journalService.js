import axiosInstance from "../../utils/axiosInstance";

// Get journal List
const getJournalList = async (page = 1, search = "") => {
  try {
    const params = new URLSearchParams();
    if (page) {
      params.append("page", page);
    }
    if (search) {
      params.append("search", search);
    }
    const response = await axiosInstance.get(`/journals?${params.toString()}`);
    return response.data;
  } catch (err) {
    let errorMessage = "Something went wrong";
    if (err.response?.status === 401) {
      errorMessage = "Unauthorized access, please login again.";
    }
    throw new Error(errorMessage);
  }
};

// Get journal by ID
const getJournalById = async (id) => {
  try {
    const response = await axiosInstance.get(`/journals/${id}`);
    return response.data;
  } catch (err) {
    let errorMessage = "Something went wrong";
    if (err.response?.status === 401) {
      errorMessage = "Unauthorized access, please login again.";
    }
    throw new Error(errorMessage);
  }
};

// Create journal
const createJournal = async (journalData) => {
  try {
    const response = await axiosInstance.post("/journals", journalData);
    return response.data;
  } catch (err) {
    let errorMessage = "Something went wrong";
    if (err.response?.status === 401) {
      errorMessage = "Unauthorized access, please login again.";
    }
    throw new Error(errorMessage);
  }
};

// Update journal
const updateJournal = async (id, journalData) => {
  try {
    const response = await axiosInstance.put(`/journals/${id}`, journalData);
    return response.data;
  } catch (err) {
    let errorMessage = "Something went wrong";
    if (err.response?.status === 401) {
      errorMessage = "Unauthorized access, please login again.";
    }
    throw new Error(errorMessage);
  }
};

// Delete journal
const deleteJournal = async (id) => {
  try {
    const response = await axiosInstance.delete(`/journals/${id}`);
    return response.data;
  } catch (err) {
    let errorMessage = "Something went wrong";
    if (err.response?.status === 401) {
      errorMessage = "Unauthorized access, please login again.";
    }
    throw new Error(errorMessage);
  }
};

const journalService = {
  getJournalList,
  getJournalById,
  createJournal,
  updateJournal,
  deleteJournal,
};

export default journalService;
