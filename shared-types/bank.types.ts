export interface BankRecord {
  Bank_ID: string;
  Bank_Name: string;
  Account_Number: string;
  IFSC_Code: string;
  Account_Type: AccountType;
  Primary_Account: 'Primary' | 'Secondary';
  Status: 'AA' | 'IA';
  Member_ID: string;
  Financial_Year_Master_ID: string;
  Created_By: string;
  Created_at: string;
  Modified_By: string;
  Modified_at: string;
}

export type AccountType =
  | 'Savings Account'
  | 'Current Account'
  | 'Joint Account'
  | 'Salary Account'
  | 'Cash Credit Account'
  | 'Over Draft Account'
  | 'Non Resident Account'
  | 'Capital Gain Account Scheme'
  | 'Others';

export interface BankFormData {
  Bank_Name: string;
  Account_Number: string;
  IFSC_Code: string;
  Account_Type: AccountType;
  Primary_Account: boolean;
}

export const ACCOUNT_TYPE_OPTIONS: AccountType[] = [
  'Savings Account',
  'Current Account',
  'Joint Account',
  'Salary Account',
  'Cash Credit Account',
  'Over Draft Account',
  'Non Resident Account',
  'Capital Gain Account Scheme',
  'Others',
];
