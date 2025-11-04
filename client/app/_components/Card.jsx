// import React from "react";

// import { UserIcon } from "lucide-react";

// const Card = ({ title, value, icon: Icon }) => {
//   return (
//     <div className="bg-white rounded-2xl shadow-md p-6 flex justify-between items-center w-full md:w-[320px] h-[150px]">
//       <div className="flex flex-col justify-between h-full">
//         <div className="text-2xl font-semibold text-gray-600">{title}</div>
//         <div className="text-4xl font-bold text-gray-800 ">{value}</div>
//       </div>
//       <div className="bg-gray-100 rounded-xl p-3">
//         {Icon && <Icon className="w-10 h-10 text-gray-400" />}
//       </div>
//     </div>
//   );
// };

// export default Card;

import React from "react";

const Card = ({ title, value, icon: Icon, color = "" }) => {
  return (
    <div className="rounded-[10px] bg-white p-6 shadow-md border border-gray-200 dark:bg-gray-dark dark:border-gray-700 w-full h-[150px] flex items-center justify-between">
      <div>
        <dt className="mb-1.5 text-4xl font-bold text-dark dark:text-white">
          {value}
        </dt>
        <dd className="text-sm font-medium text-dark-6 dark:text-gray-400">
          {title}
        </dd>
      </div>

      {Icon && (
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-xl">
          <Icon
            className={`w-10 h-10 text-gray-400 dark:text-gray-300 ${color}`}
          />
        </div>
      )}
    </div>
  );
};

export default Card;
