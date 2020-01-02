import { useEffect, useState, useCallback } from "react";
import dot from "dot-object";
import validate from "./validate";

const useFormInput = ({
  name,
  validation = "",
  values: formData,
  setValues: setFormData,
  defaultInvalidAttr,
  handleError,
}) => {
  const formValue = dot.pick(name, formData) || "";

  const [value, setValue] = useState(formValue);
  const [isValid, setIsValid] = useState(true);
  const [isTouched, setIsTouched] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const [validationRules] = useState(validation);

  const handleValidation = useCallback(() => {
    const checkIsValid = validate(value, validationRules);
    setIsValid(checkIsValid);
    handleError(name, checkIsValid);
  }, [setIsValid, validationRules, name, value, handleError]);

  // watch for external parent data changes
  useEffect(() => {
    if (value !== formValue) {
      setValue(formValue);
      setIsTouched(false);
      setIsFocused(false);
    }
  }, [formValue, value, setValue, setIsFocused, setIsTouched]);

  // validate on value change
  useEffect(() => {
    handleValidation();
  }, [handleValidation, name]);

  // rewrite self and parent's value
  const handleChange = useCallback(
    ({ target }) => {
      const { checked, type } = target;
      const newValue = type === "checkbox" ? checked : target.value;

      // using dot helps us change nested values
      let data;
      const isNested = name.includes(".");
      if (isNested) {
        dot.override = true;
        data = dot.str(name, newValue, { ...formData });
      } else data = { ...formData, [name]: newValue };

      setValue(newValue);
      setFormData(data);
    },
    [setValue, formData, setFormData, name]
  );

  const handleFocus = useCallback(() => {
    setIsTouched(true);
    setIsFocused(true);
    handleValidation();
  }, [setIsTouched, setIsFocused, handleValidation]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
  }, [setIsFocused]);

  const showError = !isValid && isTouched && !isFocused;
  const invalidAttr = showError ? defaultInvalidAttr : null;

  return {
    value,
    name,
    onChange: handleChange,
    onFocus: handleFocus,
    onBlur: handleBlur,
    ...invalidAttr,
  };
};

export default useFormInput;
