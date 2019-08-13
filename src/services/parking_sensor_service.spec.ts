import axios, { AxiosResponse } from 'axios';
import { APIResponseParkingSpace, APIResponseParkingRestriction } from "../types";
import { findAvailableParkings } from './parking_sensor_service';

jest.mock('axios');

enum RestrictionLabel {
  WEEKDAY_DAYTIME = "WEEKDAY_DAYTIME",
  WEEKDAY_NIGHT_TIME = "WEEKDAY_NIGHT_TIME",
  SUNDAY_DAYTIME = "SUNDAY_DAYTIME"
};

const PARKING_RESTRICTIONS = [
  {
    "_id": RestrictionLabel.WEEKDAY_DAYTIME,
    "description": "1P MTR M-SAT 7:30-18:30",
    "duration": 60,
    "effectiveOnPH": false,
    "typeDesc": "1P Meter",
    "fromDay": 1,
    "toDay": 6,
    "startTime": "07:30:00",
    "endTime": "18:30:00",
    "disabilityExt": 120
  },
  {
    "_id": RestrictionLabel.WEEKDAY_NIGHT_TIME,
    "description": "2P MTR M-SAT 18.30 - 20.30",
    "duration": 120,
    "effectiveOnPH": false,
    "typeDesc": "2P",
    "fromDay": 1,
    "toDay": 6,
    "startTime": "18:30:00",
    "endTime": "20:30:00",
    "disabilityExt": 240
  },
  {
    "_id": RestrictionLabel.SUNDAY_DAYTIME,
    "description": "1P SUN 7:30-18:30",
    "duration": 60,
    "effectiveOnPH": false,
    "typeDesc": "1P",
    "fromDay": 0,
    "toDay": 0,
    "startTime": "07:30:00",
    "endTime": "18:30:00",
    "disabilityExt": 120
  }
];

const makeApiResponse: (restrictions: APIResponseParkingRestriction[]) => AxiosResponse<APIResponseParkingSpace[]> = (restrictions) => {
  const apiResponseParkingSpace: APIResponseParkingSpace = {
    location: {
      coordinates: ['1', '1']
    },
    bay_id: 'bay_id',
    st_marker_id: 'st_marker_id',
    restrictions: restrictions
  };

  const apiResponse: AxiosResponse<APIResponseParkingSpace[]> = {
    data: [apiResponseParkingSpace],
    status: 200,
    statusText: 'OK',
    headers: {},
    config: {}
  };
  return apiResponse;
};

const mockNewDate = (dateStr: string) => {
  // https://codewithhugo.com/mocking-the-current-date-in-jest-tests/
  // const datetime = new Date(dateStr)
  // jest.spyOn(global, 'Date').mockImplementation(() => datetime);
  jest
    .spyOn(global.Date, 'now')
    .mockImplementationOnce(() =>
      new Date(dateStr).valueOf()
    );
};

describe('parking_sensor_service', () => {
  [
    { currentDateTime: '2019-08-12T12:00:00.000+1000', expected: RestrictionLabel.WEEKDAY_DAYTIME },
    { currentDateTime: '2019-08-12T19:00:00.000+1000', expected: RestrictionLabel.WEEKDAY_NIGHT_TIME },
    { currentDateTime: '2019-08-18T12:00:00.000+1000', expected: RestrictionLabel.SUNDAY_DAYTIME }
  ].forEach((testcase) => {
    it(`should return parking restriction for ${testcase.expected}`, async () => {
      const apiResponse = makeApiResponse(PARKING_RESTRICTIONS);
      // https://github.com/kulshekhar/ts-jest/issues/472#issuecomment-421960393
      // @ts-ignore
      axios.get.mockResolvedValue(apiResponse);

      try {
        mockNewDate(testcase.currentDateTime);
        const parkingSpaces = await findAvailableParkings({ latitude: 1, longitude: 1 });
        expect(parkingSpaces.length).toEqual(1);
        expect(parkingSpaces[0].currentRestriction).toBeDefined();
        expect(parkingSpaces[0].currentRestriction._id).toEqual(testcase.expected);
      } catch (e) {
        fail(e);
      }
    });
  });
});