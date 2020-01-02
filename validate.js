import validator from "validator";

const validate = (value, validation) => {
  const fields = [];
  let isValid = true;
  let trimmedValidation;
  let validatingFields;

  switch (typeof validation) {
    case "object":
      Object.keys(validation).forEach(property => {
        fields.push({
          rule: property,
          options: validation[property],
        });
      });
      break;

    case "string":
    default:
      if (!validation.length) {
        return true;
      }
      trimmedValidation = validation.replace(/ /g, "");
      validatingFields = trimmedValidation.split(",");
      validatingFields.forEach(fieldName => {
        fields.push({
          rule: fieldName,
        });
      });
  }

  fields.forEach(({ rule, options = null }) => {
    switch (rule.trim()) {
      case "isRequired":
        if (!value) {
          isValid = false;
        }
        break;
      default:
        if (isValid) {
          if (options !== null) {
            let result;

            switch (options) {
              case true:
                result = validator[rule](value);
                break;
              case false:
                result = !validator[rule](value);
                break;
              default:
                result = validator[rule](value, options);
            }

            isValid = result;
          } else {
            isValid = validator[rule](value);
          }
          break;
        }
    }
  });

  return isValid;
};

export default validate;
