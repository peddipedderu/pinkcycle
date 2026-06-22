import * as Yup from "yup";

const regValidationSchema = Yup.object({
  fullName: Yup.string()
    .required("Required"),
  usernameOrEmail: Yup.string()
    .min(3, "Must be at least 3 characters")
    .required("Required"),
  password: Yup.string()
    .min(6, "Must be at least 6 characters")
    .required("Required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Required'),
});

export default regValidationSchema;
