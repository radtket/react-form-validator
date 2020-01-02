import { useEffect, useState, useCallback } from "react";
import useFormInput from "./useFormInput";
import useFormCheckboxGroup from "./useFormCheckboxGroup";
import { isArrayEmpty } from "../helpers";

const useForm = (defaultValues, invalidAttr = { error: true }) => {
  const [values, setValues] = useState(defaultValues);
  const [mounted, setMounted] = useState(false);
  const [formErrors, setFormErrors] = useState([]);

  const handleError = useCallback(
    (name, isValid) => {
      const errors = formErrors;
      const index = errors.findIndex(error => error === name);

      if (!isValid) {
        if (index < 0) errors.push(name);
      } else if (index > -1) errors.splice(index, 1);

      setFormErrors(errors);
    },
    [formErrors]
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const useInput = (name, validation) => {
    return useFormInput({
      name,
      validation,
      values,
      setValues,
      defaultInvalidAttr: invalidAttr,
      handleError,
    });
  };

  const useCheckboxGroup = (name, value) =>
    useFormCheckboxGroup({ name, values, setValues, value });

  return {
    values,
    setValues,
    useInput,
    useCheckboxGroup,
    errors: formErrors,
    isValid: mounted && isArrayEmpty(formErrors),
    helperText: (name, helperText) => {
      if (formErrors.includes(name)) {
        return {
          helperText,
        };
      }

      return {};
    },
  };
};

export default useForm;
