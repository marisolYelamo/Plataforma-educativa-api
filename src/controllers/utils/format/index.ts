export const formattedNowDate = () => {
  const today = new Date();
  return today.toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "numeric",
    minute: "numeric",
    timeZone: "America/Argentina/Buenos_Aires"
  });
};
