const formatDate = (date) => date.toISOString().split("T")[0];

export function toLocalDatetimeString(date) {
  const pad = (n) => n.toString().padStart(2, "0");
  const d = new Date(date);
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function toLocalDatetime(date) {
  const pad = (n) => n.toString().padStart(2, "0");
  const d = new Date(date);
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  return `${year}-${month}-${day}`;
}

export function getFlightDuration(departureTime, arrivalTime) {
  const departDate = new Date(departureTime);
  const arriveDate = new Date(arrivalTime);

  const diffMs = arriveDate - departDate;
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  if (minutes === 0) return `${hours}h`;

  return `${hours}h ${minutes}m`;
}

export const getDobMaxDate = (type) => {
  const today = new Date();

  switch (type) {
    case "adult":
      return formatDate(
        new Date(today.getFullYear() - 12, today.getMonth(), today.getDate())
      );
    case "child":
      return formatDate(
        new Date(today.getFullYear() - 2, today.getMonth(), today.getDate())
      );
    case "infant":
      return formatDate(today);
    default:
      return formatDate(today);
  }
};

export const getDobMinDate = (type) => {
  const today = new Date();

  switch (type) {
    case "child":
      return formatDate(
        new Date(today.getFullYear() - 12, today.getMonth(), today.getDate())
      );
    case "infant":
      return formatDate(
        new Date(today.getFullYear() - 2, today.getMonth(), today.getDate())
      );
    default:
      return "";
  }
};
