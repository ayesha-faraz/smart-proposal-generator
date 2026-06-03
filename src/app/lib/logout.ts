export const clearPropelSession = () => {
  localStorage.removeItem("propel_user");
  sessionStorage.removeItem("propel_user");
};
