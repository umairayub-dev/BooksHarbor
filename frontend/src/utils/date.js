export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = date.toLocaleString("en-US", { day: "2-digit" });
  const month = date.toLocaleString("en-US", { month: "2-digit" });
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};
