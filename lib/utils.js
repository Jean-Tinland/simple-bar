export const parseJson = (json) => {
  try {
    return JSON.parse(json);
  } catch (error) {
    console.log(error);
    return;
  }
};
