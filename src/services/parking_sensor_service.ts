import { APIResponseParkingRestriction, APIResponseParkingSpace, Coordinate, ParkingSpace } from "../types";
import { AxiosError, AxiosResponse } from "axios";
import parseParkingRestrictionDescription from '../helper/parse_parking_restriction_description';

const axios = require('axios');

const API_URL = process.env.REACT_APP_API_URL;
const HHMMSS_PATTERN = /(\d{2}):(\d{2}):\d{2}/;

const convertAPIParkingSpace = (apiResponseParkingSpaces: APIResponseParkingSpace[]): ParkingSpace[] => {
  return apiResponseParkingSpaces.map(p => {
    return {
      coordinate: {
        latitude: Number(p.location.coordinates[1]),
        longitude: Number(p.location.coordinates[0])
      },
      currentRestriction: getCurrentParkingRestriction(p.restrictions),
      id: p.bay_id,
      stMarkerId: p.st_marker_id
    }
  });
};

const getCurrentParkingRestriction = (parkingRestrictions: APIResponseParkingRestriction[]) => {
  let remainingRestrictions = parkingRestrictions ? parkingRestrictions.slice(0) : [];
  const now = new Date();
  const startTime = new Date(now);
  const endTime = new Date(now);

  remainingRestrictions = remainingRestrictions.filter((restriction: APIResponseParkingRestriction) => {
    const startHM = restriction.startTime.match(HHMMSS_PATTERN);
    const endHM = restriction.endTime.match(HHMMSS_PATTERN);
    if (startHM == null || endHM == null) {
      return undefined;
    }

    startTime.setHours(+startHM[1], +startHM[2]);
    endTime.setHours(+endHM[1], +endHM[2]);

    return (
      // 1. if fromDay is 1 and toDay is 0, it applies to any day of the week (Mon to Sun)
      ((restriction.fromDay === 1 && restriction.toDay === 0) ||
      // 2. filter out all restrictions that don't apply to the current day (0-6, Sunday is 0)
        now.getDay() >= restriction.fromDay && now.getDay() <= restriction.toDay) &&
      // 3. filter by time range
      now.getTime() >= startTime.getTime() && now.getTime() <= endTime.getTime()
    );
  });

  return remainingRestrictions.length === 1 ?
    parseParkingRestrictionDescription(remainingRestrictions[0]) :
    undefined;
};

function findAvailableParkings(centreLocation: Coordinate) {
  const requestUrl = `${API_URL}?lat=${centreLocation.latitude}&lng=${centreLocation.longitude}&radiusInMeter=500`;
  return new Promise((resolve, reject) => {
    axios.get(requestUrl, {
      timeout: 10000
    })
      .then((response: AxiosResponse) => {
        resolve(convertAPIParkingSpace(response.data));
      })
      .catch((err: AxiosError) => {
        console.warn(`ERROR(${err.code}): ${err.message}`, err.stack);
        reject(err);
      })
  });
}

export { findAvailableParkings };
