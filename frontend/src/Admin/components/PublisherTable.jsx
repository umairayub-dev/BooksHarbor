import React, { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

const PublisherTable = ({ publishers, handleEditPublisher, handleDelete }) => {
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

  const sortedCategories = [...publishers].sort((a, b) => {
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
                sortedColumn === "name" ? "sorted" : ""
              }`}
              onClick={() => sortTable("name")}
            >
              Publisher Name
              {sortedColumn === "name" && (
                <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
              )}
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedCategories.map((publisher) => (
            <tr key={publisher._id}>
              <td>{publisher._id}</td>
              <td>{publisher.name}</td>
              <td>
                <button
                  className="btn cursor-pointer text-white"
                  onClick={() => handleEditPublisher(publisher)}
                >
                  <MdEdit />
                </button>
                <button
                  className="btn cursor-pointer text-white"
                  onClick={() => handleDelete(publisher._id)}
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

export default PublisherTable;
