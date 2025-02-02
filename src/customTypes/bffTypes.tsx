export interface Athlete {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  birthdate: string;
  gender: string;
  total_medal: MedalType;
  swimming_certificate: boolean;
}

export enum MedalType {
  GOLD = "GOLD",
  SILVER = "SILVER",
  BRONZE = "BRONZE",
}
