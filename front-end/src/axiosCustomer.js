// axiosCustomer.js
import axios from "axios";

const apiCustomer = axios.create({
    baseURL: "http://localhost:5000/api",
});

export default apiCustomer;
