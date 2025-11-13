import axiosInstance from "../../utils/axiosInstance";

// Get category List
const getCategoryList = async (page = 1, search = "") => {
  try {
    const params = new URLSearchParams();
    if (page) {
      params.append("page", page);
    }
    if (search) {
      params.append("search", search);
    }
    const response = await axiosInstance.get(
      `/categories?${params.toString()}`
    );
    return response.data;
  } catch (err) {
    let errorMessage = "Something went wrong";
    if (err.response?.status === 401) {
      errorMessage = "Unauthorized access, please login again.";
    }
    throw new Error(errorMessage);
  }
};

// Get category by ID
const getCategoryById = async (id) => {
  try {
    const response = await axiosInstance.get(`/categories/${id}`);
    return response.data;
  } catch (err) {
    let errorMessage = "Something went wrong";
    if (err.response?.status === 401) {
      errorMessage = "Unauthorized access, please login again.";
    }
    throw new Error(errorMessage);
  }
};

// Create category
const createCategory = async (categoryData) => {
  try {
    const response = await axiosInstance.post("/categories", categoryData);
    return response.data;
  } catch (err) {
    let errorMessage = "Something went wrong";
    if (err.response?.status === 401) {
      errorMessage = "Unauthorized access, please login again.";
    }
    throw new Error(errorMessage);
  }
};

// Update category
const updateCategory = async (id, categoryData) => {
  try {
    const response = await axiosInstance.put(`/categories/${id}`, categoryData);
    return response.data;
  } catch (err) {
    let errorMessage = "Something went wrong";
    if (err.response?.status === 401) {
      errorMessage = "Unauthorized access, please login again.";
    }
    throw new Error(errorMessage);
  }
};

// Delete category
const deleteCategory = async (id) => {
  try {
    const response = await axiosInstance.delete(`/categories/${id}`);
    return response.data;
  } catch (err) {
    let errorMessage = "Something went wrong";
    if (err.response?.status === 401) {
      errorMessage = "Unauthorized access, please login again.";
    }
    throw new Error(errorMessage);
  }
};

const categoryService = {
  getCategoryList,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export default categoryService;
