export enum ShapName {
    SHAPEducation = 'Education',
    SHAPServicesSpecialtyRetail = 'Services and Specialty Retail',
    SHAPFinanceInsurance = 'Finance and Insurance',
    SHAPLeisureTime = 'Leisure Time',
    SHAPFoodServices = 'Food and Services',
    SHAPHealth = 'Health',
    SHAPGrocery = 'Grocery',
    SHAPReligion = 'Religion',
    SHAPShopping = 'Shopping',
    SHAPOthers = 'Others',
    SHAPPublicSector = 'PublicSector',
    SHAPTime = 'Time',
    SHAPMonth = 'Month',
    SHAPSum = 'Sum',
}

export type ShapValue = {
    name: ShapName;
    value: number;
};
