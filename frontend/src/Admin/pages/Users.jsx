import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Spinner } from "react-bootstrap";
import UsersTable from "../components/UsersTable";
import { AuthContext } from "../../Context/Auth/AuthContext";
import useToast from "../../Hooks/useToast";

const UsersPage = () => {
  const { state } = useContext(AuthContext);
  const showToast = useToast();
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const BASE_URL = "https://victorious-lion-clothes.cyclic.cloud/api/users";
  const headers = {
    headers: {
      Authorization: `Bearer ${state?.token}`,
    },
  };
  const getUsers = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(BASE_URL, headers);
      if (response.status === 200) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const handleDelete = async (id) => {
    setIsLoading(true);
    try {
      await axios
        .delete(
          `https://victorious-lion-clothes.cyclic.cloud/api/user/${id}`,
          headers
        )
        .then((response) => {
          showToast("success", "User deleted successfully", 100, 1800);
          setUsers(response.data.users);
          setIsLoading(false);
        })
        .catch((error) => {
          showToast("error", "Unable to delete user", 100, 1800);
          setIsLoading(false);
          console.log(error);
        });
    } catch (error) {
      showToast("error", "Unable to delete user", 100, 1800);
      setIsLoading(false);
    }
  };
  return (
    <div
      className="min-vh-100 h-100 bg-main text-white"
      bg="dark"
      data-bs-theme="dark"
    >
      <div className="border-start border-dark bg-primary p-3 d-flex text-white justify-content-between align-items-center">
        <span className="fs-4 fw-bold">Users</span>
      </div>

      <div className="mt-3 d-flex flex-column justify-content-center align-items-center">
        {isLoading ? (
          <Spinner animation="border" className="color-green" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <div className="container">
            <UsersTable
              users={users}
              handleDelete={handleDelete}
              token={state?.token}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
