import { APIResponseParkingSpace, Coordinate, ParkingSpace } from "../types";
import { AxiosError, AxiosResponse } from "axios";

const axios = require('axios');

const API_URL = process.env.REACT_APP_API_URL;

const convertAPIParkingSpace = (apiResponseParkingSpaces: APIResponseParkingSpace[]): ParkingSpace[] => {
  return apiResponseParkingSpaces.map(p => {
    return {
      coordinate: {
        latitude: Number(p.location.coordinates[1]),
        longitude: Number(p.location.coordinates[0])
      },
      id: p.bay_id
    }
  });
};

function findAvailableParkings(centreLocation: Coordinate) {
  const requestUrl = `${API_URL}?lat=${centreLocation.latitude}&lng=${centreLocation.longitude}&radiusInMeter=500`;
  return new Promise((resolve, reject) => {
    axios.get(requestUrl, {
      timeout: 5000
    })
      .then((response: AxiosResponse) => {
        resolve(convertAPIParkingSpace(response.data));
      })
      .catch((err: AxiosError) => {
        console.warn(`ERROR(${err.code}): ${err.message}`);
        reject(err);
      })
  });
}

export { findAvailableParkings };