export interface Deduction80DRecord {
  __id__: string;
  Member_ID: string;
  Financial_Year_Master_ID: string;
  In_respect_of: InRespectOf;
  Age_Group: AgeGroup;
  Kind_of_payment: KindOfPayment;
  type_of_policy: TypeOfPolicy;
  Name_of_Insurance_company: string;
  Policy_number: string;
  Premium_Amount: number;
  Amount: number;
  Deduction_Note: string;
  Deduction_80D_Files_Name: string[];
  Deduction_80D_Files_URL: string[];
  Status: 'AA' | 'IA';
  Created_By: string;
  Created_at: string;
  Modified_By: string;
  Modified_at: string;
}

export type InRespectOf = 'Parents' | 'Self/ Family';
export type AgeGroup = 'Above 60 yrs' | 'Below 60 yrs';
export type KindOfPayment = 'Mediclaim premium' | 'Preventive Health Checkup';
export type TypeOfPolicy = 'Yearly' | 'Multi year';

export interface Deduction80DFormData {
  In_respect_of: InRespectOf | '';
  Age_Group: AgeGroup | '';
  Kind_of_payment: KindOfPayment | '';
  type_of_policy: TypeOfPolicy | '';
  Name_of_Insurance_company: string;
  Policy_number: string;
  Premium_Amount: string;
  Amount: string;
  Deduction_Note: string;
  Deduction_80D_Files: File[];
}

export const IN_RESPECT_OF_OPTIONS: InRespectOf[] = ['Parents', 'Self/ Family'];
export const AGE_GROUP_OPTIONS: AgeGroup[] = ['Above 60 yrs', 'Below 60 yrs'];
export const KIND_OF_PAYMENT_OPTIONS: KindOfPayment[] = ['Mediclaim premium', 'Preventive Health Checkup'];
export const TYPE_OF_POLICY_OPTIONS: TypeOfPolicy[] = ['Yearly', 'Multi year'];
