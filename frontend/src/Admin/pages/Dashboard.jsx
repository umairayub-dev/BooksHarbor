import React, { useContext, useEffect, useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { AuthContext } from "../../Context/Auth/AuthContext";
import { Link } from "react-router-dom";
import { MdCategory, MdOutlineReviews, MdShoppingCartCheckout } from "react-icons/md";
import { SiBookstack } from "react-icons/si";
import { BiCategoryAlt } from "react-icons/bi";
import { FaUsers } from "react-icons/fa"; 

const StatisticCard = ({ label, title, value, icon }) => {
  return (
    <Col sm={6} md={4} lg={3} className="my-2">
      <Link
        to={`/admin-panel/${title.toLowerCase()}`}
        className="text-decoration-none"
      >
        <Card>
          <Card.Body>
            <Card.Title>
              {icon} {label}
            </Card.Title>
            <Card.Text className="fs-3">{value}</Card.Text>
          </Card.Body>
        </Card>
      </Link>
    </Col>
  );
};

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    numBooks: 0,
    numCategories: 0,
    numOrders: 0,
    numPublishers: 0,
    numReviews: 0,
    numUsers: 0,
  });
  const { state } = useContext(AuthContext);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await axios.get("/api/v1/stats", {
          headers: {
            Authorization: `Bearer ${state?.token}`,
          },
        });
        console.log(response);
        const data = response.data;
        setDashboardData(data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    }

    fetchDashboardData();
  }, []);

  return (
    <Container
      fluid
      className="min-vh-100 h-100 bg-main text-white"
      bg="dark"
      data-bs-theme="dark"
    >
      <div className="border-start border-dark bg-primary p-3 d-flex text-white justify-content-between align-items-center">
        <span className="fs-4 fw-bold">Dashboard</span>
      </div>
      <Row className="mt-4 p-4">
        <StatisticCard
          label="Registered Users"
          title="Users"
          value={dashboardData.numUsers}
          icon={<FaUsers />}
        />
        <StatisticCard
          label="Products Available"
          title="Products"
          value={dashboardData.numBooks}
          icon={<SiBookstack />}
        />
        <StatisticCard
          label="Reviews Received"
          title="Reviews"
          value={dashboardData.numReviews}
          icon={<MdOutlineReviews />}
        />
        <StatisticCard
          label="Categories Added"
          title="Categories"
          value={dashboardData.numCategories}
          icon={<BiCategoryAlt />}
        />
        <StatisticCard
          label="Publishers Added"
          title="Publishers"
          value={dashboardData.numPublishers}
          icon={<MdCategory />}
        />
        <StatisticCard
          label="Orders Received"
          title="Orders"
          value={dashboardData.numOrders}
          icon={<MdShoppingCartCheckout />}
        />
      </Row>
    </Container>
  );
};

export default Dashboard;
