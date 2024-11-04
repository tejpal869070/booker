import React from "react";
import TableComponent from "../TableComponent";
import DateSelector from "./DateSelector";
import groundimg from "../../assets/photos/ground.webp"

export default function MatchingIncome() {
  const tableData = [
     
    {
      name: "Magic Mouse 2",
      color: "Black",
      category: "Accessories",
      price: "$99",
      action: "More",
    },
    {
      name: "Google Pixel Phone",
      color: "Gray",
      category: "Phone",
      price: "$799",
      action: "More",
    },
    {
      name: "Apple Watch 5",
      color: "Red",
      category: "Wearables",
      price: "$999",
      action: "More",
    },
  ];

  const tableHead = [
    "S.No.",
    "Product name",
    "Color",
    "Category",
    "Price",
    "Action",
  ];
  return (
    <div className="relative">
      <p className="font-bold text-xl mb-6   dark:text-white">Income Manager {">"}Matching Income</p>
      <DateSelector/>
      <TableComponent tableData={tableData} tableHead={tableHead} />
      <div
          className="absolute w-full h-full top-0 bg-black bg-cover bg-center flex inset-0 justify-center align-center items-center bg-no-repeat"
          style={{ backgroundImage: `url(${groundimg})` }}
        >
          <p
            className="text-6xl text-center font-bold  "
            style={{ textShadow: "3px 2px 19px white" }}
          >
            Coming Soon
          </p>
        </div>
    </div>
  );
}
