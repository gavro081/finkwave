export const handleError = (err: any) => {
  const errorMessage = err.response?.data?.error || "Failed to fetch user";
  return errorMessage;
};
