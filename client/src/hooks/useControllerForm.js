import { useState } from "react";

export default function useControlledFormHook(initialValues, onSubmit) {
  const [values, setValues] = useState(initialValues);

  const changeHandler = (e) => {
    setValues((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await onSubmit(values);
      setValues(initialValues);
    } catch (error) {
      throw error;
    }
  };

  return {
    values,
    changeHandler,
    submitHandler,
  };
}
