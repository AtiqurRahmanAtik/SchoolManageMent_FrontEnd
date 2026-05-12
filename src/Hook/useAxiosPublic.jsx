import axios from "axios";

// Append /api to the base URL to match the backend routing structure
const axiosPublic = axios.create({
  baseURL: `${process.env.REACT_APP_BACKEND_URL}/api`,
});


const useAxiosPublic = () => {
  return axiosPublic;
};

export default useAxiosPublic;