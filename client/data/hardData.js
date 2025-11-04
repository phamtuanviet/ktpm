export const slides = [
  {
    id: 0,
    image: "/images/tokyo.jpg",
    destination: "Tokyo",
    content: "Discover Tokyo, a modern city blending tradition and technology.",
  },
  {
    id: 1,
    image: "/images/paris.jpg",
    destination: "Paris",
    content: "Paris – The city of love, art, and historic architecture.",
  },
  {
    id: 2,
    image: "/images/newyork.jpg",
    destination: "NewYork",
    content: "New York – The city that never sleeps, full of vibrant culture.",
  },
  {
    id: 3,
    image: "/images/beijing.jpg",
    destination: "Beijing",
    content: "Beijing – A city with a rich history and unique Chinese culture.",
  },
  {
    id: 4,
    image: "/images/shanghai.jpg",
    destination: "ShangHai",
    content: "Shanghai – A dynamic city where East meets West.",
  },
  {
    id: 5,
    image: "/images/dubai.jpg",
    destination: "DuBai",
    content:
      "Dubai – A luxurious paradise in the desert with world-class architecture.",
  },
];

export const confidentTravels = [
  {
    id: 1,
    top: "Travel requierments for flight",
    color: "bg-blue-400",
    content:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eosratione ducimus eveniet beatae.",
  },
  {
    id: 2,
    top: "Multi-risk travel insurance",
    color: "bg-orange-400",
    content:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eosratione ducimus eveniet beatae.",
  },
  {
    id: 3,
    top: "Travel requierments by destination",
    color: "bg-yellow-400",
    content:
      "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Eosratione ducimus eveniet beatae.",
  },
];

export const menuItems = [
  {
    title: "Menu",
    items: [{}],
  },
  {
    title: "Other",
    items: [],
  },
];

export const columnUsers = [
  {
    header: "User ID",
    accessor: "id",
  },
  {
    header: "Name",
    accessor: "name",
    className: "hidden md:table-cell",
  },
  {
    header: "Email",
    accessor: "email",
    className: "hidden lg:table-cell",
  },
  {
    header: "AccountVerified",
    accessor: "AccountVerified",
    className: "hidden lg:table-cell",
  },
  {
    header: "Role",
    accessor: "role",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

export const columnAircrafts = [
  {
    header: "Aircraft ID",
    accessor: "id",
  },
  {
    header: "Name",
    accessor: "name",
  },
  {
    header: "Manufacturer",
    accessor: "manufacturer",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

export const columnNews = [
  {
    header: "Thumbnail",
    accessor: "thumbnail",
    className: "table-cell lg:hidden",
  },
  {
    header: "News ID",
    accessor: "id",
  },
  {
    header: "Title",
    accessor: "title",
  },
  {
    header: "Created At",
    accessor: "createdAt",
    className: "hidden lg:table-cell",
  },
  {
    header: "Updated At",
    accessor: "updatedAt",
    className: "hidden lg:table-cell",
  },
  {
    header: "Public",
    accessor: "isPublished",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

export const columnFlights = [
  {
    header: "Flight ID",
    accessor: "id",
  },
  {
    header: "Flight Number",
    accessor: "flightNumber",
  },
  {
    header: "Departure Airport",
    accessor: "departureAirport",
  },
  {
    header: "Arrival Airport",
    accessor: "arrivalAirport",
  },
  {
    header: "Departure Time",
    accessor: "departureTime",
  },
  {
    header: "Arrival Time",
    accessor: "arrivalTime",
  },
  {
    header: "Status",
    accessor: "status",
    className: "hidden lg:table-cell",
  },
  {
    header: "Total Seats",
    accessor: "totalSeats",
    className: "hidden lg:table-cell",
  },
  {
    header: "Booked Seats",
    accessor: "bookedSeats",
    className: "hidden lg:table-cell",
  },
  {
    header: "Actions",
    accessor: "actions",
  },
];

export const columnTickets = [
  {
    header: "Ticket ID",
    accessor: "id",
    className: "hidden lg:table-cell",
  },
  {
    header: "Flight Number",
    accessor: "flightNumber",
    className: "hidden lg:table-cell",
  },
  {
    header: "Passenger Name",
    accessor: "passengerName",
    className: "hidden lg:table-cell",
  },
  {
    header: "Departure Airport",
    accessor: "departureAirport",
  },
  {
    header: "Arrival Airport",
    accessor: "arrivalAirport",
  },
  {
    header: "Departure Time",
    accessor: "departureTime",
  },
  {
    header: "Seat Number",
    accessor: "seatNumber",
    className: "hidden lg:table-cell",
  },
  {
    header: "Passenger Type",
    accessor: "passengerType",
    className: "hidden lg:table-cell",
  },
  {
    header: "Seat Class",
    accessor: "seatClass",
    className: "hidden lg:table-cell",
  },
  {
    header: "Booking Reference",
    accessor: "bookingReference",
    className: "table-cell sm:hidden",
  },
  {
    header: "Cancel",
    accessor: "isCancelled",
  },
  {
    header: "Actions",
    accessor: "action",
  },
];

export const updateUsersFormFields = [
  {
    label: "User ID",
    name: "id",
    type: "text",
    editable: false,
    required: true,
  },
  {
    label: "Name",
    name: "name",
    type: "text",
    editable: false,
    required: true,
    placeholder: "Enter full name",
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    editable: false,
    required: true,
  },
  {
    label: "Role",
    name: "role",
    type: "select",
    editable: true,
    required: true,
    options: [
      { label: "Admin", value: "ADMIN" },
      { label: "User", value: "USER" },
    ],
  },
  {
    label: "Account Verified",
    name: "isAccountVerified",
    type: "select",
    editable: true,
    required: true,
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
];

export const updateNewsFormFields = [
  {
    label: "News ID",
    name: "id",
    type: "text",
    editable: false,
    required: true,
  },
  {
    label: "Title",
    name: "title",
    type: "text",
    editable: true,
    required: true,
    placeholder: "Enter title",
  },
  {
    label: "Public",
    name: "isPublished",
    type: "select",
    editable: true,
    required: true,
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
  {
    label: "Thumbnail",
    name: "thumbnail",
    type: "file",
    editable: true,
    required: false,
  },
  {
    label: "Created At",
    name: "createdAt",
    type: "datetime-local",
    editable: true,
    required: false,
  },
  {
    labe: "Content",
    name: "content",
    type: "textarea",
    editable: true,
    required: true,
    rows: 10,
  },
];

export const updateAircraftsFormFields = [
  {
    label: "Aircraft ID",
    name: "id",
    type: "text",
    editable: false,
    required: true,
  },
  {
    label: "Name",
    name: "name",
    type: "text",
    editable: true,
    required: true,
    placeholder: "Enter full name",
  },
  {
    label: "Manufacturer",
    name: "manufacturer",
    type: "text",
    editable: true,
    required: true,
  },
];

export const updateFlightsFormFields = [
  {
    name: "id",
    label: "Flight Id",
    type: "text",
    required: true,
    editable: false,
  },
  {
    name: "flightNumber",
    label: "Flight Number",
    type: "text",
    required: true,
    editable: false,
  },
  {
    name: "departureAirport",
    label: "Departure Airport",
    type: "airport",
    required: true,
    editable: false,
  },
  {
    name: "arrivalAirport",
    label: "Arrival Airport",
    type: "airport",
    required: true,
    editable: false,
  },
  {
    name: "departureTime",
    label: "Departure Time",
    type: "datetime-local",
    required: true,
    editable: true,
  },
  {
    name: "arrivalTime",
    label: "Arrival Time",
    type: "datetime-local",
    required: true,
    editable: true,
  },
  {
    name: "aircraft",
    label: "Aircraft",
    type: "aircraft",
    required: true,
    editable: false,
  },
  {
    name: "seats",
    label: "Seats",
    type: "seats",
  },
];

export const createAircraftsFormFields = [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
    placeholder: "Enter name of aircraft",
  },
  {
    label: "Manufacturer",
    name: "manufacturer",
    type: "text",
    required: true,
    placeholder: "Enter manufacturer",
  },
];

export const createNewsFormFields = [
  {
    label: "Title",
    name: "title",
    type: "text",
    editable: true,
    required: true,
    placeholder: "Enter title",
  },
  {
    label: "Public",
    name: "isPublished",
    type: "select",
    editable: true,
    required: true,
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
  {
    label: "Thumbnail",
    name: "thumbnail",
    type: "file",
    editable: true,
    required: false,
  },
  {
    label: "Created At",
    name: "createdAt",
    type: "datetime-local",
    editable: true,
    required: false,
  },
  {
    labe: "Content",
    name: "content",
    type: "textarea",
    editable: true,
    required: true,
    rows: 10,
  },
];

export const createFlightsFormFields = [
  {
    name: "flightNumber",
    label: "Flight Number",
    type: "text",
    required: false,
    editable: true,
    placeholder: "Fill or not (Auto generated)",
  },
  {
    name: "departureAirport",
    label: "Departure Airport",
    type: "airport",
    required: true,
    editable: true,
  },
  {
    name: "arrivalAirport",
    label: "Arrival Airport",
    type: "airport",
    required: true,
    editable: true,
  },
  {
    name: "departureTime",
    label: "Departure Time",
    type: "datetime-local",
    default: new Date(),
    required: true,
    editable: true,
  },
  {
    name: "arrivalTime",
    label: "Arrival Time",
    type: "datetime-local",
    default: new Date(Date.now() + 60 * 1000),
    required: true,
    editable: true,
  },
  {
    name: "aircraft",
    label: "Aircraft",
    type: "aircraft",
    required: true,
    editable: true,
  },
  {
    name: "seats",
    label: "Seats",
    type: "seats",
    required: "true",
    editable: true,
  },
];

export const createTicketsFormFields = [
  {
    name: "flightNumber",
    label: "Flight Number",
    type: "flightNumber",
    required: true,
    editable: true,
  },
  {
    name: "seatClass",
    label: "Seat Class",
    type: "select",
    required: true,
    editable: true,
    defaultValue: "ECONOMY",
    options: [
      { label: "ECONOMY", value: "ECONOMY" },
      { label: "BUSINESS", value: "BUSINESS" },
      { label: "FIRST CLASS", value: "FIRST_CLASS" },
    ],
  },
  {
    name: "passengerType",
    label: "Passenger Type",
    type: "select",
    required: true,
    editable: true,
    defaultValue: "ADULT",
    options: [
      { label: "Adult", value: "ADULT" },
      { label: "Child", value: "CHILD" },
      { label: "Infant", value: "INFANT" },
    ],
  },
  {
    name: "passengerName",
    label: "Passenger Name",
    type: "text",
    required: true,
    editable: true,
  },
  {
    name: "passengerEmail",
    label: "Passenger Email",
    type: "email",
    required: true,
    editable: true,
  },
];

export const filterAircraftsFormFields = [
  {
    label: "Aircraft ID",
    name: "id",
    type: "text",
  },
  {
    label: "Name",
    name: "name",
    type: "text",
    placeholder: "Enter full name",
  },
  {
    label: "Manufacturer",
    name: "manufacturer",
    type: "text",
  },
];

export const filterUsersFormFields = [
  {
    label: "User ID",
    name: "id",
    type: "text",
  },
  {
    label: "Name",
    name: "name",
    type: "text",
    placeholder: "Enter full name",
  },
  {
    label: "Email",
    name: "email",
    type: "email",
  },
  {
    label: "Role",
    name: "role",
    type: "select",
    defaultValue: "ADMIN",
    options: [
      { label: "Admin", value: "ADMIN" },
      { label: "User", value: "USER" },
    ],
  },
  {
    label: "Account Verified",
    name: "isAccountVerified",
    type: "select",
    defaultValue: true,
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
];

export const filterNewsFormFields = [
  {
    label: "News ID",
    name: "id",
    type: "text",
  },
  {
    label: "Title",
    name: "title",
    type: "text",
    placeholder: "Enter title",
  },
  {
    label: "Public",
    name: "isPublished",
    type: "select",
    defaultValue: true,
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
];

export const filterFlightFormFields = [
  {
    label: "Flight ID",
    name: "id",
    type: "text",
    placeholder: "Enter flight ID",
  },
  {
    label: "Flight Number",
    name: "flightNumber",
    type: "text",
    placeholder: "Enter flight Number",
  },
  {
    label: "Departure Airport",
    name: "departureAirport",
    type: "airport",
    placeholder: "Enter departure airport name",
  },
  {
    label: "Arrival Airport",
    name: "arrivalAirport",
    type: "airport",
    placeholder: "Enter arrival airport name",
  },
  {
    label: "Departure Time",
    name: "departureTime",
    type: "date",
  },
  {
    label: "Arrival Time",
    name: "arrivalTime",
    type: "date",
  },

  {
    label: "Status",
    name: "status",
    type: "select",
    defaultValue: "SCHEDULED",
    options: [
      { label: "SCHEDULED", value: "SCHEDULED" },
      { label: "DELAYED", value: "DELAYED" },
      { label: "DEPARTED", value: "DEPARTED" },
      { label: "ARRIVED", value: "ARRIVED" },
      { label: "CANCELLED", value: "CANCELLED" },
    ],
  },
  {
    label: "Aircarft",
    name: "aircraft",
    type: "aircraft",
    placeholder: "Enter aircraft name",
  },
];

export const filterTicketsFormFields = [
  {
    name: "flightNumber",
    label: "Flight Number",
    type: "flightNumber",
  },
  {
    name: "seatClass",
    label: "Seat Class",
    type: "select",

    defaultValue: "ECONOMY",
    options: [
      { label: "ECONOMY", value: "ECONOMY" },
      { label: "BUSINESS", value: "BUSINESS" },
      { label: "FIRST CLASS", value: "FIRST_CLASS" },
    ],
  },
  {
    name: "passengerType",
    label: "Passenger Type",
    type: "select",
    defaultValue: "ADULT",
    options: [
      { label: "Adult", value: "ADULT" },
      { label: "Child", value: "CHILD" },
      { label: "Infant", value: "INFANT" },
    ],
  },
  {
    name: "passengerName",
    label: "Passenger Name",
    type: "text",
  },
  {
    name: "passengerEmail",
    label: "Passenger Email",
    type: "email",
  },
  {
    name: "isCancelled",
    label: "Cancel",
    type: "select",
    defaultValue: true,
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
];

export const sortUserFormFields = [
  {
    label: "User ID",
    value: "id",
  },
  {
    label: "Name",
    value: "name",
  },
  {
    label: "Email",
    value: "email",
  },
  {
    label: "Role",
    value: "role",
  },
  {
    label: "Account Verified",
    value: "isAccountVerified",
  },
];

export const sortAircraftFormFields = [
  {
    label: "Aircraft ID",
    value: "id",
  },
  {
    label: "Name",
    value: "name",
  },
  {
    label: "Manufacturer",
    value: "manufacturer",
  },
];

export const sortFlightFormFields = [
  {
    label: "Flight ID",
    value: "id",
  },
  {
    label: "Flight Number",
    value: "flightNumber",
  },
  {
    label: "Departure Time",
    value: "departureTime",
  },
  {
    label: "Arrival Time",
    value: "arrivalTime",
  },
  {
    label: "Departure Airport",
    value: "departureAirport",
  },
  {
    label: "Arrival Airport",
    value: "arrivalAirport",
  },
  {
    label: "Status",
    value: "status",
  },
  {
    label: "Aircarft",
    value: "aircraft",
  },
];

export const sortNewsFormFields = [
  {
    label: "News ID",
    value: "id",
  },
  {
    label: "Title",
    value: "title",
  },
  {
    label: "Created At",
    value: "createdAt",
  },
  {
    label: "Updated At",
    value: "updatedAt",
  },
];

export const sortTicketFormFields = [
  {
    label: "User",
    value: "bookedBy",
  },
  {
    label: "Flight Number",
    value: "flight",
  },
  {
    label: "Flight Seat",
    value: "flightSeat",
  },
  {
    label: "ID",
    value: "id",
  },
  {
    label: "Passenger name",
    value: "passengerName",
  },
  {
    label: "Passenger email",
    value: "passengerEmail",
  },
  {
    label: "Seat Number",
    value: "seatNumber",
  },
  {
    label: "Booking Reference",
    value: "bookingReference",
  },
  {
    label: "Cancel",
    value: "isCancelled",
  },
];
