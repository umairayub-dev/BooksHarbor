import React from "react";
import { formatDate } from "../../utils/date";
import { MdDelete } from "react-icons/md";
import { decodeToken } from "react-jwt";
const UsersTable = ({ users, handleDelete, token }) => {
  const decodeUser = () => {
    const user = decodeToken(token);
    return user?.id;
  };
  return (
    <div className="table-responsive">
      <table className="table table-dark table-striped">
        <thead>
          <tr>
            <th>Id</th>
            <th>Username</th>
            <th>Email</th>
            <th>Joined</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users
            .filter((user) => user._id !== decodeUser())
            .map((user) => (
              <tr key={user._id}>
                <td>{user._id}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{formatDate(user.joined)}</td>
                <td
                  className="cursor-pointer"
                  onClick={() => handleDelete(user._id)}
                >
                  <MdDelete />
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;
