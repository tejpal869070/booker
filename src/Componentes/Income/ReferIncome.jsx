import React from "react";
import TableComponent from "../TableComponent";
import DateSelector from "./DateSelector";

export default function ReferIncome() {
  const tableData = [
    {
      name: 'Apple MacBook Pro 17"',
      color: "Silver",
      category: "Laptop",
      price: "$2999",
      action: "More",
    },
    {
      name: "Microsoft Surface Pro",
      color: "White",
      category: "Laptop PC",
      price: "$1999",
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
    <div className="min-h-screen">
      <p className="font-bold text-xl mb-6 dark:text-white">
        Income Manager {">"} Reffer Income
      </p>
      <DateSelector />
      <TableComponent tableData={tableData} tableHead={tableHead} />
    </div>
  );
}
