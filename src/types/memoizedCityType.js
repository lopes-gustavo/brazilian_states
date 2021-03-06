// @flow
import type { stateType } from './stateType';
/**
 * Type with state name, abbreviation and cities
 * @typedef {Object} memoizedCityType
 * @property {stateType} cityName - Name of the city, the name of the city is dinamic, e.g: Santos: stateType
 */
export type memoizedCityType = {
  [cityName: string]: stateType
};
