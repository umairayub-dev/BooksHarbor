import React, { useState } from "react";
import { formatDate } from "../../utils/date";
import { MdDelete, MdEdit } from "react-icons/md";

const ProductsTable = ({ books, handleEditBook, handleDelete }) => {
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

  const sortedBooks = [...books].sort((a, b) => {
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
              className={`cursor-pointer ${sortedColumn === "title" ? "sorted" : ""}`}
              onClick={() => sortTable("title")}
            >
              Title {sortedColumn === "title" && <span>{sortOrder === "asc" ? "↑" : "↓"}</span>}
            </th>
            <th
              className={`cursor-pointer ${sortedColumn === "price" ? "sorted" : ""}`}
              onClick={() => sortTable("price")}
            >
              Price {sortedColumn === "price" && <span>{sortOrder === "asc" ? "↑" : "↓"}</span>}
            </th>
            <th
              className={`cursor-pointer ${sortedColumn === "author" ? "sorted" : ""}`}
              onClick={() => sortTable("author")}
            >
              Author {sortedColumn === "author" && <span>{sortOrder === "asc" ? "↑" : "↓"}</span>}
            </th>
            <th
              className={`cursor-pointer ${sortedColumn === "category" ? "sorted" : ""}`}
              onClick={() => sortTable("category")}
            >
              Category {sortedColumn === "category" && <span>{sortOrder === "asc" ? "↑" : "↓"}</span>}
            </th>
            <th
              className={`cursor-pointer ${sortedColumn === "publisher" ? "sorted" : ""}`}
              onClick={() => sortTable("publisher")}
            >
              Publisher {sortedColumn === "publisher" && <span>{sortOrder === "asc" ? "↑" : "↓"}</span>}
            </th>
            <th
              className={`cursor-pointer ${sortedColumn === "publish_date" ? "sorted" : ""}`}
              onClick={() => sortTable("publish_date")}
            >
              Publish Date {sortedColumn === "publish_date" && <span>{sortOrder === "asc" ? "↑" : "↓"}</span>}
            </th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {sortedBooks.map((book) => (
            <tr key={book._id}>
              <td>{book.title}</td>
              <td>{book.price}</td>
              <td>{book.author}</td>
              <td>{book.category}</td>
              <td>{book.publisher}</td>
              <td>{formatDate(book.publish_date)}</td>
              <td>
                <button className="btn cursor-pointer text-white" onClick={() => handleEditBook(book)}>
                  <MdEdit />
                </button>
                <button className="btn cursor-pointer text-white" onClick={() => handleDelete(book._id)}>
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

export default ProductsTable;
