const getFirstErrorMessage = (errors) => {
  for (const value of Object.values(errors)) {
    if (value?.message) {
      return value.message;
    }

    if (typeof value === "object" && value !== null) {
      const message = getFirstErrorMessage(value);

      if (message) return message;
    }
  }

  return undefined;
};

export const getOnlyErrorMessage = (error) => {
  if (error) {
    let errorMessage = getFirstErrorMessage(error.details)

    // it will replace the double quotes from error like '"name" is required' - result -> 'name is required'
    errorMessage = errorMessage.replaceAll('"', "");

    return errorMessage;
  }
  return error;
};
