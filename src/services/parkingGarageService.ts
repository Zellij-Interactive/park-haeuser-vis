import { useLocalStorage } from '@vueuse/core';
import { type Marker } from '@/types/marker';
import * as d3 from 'd3';
import { timeParse } from 'd3';
import { _throw } from '@/core/_throw';
import { openDB } from 'idb';
import type {
    ParkingGarageInfo,
    ParkingGarage,
    ParkingGarageInfoRaw,
    ParkingGarageRMSERaw,
    ParkingGarageRaw,
} from '@/types/parkingGarage';

export const mainzCoordinates = useLocalStorage<Marker>('MAINZ_LOCATION', {
    latitude: 49.97947979124793,
    longitude: 8.265089599253555,
});

export enum ParkingGarageNames {
    Bleiche = 'Bleiche',
    Cinestar = 'Cinestar',
    CityPort = 'CityPort',
    Deutschhausplatz = 'Deutschhausplatz',
    Loehrstrasse = 'Loehrstrasse',
    Rheinufergarage = 'Rheinufergarage',
    RoemischesTheater = 'RoemischesTheater',
    Schillerplatz = 'Schillerplatz',
    Taubertsberg = 'Taubertsberg',
    Augustusplatz = 'Augustusplatz',
}

export const parkingGaragesInfos = useLocalStorage<ParkingGarageInfo[]>(
    'PARKING_GARAGES_INFOS',
    []
);

export const bleiche = useLocalStorage<ParkingGarage[]>('BLEICHE', []);
export const cinestar = useLocalStorage<ParkingGarage[]>('CINESTAR', []);
export const cityPort = useLocalStorage<ParkingGarage[]>('CITY_PORT', []);
export const deutschhausplatz = useLocalStorage<ParkingGarage[]>('DEUTSCHHAUSPLATZ', []);
export const loehrstrasse = useLocalStorage<ParkingGarage[]>('LOEHRSTRASSE', []);
export const rheinufergarage = useLocalStorage<ParkingGarage[]>('RHEINUFERGARAGE', []);
export const roemischesTheater = useLocalStorage<ParkingGarage[]>('ROEMISCHES_THEATER', []);
export const schillerplatz = useLocalStorage<ParkingGarage[]>('SCHILLERPLATZ', []);
export const taubertsberg = useLocalStorage<ParkingGarage[]>('TAUBERTSBERG', []);
export const augustusplatz = useLocalStorage<ParkingGarage[]>('AUGUSTUSPLATZ', []);

loadParkingGaragesInfos().then((data) => {
    storeInIndexedDB('PARKING_GARAGES_INFOS', data);
});

loadParkingGaragesRMSE().then((data) => {
    //storeInIndexedDB('PARKING_GARAGES_RMSE', data);
});

for (const garageName of Object.values(ParkingGarageNames)) {
    loadParkingGaragesData(garageName).then((data) => {
        //TODO add more garage infos before saving
        storeInIndexedDB(garageName, data);
    });
}

async function loadParkingGaragesInfos(): Promise<ParkingGarageInfoRaw[]> {
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
            maximalOccupancy: parseInt(d['Maximale Belegung in Parkplaetze']),
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

async function loadParkingGaragesRMSE(): Promise<ParkingGarageRMSERaw[]> {
    try {
        const dsv = d3.dsvFormat(';');

        const response = await fetch('./src/data/RMSEListe.csv');

        if (!response) {
            _throw('Failed to fetch CSV.');
        }

        const csvText = await response.text();
        const rawData = dsv.parse(csvText);

        return rawData.map((d) => ({
            name: d['Parkhaus'],
            time: getTimeOfDay(d['Zeit']),
            rmse: parseFloat(d['RMSE'].replace(',', '.')),
            meanValue: parseFloat(d['Wahrer Mittelwert'].replace(',', '.')),
        }));
    } catch (error) {
        console.error('Error processing CSV data:', error);
        return [];
    }
}

async function loadParkingGaragesData(garageName: string): Promise<ParkingGarageRaw[]> {
    try {
        const dsv = d3.dsvFormat(';');

        const response = await fetch(`./src/data/${garageName}.csv`);

        if (!response) {
            _throw('Failed to fetch CSV.');
        }

        const csvText = await response.text();
        const rawData = dsv.parse(csvText);

        const parseDate = timeParse('%d.%m.%Y %H:%M');

        return rawData.map((d) => ({
            date: parseDate(d.Datum) ?? undefined,
            name: garageName,
            prediction: parseFloat(d.Prediction.replace(',', '.')),
            shapEducation: parseFloat(d['SHAP_Education'].replace(',', '.')),
            shapServicesSpecialtyRetail: parseFloat(
                d['SHAP_Services and specialty retail'].replace(',', '.')
            ),
            shapFinanceInsurance: parseFloat(d['SHAP_Finance and insurance'].replace(',', '.')),
            shapLeisureTime: parseFloat(d['SHAP_Leisure time'].replace(',', '.')),
            shapFoodServices: parseFloat(d['SHAP_Food services'].replace(',', '.')),
            shapHealth: parseFloat(d['SHAP_Health'].replace(',', '.')),
            shapGrocery: parseFloat(d['SHAP_Grocery'].replace(',', '.')),
            shapReligion: parseFloat(d['SHAP_Religion'].replace(',', '.')),
            shapShopping: parseFloat(d['SHAP_Shopping'].replace(',', '.')),
            shapOthers: parseFloat(d['SHAP_Others'].replace(',', '.')),
            shapPublicSector: parseFloat(d['SHAP_Public sector'].replace(',', '.')),
            shapTime: parseFloat(d['SHAP_Time'].replace(',', '.')),
            shapMonth: parseFloat(d['SHAP_Month'].replace(',', '.')),
            shapSum: parseFloat(d['SHAP_Sum'].replace(',', '.')),
        }));
    } catch (error) {
        console.error('Error processing CSV data:', error);
        return [];
    }
}

// Store data in IndexedDB
async function storeInIndexedDB(key: string, value: any) {
    const db = await openDB('parking-garage-db', 1, {
        upgrade(db) {
            db.createObjectStore('keyval');
        },
    });
    await db.put('keyval', value, key);
}

// Retrieve data from IndexedDB
async function retrieveFromIndexedDB(key: string) {
    const db = await openDB('parking-garage-db', 1);
    return await db.get('keyval', key);
}

function getTimeOfDay(input: string): number {
    const match = input.match(/^(\d+),/);
    return match ? parseInt(match[1], 10) : -1;
}
