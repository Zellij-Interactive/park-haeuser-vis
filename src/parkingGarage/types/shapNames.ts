export enum ShapName {
    shapEducation = 'Education',
    shapServicesSpecialtyRetail = 'Services and Specialty Retail',
    shapFinanceInsurance = 'Finance and Insurance',
    shapLeisureTime = 'Leisure Time',
    shapFoodServices = 'Food and Services',
    shapHealth = 'Health',
    shapGrocery = 'Grocery',
    shapReligion = 'Religion',
    shapShopping = 'Shopping',
    shapOthers = 'Others',
    shapPublicSector = 'PublicSector',
    shapTime = 'Time',
    shapMonth = 'Month',
    shapSum = 'Sum',
}

export type SHAPValue = {
    name: ShapName;
    value: number;
};
