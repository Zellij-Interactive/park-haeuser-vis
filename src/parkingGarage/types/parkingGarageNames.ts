import { _throw } from '@/core/_throw';

export enum ParkingGarageName {
    Augustusplatz = 'Augustusplatz',
    Bleiche = 'Bleiche',
    Cinestar = 'Cinestar',
    CityPort = 'CityPort',
    Deutschhausplatz = 'Deutschhausplatz',
    Loehrstrasse = 'Loehrstrasse',
    Rheinufergarage = 'Rheinufergarage',
    RoemischesTheater = 'RoemischesTheater',
    Schillerplatz = 'Schillerplatz',
    Taubertsberg = 'Taubertsberg',
}

export const listOfParkingGaragesNames = Object.values(ParkingGarageName).sort((a, b) =>
    a.localeCompare(b)
);

export function toParkingGarageName(name: string): ParkingGarageName {
    if (Object.values(ParkingGarageName).includes(name as ParkingGarageName)) {
        return name as ParkingGarageName;
    }

    _throw(`Invalid ParkingGarageName: "${name}"`);
}
