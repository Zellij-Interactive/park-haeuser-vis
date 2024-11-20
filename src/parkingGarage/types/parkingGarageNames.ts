import { _throw } from '@/core/_throw';

export enum ParkingGarageName {
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

export function toParkingGarageName(name: string): ParkingGarageName {
    if (Object.values(ParkingGarageName).includes(name as ParkingGarageName)) {
        return name as ParkingGarageName;
    }

    _throw(`Invalid ParkingGarageName: "${name}"`);
}
