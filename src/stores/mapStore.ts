import { useLocalStorage } from '@vueuse/core';
import { type Marker } from '@/types/marker';
import type { ParkingGarageInfo } from '@/types/parkingGarage';
import type { ParkingGarageData } from '@/types/parkingGarageData';
import * as d3 from 'd3';
import { timeParse } from 'd3';
import { _throw } from '@/core/_throw';

export const mainzCoordinates = useLocalStorage<Marker>('MAINZ_LOCATION', {
    latitude: 49.97947979124793,
    longitude: 8.265089599253555,
});

export const parkingGaragesInfos = useLocalStorage<ParkingGarageInfo[]>(
    'PARKING_GARAGES_INFOS',
    []
);
export const parkingGaragesData = useLocalStorage<ParkingGarageData[]>('PARKING_GARAGES_DATA', []);

loadParkingGaragesInfos().then((data) => {
    parkingGaragesInfos.value = data;
});

loadParkingGaragesData().then((data) => {
    console.log(data);
    parkingGaragesData.value = data;
});

async function loadParkingGaragesInfos(): Promise<ParkingGarageInfo[]> {
    try {
        const dsv = d3.dsvFormat(';');

        const response = await fetch('./src/data/Parkhausinfos.csv');

        if (!response) {
            _throw('Failed to fetch CSV.');
        }

        const csvText = await response.text();
        const rawData = dsv.parse(csvText);

        return rawData.map((d) => ({
            name: d.Name,
            maximalOccupancy: +d['Maximale Belegung in Parkplaetze'],
            location: {
                latitude: parseFloat(d.Latitude.replace(',', '.')),
                longitude: parseFloat(d.Longitude.replace(',', '.')),
            },
        }));
    } catch (error) {
        console.error('Error processing CSV data:', error);
        return [];
    }
}

async function loadParkingGaragesData(): Promise<ParkingGarageData[]> {
    try {
        const dsv = d3.dsvFormat(';');

        const response = await fetch('./src/data/Parkhausdaten.csv');

        if (!response) {
            _throw('Failed to fetch CSV.');
        }

        const csvText = await response.text();
        const rawData = dsv.parse(csvText);

        const parseDate = timeParse('%d.%m.%Y %H:%M');

        return rawData.map((d) => ({
            date: parseDate(d.Datum) ?? undefined,
            infos: undefined,
            prediction: +d.Prediction,
            shapEducation: +d['SHAP_Education'],
            shapServicesSpecialtyRetail: +d['SHAP_Services and specialty retail'],
            shapFinanceInsurance: +d['SHAP_Finance and insurance'],
            shapLeisureTime: +d['SHAP_Leisure time'],
            shapFoodServices: +d['SHAP_Food services'],
            shapHealth: +d['SHAP_Health'],
            shapGrocery: +d['SHAP_Grocery'],
            shapReligion: +d['SHAP_Religion'],
            shapShopping: +d['SHAP_Shopping'],
            shapOthers: +d['SHAP_Others'],
            shapPublicSector: +d['SHAP_Public sector'],
            shapTime: +d['SHAP_Time'],
            shapMonth: +d['SHAP_Month'],
        }));
    } catch (error) {
        console.error('Error processing CSV data:', error);
        return [];
    }
}
