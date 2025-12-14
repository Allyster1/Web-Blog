import { useState } from "react";

export default function useControlledFormHook(initialValues, onSubmit) {
   const [values, setValues] = useState(initialValues);

   //  TODO: Handler checkbox change
   const changeHandler = (e) => {
      setValues((state) => ({
         ...state,
         [e.target.name]: e.target.value,
      }));
   };

   const submitHandler = async (e) => {
      e.preventDefault();

      await onSubmit(values);

      setValues(initialValues);
   };

   return {
      values,
      changeHandler,
      submitHandler,
   };
}
