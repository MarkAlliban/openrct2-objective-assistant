import {formatCurrency} from '../utils/format-currency';
import { SUCCESS_COLOUR, ERROR_COLOUR, WARNING_COLOUR } from "../constants";
import { TRideInfo } from "./update-rides-data";

const getRideName = (ride: TRideInfo) => {
  if (ride.breakdown !== "none") return `{${ERROR_COLOUR}}${ride.name}`;
  if (ride.status === "open") return ride.name;
  return ride.status === "testing"
    ? `{${WARNING_COLOUR}}${ride.name}`
    : `{${ERROR_COLOUR}}${ride.name}`;
};
const getColour = (ride: TRideInfo) => {
  return ride.duplicateType
    ? `{${WARNING_COLOUR}}`
    : ride.meetsRequirements
      ? `{${SUCCESS_COLOUR}}`
      : "";
};

const getTypeName = (ride: TRideInfo) => {
  if (!ride.typeName) return `{${ERROR_COLOUR}}UNKNOWN`;
  return `${getColour(ride)}${ride.typeName}`;
};

const getExcitementString = (ride: TRideInfo) => {
  if (ride.classification !== "ride") return "-";
  if (ride.excitement === -1 || ride.excitement === undefined) return `{${ERROR_COLOUR}}???`;
  return `${getColour(ride)}${(ride.excitement / 100).toFixed(2)}`;
};

const getLengthString = (ride: TRideInfo) => {
  if (ride.classification !== "ride") return "-";
  if (ride.excitement === -1) return `{${ERROR_COLOUR}}???`;
  if (ride.rideLength === 0) return "-";
  return `${ride.meetsLengthRequirement ? (ride.duplicateType ? `{${WARNING_COLOUR}}` : `{${SUCCESS_COLOUR}}`) : ""}${context.formatString("{LENGTH}", ride.rideLength)}`;
};

const getRidersString = (ride: TRideInfo) => {
  if (ride.error && ride.error > 0)
    return `{${ERROR_COLOUR}}In ${(ride.error / 40).toFixed(0)}`;
  return `${ride.count?.toFixed(0) || 0}`;
};

const getValueString = (ride: TRideInfo) => {
  if (ride.valueCalculated === null || ride.valueCalculated === undefined)
    return `{${ERROR_COLOUR}}???`;
  return `${ride.incomplete ? `{${ERROR_COLOUR}}` : ""}${formatCurrency(ride.valueCalculated * 10)}`;
};

export const renderRideTableRow = (ride: TRideInfo, columns: string[]) => {
  const cols: string[] = [];
  if (columns.indexOf("name") !== -1) cols.push(getRideName(ride));
  if (columns.indexOf("type") !== -1) cols.push(getTypeName(ride));
  if (columns.indexOf("excitement") !== -1) cols.push(getExcitementString(ride));
  if (columns.indexOf("length") !== -1) cols.push(getLengthString(ride));
  if (columns.indexOf("riders") !== -1) cols.push(getRidersString(ride));
  if (columns.indexOf("bonus") !== -1) cols.push(`${ride.bonusValue}`);
  if (columns.indexOf("value") !== -1) cols.push(getValueString(ride));
  return cols;
};
