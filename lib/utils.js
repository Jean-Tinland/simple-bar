export const parseJson = (json) => {
  try {
    return JSON.parse(json.replace('\\', ''));
  } catch (error) {
    console.log(error);
    return;
  }
};
