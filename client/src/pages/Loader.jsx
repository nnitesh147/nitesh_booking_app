import React from "react";

const Loader = () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
  return (
    <div className="mt-8 gap-x-6 gap-y-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {arr.map((index) => (
        <div
          key={index}
          className="bg-slate-200 mb-2 rounded-2xl flex w-72 h-52"
        ></div>
      ))}
    </div>
  );
};

export default Loader;
