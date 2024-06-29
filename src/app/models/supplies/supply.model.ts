export interface Supply {
  id?: number;
  name: string;
  unit?: Unit;
  price: number;
}

export enum Unit {
  GRAMS = "Grams",
  MILILITERS ='Ml'
}
