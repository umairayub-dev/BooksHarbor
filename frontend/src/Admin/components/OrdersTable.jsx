import React, { useState } from "react";
import { formatDate } from "../../utils/date";
import { MdEdit } from "react-icons/md";

const OrdersTable = ({ orders, handleEditOrderStatus }) => {
  const [sortedColumn, setSortedColumn] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc");

  const sortTable = (column) => {
    if (sortedColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortedColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const columnA = sortedColumn ? a[sortedColumn] : null;
    const columnB = sortedColumn ? b[sortedColumn] : null;

    if (columnA === null || columnB === null) {
      return 0;
    }

    if (columnA < columnB) {
      return sortOrder === "asc" ? -1 : 1;
    } else if (columnA > columnB) {
      return sortOrder === "asc" ? 1 : -1;
    }

    return 0;
  });

  return (
    <div className="table-responsive">
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th
              className={`cursor-pointer ${
                sortedColumn === "user.customerName" ? "sorted" : ""
              }`}
              onClick={() => sortTable("user.customerName")}
            >
              Customer Name{" "}
              {sortedColumn === "user.customerName" && (
                <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
              )}
            </th>
            <th
              className={`cursor-pointer ${
                sortedColumn === "products" ? "sorted" : ""
              }`}
              onClick={() => sortTable("products")}
            >
              Products
              {sortedColumn === "products" && (
                <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
              )}
            </th>
            <th
              className={`cursor-pointer ${
                sortedColumn === "totalAmount" ? "sorted" : ""
              }`}
              onClick={() => sortTable("totalAmount")}
            >
              Total Amount{" "}
              {sortedColumn === "totalAmount" && (
                <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
              )}
            </th>
            <th
              className={`cursor-pointer ${
                sortedColumn === "status" ? "sorted" : ""
              }`}
              onClick={() => sortTable("status")}
            >
              Status{" "}
              {sortedColumn === "status" && (
                <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
              )}
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedOrders.map((order) => (
            <tr key={order._id}>
              <td>{order.user.customerName}</td>
              <td>{order.products.length}</td>
              <td>{order.totalAmount}</td>
              <td>{order.status}</td>
              <td>
                <button
                  className="btn cursor-pointer text-white"
                  onClick={() => handleEditOrderStatus(order)}
                >
                  <MdEdit />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
