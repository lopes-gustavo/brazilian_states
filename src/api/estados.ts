// @flow
import filter from 'lodash/filter';
import find from 'lodash/find';
import forEach from 'lodash/forEach';
import map from 'lodash/map';
import removeAccents from 'remove-accents';
import { memoizedCityType } from '../types/memoizedCityType';
import { memoizedRegionWithStateType } from '../types/memoizedRegionWithStateType';
import { memoizedStateType } from '../types/memoizedStateType';
import { regionType } from '../types/regionType';
import { regionWithStateType } from '../types/regionWithStateType';
import { stateType } from '../types/stateType';
import ac from './estados/acre';
import al from './estados/alagoas';
import ap from './estados/amapa';
import am from './estados/amazonas';
import ba from './estados/bahia';
import ce from './estados/ceara';
import df from './estados/df';
import es from './estados/espiritosanto';
import go from './estados/goias';
import ma from './estados/maranhao';
import mt from './estados/matogrosso';
import ms from './estados/matogrossodosul';
import mg from './estados/minasgerais';
import pa from './estados/para';
import pb from './estados/paraiba';
import pr from './estados/parana';
import pi from './estados/piaui';
import rj from './estados/riodejaneiro';
import rn from './estados/riograndedonorte';
import rs from './estados/riograndedosul';
import ro from './estados/rondonia';
import rr from './estados/roraima';
import sc from './estados/santacatarina';
import sp from './estados/saopaulo';
import se from './estados/sergipe';
import to from './estados/tocantins';

const api: any = {};

const states: stateType[] = [
  ac,
  al,
  am,
  ap,
  ba,
  ce,
  df,
  es,
  go,
  ma,
  mg,
  ms,
  mt,
  pa,
  pb,
  pi,
  pr,
  rj,
  rn,
  ro,
  rr,
  rs,
  sc,
  se,
  sp,
  to,
];

const southEastStates: string[] = [
  'São Paulo',
  'Rio de Janeiro',
  'Espírito Santo',
  'Minas Gerais',
];
const southRegionStates: string[] = [
  'Paraná',
  'Rio Grande do Sul',
  'Santa Catarina',
];
const northRegionStates: string[] = [
  'Acre',
  'Amapá',
  'Amazonas',
  'Pará',
  'Rondonia',
  'Roraima',
  'Tocantins',
];
const northEastRegionStates: string[] = [
  'Alagoas',
  'Bahia',
  'Maranhão',
  'Paraiba',
  'Pernambuco',
  'Piauí',
  'Rio Grande do Norte',
  'Sergipe',
];
const middleEastRegionStates: string[] = [
  'Distrito Federal',
  'Goiás',
  'Mato Grosso',
  'Mato Grosso do Sul',
];

const southEastRegionStatesAndCities =
  filter(states, state => southEastStates.indexOf(state.state) !== -1);
const southRegionStatesAndCities =
  filter(states, state => southRegionStates.indexOf(state.state) !== -1);
const northRegionStatesAndCities =
  filter(states, state => northRegionStates.indexOf(state.state) !== -1);
const northEastRegionStatesAndCities =
  filter(states, state => northEastRegionStates.indexOf(state.state) !== -1);
const middleEastRegionStatesAndCities =
  filter(states, state => middleEastRegionStates.indexOf(state.state) !== -1);

const southEastRegionData = {
  regionName: 'Sudeste',
  states: southEastRegionStatesAndCities,
};

const southRegionData = {
  regionName: 'Sul',
  states: southRegionStatesAndCities,
};

const northRegionData = {
  regionName: 'Norte',
  states: northRegionStatesAndCities,
};

const northEastRegionData = {
  regionName: 'Nordeste',
  states: northEastRegionStatesAndCities,
};

const middleEastRegionData = {
  regionName: 'Centro-Oeste',
  states: middleEastRegionStatesAndCities,
};

const regions = {
  ['centrooeste']: middleEastRegionData,
  nordeste: northEastRegionData,
  norte: northRegionData,
  sudeste: southEastRegionData,
  sul: southRegionData,
};

const normalizedCities = map(states, (state: stateType) => {
  const stateCitiesNormalized = map(state.cities, city => removeAccents(city.replace(/\s|-|_/g, '').toLowerCase()));
  return { ...state, cities: stateCitiesNormalized };
});

const memoizedStates: memoizedStateType = {};
const memoizedCities: memoizedCityType = {};
const memoizedRegions: memoizedRegionWithStateType = {};

export const checkIfVariableIsBoolean = (variable: boolean, variableName: string): void => {
  if (variable !== true && variable !== false)
    throw new Error(`"${variableName}" parameter should be of boolean type`);
};

export const requiredParam = (param: string) => {
  const requiredParamError: Error = new Error(`Required parameter, "${param}" is missing.`);
  // preserve original stack trace
  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(
      requiredParamError,
      requiredParam,
    );
  }
  throw requiredParamError;
};

export const getAllRegions = ({
    shouldReturnEntireJson = false,
  }: {
    shouldReturnEntireJson: boolean,
  }): regionType[] | string[] => {
  if (shouldReturnEntireJson === null) throw new Error('shouldReturnEntireJson property cannot be null ');
  checkIfVariableIsBoolean(shouldReturnEntireJson, 'shouldReturnEntireJson');
  if (shouldReturnEntireJson) return map(regions, region => region);
  return map(regions, region => region.regionName);
};

export const getRegion = ({ region = requiredParam('region') }: { region: string[] }): regionType[] => {
  if (!region) throw new Error('region parameter cannot be null or undefined');
  if (!Array.isArray(region)) throw new Error('region parameter should be an Array');
  return map(region, singleRegion => {
    const normalizedRegionName = removeAccents(singleRegion.replace(/\s|-|_/g, '').toLowerCase());
    return regions[normalizedRegionName];
  });
};

export const getStateRegion = ({ state = requiredParam('state') }: { state: string }): regionType | {} => {
  if (!state) throw new Error('state property cannot be null or undefined');
  if (typeof state !== 'string') throw new Error('variable state should be a string');
  const memoizedStateRegion = memoizedRegions[state];
  if (!memoizedStateRegion) {
    const foundRegion = find(regions, region => find(region.states, (regionState) => {
      const normalizedStateName = removeAccents(state.replace(/\s|-|_/g).toLowerCase());
      return removeAccents(regionState.state.replace(/\s|-|_/g).toLowerCase()) === normalizedStateName;
    }));
    if (!foundRegion) return {};
    memoizedRegions[state] = foundRegion;
    return foundRegion;
  }
  return memoizedStateRegion;
};

export const getCityRegion = ({
  city = requiredParam('city'),
  shouldReturnEntireJson = false,
}: {
    city: string,
    shouldReturnEntireJson: boolean,
  }): string | regionType | stateType => {
  if (typeof city !== 'string') throw new Error('city parameter must be a string');
  if (typeof shouldReturnEntireJson !== 'boolean') throw new Error('shouldReturnEntireJson parameter must be a string');
  const memoizedCityRegion: regionWithStateType = memoizedRegions[city];
  if(!memoizedCityRegion) {
    const foundRegion = find(regions, region => find((region.states as any), state => state.cities.indexOf(city) >= 0));
    const [foundState] = filter(foundRegion.states, state => state.cities.indexOf(city) >= 0);
    const foundRegionWithCityState = { ...foundRegion, cityState: foundState };
    memoizedRegions[city] = foundRegionWithCityState;
    if (shouldReturnEntireJson) return foundRegionWithCityState;
    return foundRegionWithCityState.regionName;
  }
  if (shouldReturnEntireJson)return memoizedCityRegion;
  return memoizedCityRegion.regionName;
};

/**
 * This function returns an array with the cities of the given state
 * @param {Object} stateObject - The object the tells the name of the state.
 * @param {string} stateObject.state - The state name.
 *
 * @example
 * const cities = api.getStateCities({ state: 'São Paulo' });
 * // { state: 'São Paulo', abbreviation: 'sp', cities: ['Santos', 'São Vicente', 'Guarujá',...] }
 */
export const getStateCities = ({ state = requiredParam('state') }: { state: string }): stateType => {
  if (!state) throw new Error('state property cannot be null or undefined');
  if (typeof state !== 'string') throw new Error ('state property must be a string');
  const normalizedState = removeAccents(state.replace(/\s|-|_/g, '').toLowerCase());
  const memoizedState: stateType = memoizedStates[normalizedState];
  if (memoizedState) {
    return memoizedState;
  }
  const findStateInstantiated = findState(state);
  const stateFound: stateType | null = find(states, findStateInstantiated);
  if (stateFound) {
    memoizedStates[normalizedState] = stateFound;
  }
  return stateFound;
};

const findState = (state: string) => {
  const normalizedState = removeAccents(state.replace(/\s|-|_/g, '').toLowerCase());
  return (element) => removeAccents(element.state.replace(/\s|-|_/g, '').toLowerCase()) === normalizedState || element.abbreviation === normalizedState;
};

/**
 * This function receives the city name and returns the full json stateType object
 * or only the name of the state depending on shouldReturnEntireJson property.
 * If the state is not found, it returns an empty object or an empty string.
 * @param {Object} cityObject - The object the tells the name of the city and if the return
 * should be an object or just a string.
 * @param {string} cityObject.city - The city name.
 * @param {boolean} cityObject.shouldReturnEntireJson - This property tells to the method
 * that the return should ou should not be the full state object.
 * If the property is true, it will return the entire stateType object,
 * if its false or not set, it will return just the string with the name of the state.
 *
 * @example
 * const cities = api.getCityState({ city: 'Santos', shouldReturnEntireJson: true });
 * // { state: 'São Paulo', abbreviation: 'sp', cities: ['Santos', 'São Vicente', 'Guarujá',...] }
 *
 * @example
 * const cities = api.getCityState({ city: 'Santos' });
 * // 'São Paulo'
 *
 * @example
 * const cities = api.getCityState({ city: 'Santos', shouldReturnEntireJson: false });
 * // 'São Paulo',
 *
 * @example
 * const cities = api.getCityState({ city: 'randomCity' });
 * // ''
 *
 * @example
 * const cities = api.getCityState({ city: 'randomCity' , shouldReturnEntireJson: false});
 * // ''
 *
 * @example
 * const cities = api.getCityState({ city: 'randomCity', shouldReturnEntireJson: true });
 * // {}
 */
export const getCityState = ({
  city = requiredParam('city'),
  shouldReturnEntireJson = false,
}: {
  city: string,
  shouldReturnEntireJson?: boolean,
}): string | stateType | {} => {
  checkIfVariableIsBoolean(shouldReturnEntireJson, 'shouldReturnEntireJson');
  const normalizedCity = removeAccents(city.replace(/\s|-|_/g, '').toLowerCase());
  const memoizedCity = memoizedCities[normalizedCity];
  if (memoizedCity) return shouldReturnEntireJson ? memoizedCity : memoizedCity.state;
  const findCity = (element: stateType): boolean => element.cities.indexOf(normalizedCity) >= 0;
  const state: stateType = find(normalizedCities, findCity);
  if (!state) return shouldReturnEntireJson ? {} : '';
  const stateIndex = normalizedCities.indexOf(state);
  const realState = states[stateIndex];
  memoizedCities[normalizedCity] = realState;
  if (shouldReturnEntireJson) return realState;
  return realState.state;
};

/**
 * Function that memoize all the states and cities, doing it eagerly.
 * @example
 * eagerMemoization();
 * // Using it will memoize everything, making api.getCityState and api.getStateCities faster
 */
export const eagerMemoization = (): void => {
  forEach(states, (state: stateType) => {
    const normalizedStateName = removeAccents(state.state.replace(/\s|-|_/g).toLowerCase());
    memoizedStates[normalizedStateName] = state;
    forEach(state.cities, (city: string) => {
      const normalizedCityName = removeAccents(city.replace(/\s|-|_/g).toLowerCase());
      memoizedCities[normalizedCityName] = state;
    });
  });
};
