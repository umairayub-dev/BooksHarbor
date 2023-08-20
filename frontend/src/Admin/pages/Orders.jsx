import React, { useEffect, useState } from "react";
import axios from "axios";
import { Form, Spinner } from "react-bootstrap";
import MyPagination from "../../Componenets/Pagination/MyPagination";
import OrderTable from "../components/OrdersTable.jsx";
import { useContext } from "react";
import { AuthContext } from "../../Context/Auth/AuthContext";
import useToast from "../../Hooks/useToast";
import OrderModal from "../components/OrderModal";

const OrdersPage = () => {
  const { state } = useContext(AuthContext);
  const showToast = useToast();
  const [items, setItems] = useState({ totalItems: 0, orders: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const BASE_URL = "/api/v1/all-orders";

  const buildApiUrl = (page, limit) => {
    return `${BASE_URL}?page=${page || 1}&limit=${limit}`;
  };

  const rangeStart = (currentPage - 1) * limit + 1;
  const rangeEnd = Math.min(currentPage * limit, items.totalItems);

  const headers = {
    headers: {
      Authorization: `Bearer ${state?.token}`,
    },
  };

  const getOrders = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        buildApiUrl(currentPage, limit),
        headers
      );
      if (response.status === 200) {
        setItems({
          totalItems: response.data.total,
          orders: response.data.orders,
        });
      }
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedOrder(null);
    setShowModal(false);
  };

  const handleSaveOrder = async (order) => {
    handleCloseModal();
    setIsLoading(true);

    try {
      const response = await axios.put(
        `/api/v1/update-order/${order._id}?page=${currentPage}&limit=${limit}`,
        {
          status: order.status,
          location: order.location, // Include tracking location
          notes: order.notes, // Include tracking notes
          estimatedDeliveryTime: order.estimatedDeliveryTime, // Include estimated delivery time
        },
        headers
      );

      showToast("success", "Updated Order Successfully", 100, 1200);
      setItems({
        totalItems: response.data.total,
        orders: response.data.orders,
      });
    } catch (error) {
      console.log(error);
      showToast("error", "Unable to Update Order", 100, 1800);
    } finally {
      setIsLoading(false);
    }
  };

  // const handleSaveOrder = async (order) => {
  //   handleCloseModal();
  //   setIsLoading(true);
  //   try {
  //     const response = await axios.put(
  //       `/api/v1/update-order/${order._id}?page=${currentPage}&limit=${limit}`,
  //       {
  //         status: order.status,
  //       },
  //       headers
  //     );
  //     showToast("success", "Updated Order Successfully", 100, 1200);
  //     setItems({
  //       totalItems: response.data.total,
  //       orders: response.data.orders,
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     showToast("error", "Unable to Update Order", 100, 1800);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  useEffect(() => {
    getOrders();
  }, [currentPage, limit]);

  const handleGotoPage = (page) => {
    setCurrentPage(page);
  };

  return (
    <div
      className="min-vh-100 h-100 bg-main text-white"
      bg="dark"
      data-bs-theme="dark"
    >
      <div className="border-start border-dark bg-primary p-3 d-flex text-white justify-content-between align-items-center">
        <span className="fs-4 fw-bold">Orders</span>

        <OrderModal
          show={showModal}
          handleClose={handleCloseModal}
          handleSave={handleSaveOrder}
          orderData={selectedOrder}
        />
      </div>

      <div className="mt-3 d-flex flex-column justify-content-center align-items-center ">
        {isLoading ? (
          <Spinner animation="border" className="color-green" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : (
          <>
            <div className="container">
              <OrderTable
                orders={items.orders}
                handleEditOrderStatus={handleEditOrder}
              />
            </div>
            <div className="container d-flex flex-column justify-content-center align-items-center">
              <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center mb-2">
                <p className="text-white mb-2 mb-md-0">
                  Showing {rangeStart} - {rangeEnd} of {items.totalItems} items
                </p>
                <Form.Select
                  className="mb-2 mb-md-0"
                  value={limit}
                  onChange={(e) => setLimit(e.target.value)}
                  style={{ width: "180px" }}
                >
                  <option value={5}>5 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={30}>30 per page</option>
                  <option value={40}>40 per page</option>
                  <option value={50}>50 per page</option>
                </Form.Select>
              </div>
              <MyPagination
                currentPage={currentPage}
                totalItems={items.totalItems}
                limit={limit}
                gotoPage={handleGotoPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
