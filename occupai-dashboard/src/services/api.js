import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const api = {
    getCurrentOccupancy: (locationId) =>
        axios.get(`${BASE_URL}/occupancy/current/${locationId}`),

    getHistory: (locationId) =>
        axios.get(`${BASE_URL}/occupancy/history/${locationId}`),

    getUpcomingPredictions: (locationId) =>
        axios.get(`${BASE_URL}/predict/upcoming/${locationId}`),

    getBestTime: (locationId) =>
        axios.get(`${BASE_URL}/predict/besttime/${locationId}`),
};