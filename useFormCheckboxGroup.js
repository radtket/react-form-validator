import { useEffect, useState, useCallback } from "react";
import dot from "dot-object";

const useFormCheckboxGroup = ({
  name,
  value,
  values: formData,
  setValues: setFormData,
}) => {
  const formValue = dot.pick(name, formData) || [];
  const hasValue = formValue.indexOf(value) > -1;

  const [checked, setChecked] = useState(hasValue);

  // watch for external parent data changes
  useEffect(() => {
    const isChecked = formValue.indexOf(value) > -1;
    setChecked(isChecked);
  }, [formValue, value]);

  // rewrite self and parent's value
  const handleChange = useCallback(
    ({ target }) => {
      const oldValue = dot.pick(name, formData) || [];
      const { checked } = target;
      let newValue;

      const index = oldValue.indexOf(value);
      if (checked && index < 0) {
        newValue = [...oldValue, value];
      } else if (!checked && index > -1) {
        newValue = oldValue.filter(v => v !== value);
      }

      // using dot helps us change nested values
      let data;
      const isNested = name.includes(".");
      if (isNested) {
        dot.override = true;
        data = dot.str(name, newValue, { ...formData });
      } else {
        data = { ...formData, [name]: newValue };
      }

      setChecked(checked);
      setFormData(data);
    },
    [value, formData, setFormData, name]
  );

  return {
    name,
    checked,
    onChange: handleChange,
  };
};

export default useFormCheckboxGroup;
