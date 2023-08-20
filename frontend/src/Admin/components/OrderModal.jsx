import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";

const OrderModal = ({ show, handleClose, handleSave, orderData }) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (orderData) {
      setFormData({ ...orderData });
    }
  }, [orderData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSave(formData);
    setFormData({});
    handleClose();
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      bg="dark"
      data-bs-theme="dark"
      dialogClassName="custom-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Update Order Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {orderData && (
          <div>
            <h5>Order Details:</h5>
            <p>Customer Name: {orderData.user.customerName}</p>
            <p>Customer Email: {orderData.user.customerEmail}</p>
            <p>Customer Address: {orderData.user.customerAddress}</p>
            <p>Customer Contact: {orderData.user.customerContact}</p>
            <p>Total Amount: {orderData.totalAmount}</p>
            <h5>Order Products:</h5>
            <ul>
              {orderData.products.map((product, index) => (
                <li key={index}>
                  {product.title} (Qty: {product.quantity})
                </li>
              ))}
            </ul>
          </div>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="status">
            <Form.Label>Status</Form.Label>
            <Form.Control
              as="select"
              name="status"
              value={formData.status || ""}
              onChange={handleChange}
              required
            >
              <option value="Pending">Pending</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Canceled">Canceled</option>
            </Form.Control>
          </Form.Group>
          <Form.Group controlId="location">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={formData.location || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="notes">
            <Form.Label>Notes</Form.Label>
            <Form.Control
              type="text"
              name="notes"
              value={formData.notes || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group controlId="estimatedDeliveryTime">
            <Form.Label>Estimated Delivery Time</Form.Label>
            <Form.Control
              type="text"
              name="estimatedDeliveryTime"
              value={formData.estimatedDeliveryTime || ""}
              onChange={handleChange}
              required
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Update
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderModal;
// import React, { useState, useEffect } from "react";
// import { Modal, Button, Form } from "react-bootstrap";

// const OrderModal = ({ show, handleClose, handleSave, orderData }) => {
//   const [formData, setFormData] = useState({});

//   useEffect(() => {
//     if (orderData) {
//       setFormData({ ...orderData });
//     }
//   }, [orderData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     handleSave(formData);
//     setFormData({});
//     handleClose();
//   };

//   return (
//     <Modal show={show} onHide={handleClose}>
//       <Modal.Header closeButton>
//         <Modal.Title>
//           {orderData ? "Update Order Status" : "Add Order"}
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         {orderData && (
//           <div>
//             <h5>Order Details:</h5>
//             <p>Customer Name: {orderData.user.customerName}</p>
//             <p>Customer Email: {orderData.user.customerEmail}</p>
//             <p>Customer Address: {orderData.user.customerAddress}</p>
//             <p>Customer Contact: {orderData.user.customerContact}</p>
//             <p>Total Amount: {orderData.totalAmount}</p>
//             <h5>Order Products:</h5>
//             <ul>
//               {orderData.products.map((product, index) => (
//                 <li key={index}>
//                   {product.title} (Qty: {product.quantity})
//                 </li>
//               ))}
//             </ul>
//           </div>
//         )}
//         <Form onSubmit={handleSubmit}>
//           <Form.Group controlId="status">
//             <Form.Label>Status</Form.Label>
//             <Form.Control
//               as="select"
//               name="status"
//               value={formData.status || ""}
//               onChange={handleChange}
//               required
//             >
//               <option value="Pending">Pending</option>
//               <option value="Shipped">Shipped</option>
//               <option value="Delivered">Delivered</option>
//               <option value="Canceled">Canceled</option>
//             </Form.Control>
//           </Form.Group>
//         </Form>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={handleClose}>
//           Close
//         </Button>
//         <Button variant="primary" onClick={handleSubmit}>
//           Update
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default OrderModal;
