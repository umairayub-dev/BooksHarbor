import React, { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";

const ReviewTable = ({ reviews, handleDelete }) => {
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

  const sortedReviews = [...reviews].sort((a, b) => {
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
                sortedColumn === "username" ? "sorted" : ""
              }`}
              onClick={() => sortTable("username")}
            >
              Username
              {sortedColumn === "username" && (
                <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
              )}
            </th>
            <th
              className={`cursor-pointer ${
                sortedColumn === "rating" ? "sorted" : ""
              }`}
              onClick={() => sortTable("rating")}
            >
              Rating
              {sortedColumn === "rating" && (
                <span>{sortOrder === "asc" ? "↑" : "↓"}</span>
              )}
            </th>
            <th>Comment</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedReviews.map((review) => (
            <tr key={review._id}>
              <td>{review.username}</td>
              <td>{review.rating}</td>
              <td>{review.comment}</td>
              <td>
                <button
                  className="btn cursor-pointer text-white"
                  onClick={() => handleDelete(review._id)}
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

export default ReviewTable;
