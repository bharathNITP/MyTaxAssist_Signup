import * as yup from 'yup';

export const bankFormSchema = yup.object({
  Bank_Name: yup.string().required('Bank is required'),
  Account_Number: yup
    .string()
    .required('Field is required')
    .matches(/^\d+$/, 'Account Number must be numeric only')
    .max(18, 'Account Number must be at most 18 digits'),
  IFSC_Code: yup
    .string()
    .required('Field is required')
    .matches(/^[A-Za-z0-9]+$/, 'IFSC Code must be alphanumeric'),
  Account_Type: yup.string().required('Field is required'),
  Primary_Account: yup.boolean().default(false),
});
