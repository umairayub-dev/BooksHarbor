import React, { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

const CategoryTable = ({ categories, handleEditCategory, handleDelete }) => {
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

  const sortedCategories = [...categories].sort((a, b) => {
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
                sortedColumn === "Id" ? "sorted" : ""
              }`}
              onClick={() => sortTable("Id")}
            >
              Id
              {sortedColumn === "Id" && (
                <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
              )}
            </th>
            <th
              className={`cursor-pointer ${
                sortedColumn === "CategoryName" ? "sorted" : ""
              }`}
              onClick={() => sortTable("CategoryName")}
            >
              Category Name
              {sortedColumn === "CategoryName" && (
                <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
              )}
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedCategories.map((category) => (
            <tr key={category._id}>
              <td>{category._id}</td>
              <td>{category.CategoryName}</td>
              <td>
                <button
                  className="btn cursor-pointer text-white"
                  onClick={() => handleEditCategory(category)}
                >
                  <MdEdit />
                </button>
                <button
                  className="btn cursor-pointer text-white"
                  onClick={() => handleDelete(category._id)}
                >
                  <MdDelete />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoryTable;
