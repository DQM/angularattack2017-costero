import { ILatLng } from './latLng.interface';
import { Address } from './address';
import { LngLatBounds } from 'mapbox-gl';

export class Location implements ILatLng {
    latitude: number;
    longitude: number;
    address: Address;
    viewBounds: LngLatBounds;
    timestamp: number;
    altitude: number;
    accuracy: number;
}
