import * as yup from "yup";

export const deduction80DFormSchema = yup.object({
  In_respect_of: yup.string().required("Field is required").notOneOf([""], "Field is required"),
  Age_Group: yup.string().required("Field is required").notOneOf([""], "Field is required"),
  Kind_of_payment: yup.string().required("Field is required").notOneOf([""], "Field is required"),
  type_of_policy: yup.string().required("Field is required").notOneOf([""], "Field is required"),
  Name_of_Insurance_company: yup.string().when("Kind_of_payment", {
    is: (val: string) => val === "Mediclaim premium",
    then: (s) => s.required("Field is required"),
    otherwise: (s) => s.notRequired(),
  }),
  Policy_number: yup.string().when("Kind_of_payment", {
    is: (val: string) => val === "Mediclaim premium",
    then: (s) => s.required("Field is required"),
    otherwise: (s) => s.notRequired(),
  }),
  Premium_Amount: yup.string().when("Kind_of_payment", {
    is: (val: string) => val === "Mediclaim premium",
    then: (s) => s.required("Field is required").test("positive", "Must be a positive number", (v) => !!v && !isNaN(Number(v)) && Number(v) > 0),
    otherwise: (s) => s.notRequired(),
  }),
  Amount: yup.string().when("Kind_of_payment", {
    is: (val: string) => val !== "" && val !== "Mediclaim premium",
    then: (s) => s.required("Field is required").test("positive", "Must be a positive number", (v) => !!v && !isNaN(Number(v)) && Number(v) > 0),
    otherwise: (s) => s.notRequired(),
  }),
  Deduction_Note: yup.string().max(250, "Maximum 250 characters").notRequired(),
  Deduction_80D_Files: yup.mixed().notRequired(),
});
