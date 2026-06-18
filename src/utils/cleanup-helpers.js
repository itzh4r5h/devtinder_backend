export const getOnlyErrorMessage = (error) => {
  if (error) {
    let errorMessage = error.details[0].message;

    // it will replace the double quotes from error like '"name" is required' - result -> 'name is required'
    errorMessage = errorMessage.replaceAll('"', "");

    return errorMessage;
  }
  return error;
};
