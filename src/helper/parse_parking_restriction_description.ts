import { APIResponseParkingRestriction, ParkingRestriction } from '../types';

const parseParkingRestrictionDescription = (parkingRestrictionFromApiResponse: APIResponseParkingRestriction): ParkingRestriction => {
  return Object.assign({},
    parkingRestrictionFromApiResponse,
    {
      disabilityDuration: (parkingRestrictionFromApiResponse.disabilityExt && parkingRestrictionFromApiResponse.disabilityExt !== 0) ?
        parkingRestrictionFromApiResponse.disabilityExt :
        parkingRestrictionFromApiResponse.duration,
      isMetered: parkingRestrictionFromApiResponse.typeDesc.match(/\bMeter\b/) !== null,
      isDisabledOnly: parkingRestrictionFromApiResponse.typeDesc.match(/\bDisabled Only\b/) !== null,
      isLoadingZone: parkingRestrictionFromApiResponse.typeDesc.match(/\bLoading Zone\b/) !== null
    })
};

export default parseParkingRestrictionDescription;