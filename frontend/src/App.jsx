import React, { useContext } from "react";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import BookDetailPage from "./Pages/BookDetailPage";
import CheckoutPage from "./Pages/CheckoutPage";
import NotFoundPage from "./Pages/NotFoundPage";
import { AuthContext } from "./Context/Auth/AuthContext";
import { decodeToken } from "react-jwt";
import ToastContainer from "./Componenets/Toast/ToastContainer";
import { Navigate, Route, Routes } from "react-router-dom";
import MyNavbar from "./Componenets/Navbar/MyNavbar";
import AdminPage from "./Admin";
import BooksPage from "./Pages/BooksPage";
import CategoriesPage from "./Pages/CategoriesPage";
import PublishersPage from "./Pages/PublishersPage";
import OrdersPage from "./Pages/OrdersPage";
import TrackingPage from "./Pages/TrackingPage";
import ProfilePage from "./Pages/ProfilePage";
const App = () => {
  const { state } = useContext(AuthContext);

  const decodeUser = (token) => {
    if (!token) {
      return undefined;
    } else {
      const res = decodeToken(token);
      return res?.role;
    }
  };
  const currentToken = decodeUser(state?.token);

  return (
    <>
      <MyNavbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/admin-panel/*"
          element={
            currentToken === "admin" ? <AdminPage /> : <Navigate to={"/"} />
          }
        />
        <Route path="/book/:id" element={<BookDetailPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/categories" element={<CategoriesPage />} />
        <Route path="/publishers" element={<PublishersPage />} />
        <Route path="/track_order" element={<TrackingPage />} />

        <Route
          path="/profile"
          element={
            currentToken && currentToken !== "admin" ? (
              <ProfilePage />
            ) : (
              <Navigate to={"/"} />
            )
          }
        />
        <Route
          path="/orders"
          element={
            currentToken && currentToken !== "admin" ? (
              <OrdersPage />
            ) : (
              <Navigate to={"/"} />
            )
          }
        />
        <Route
          path="/login"
          element={
            currentToken ? (
              currentToken === "admin" ? (
                <Navigate to="/admin-panel" />
              ) : (
                <Navigate to="/" />
              )
            ) : (
              <LoginPage />
            )
          }
        />
        <Route
          path="/checkout"
          element={currentToken ? <CheckoutPage /> : <Navigate to="/" />}
        />
        <Route
          path="/signup"
          element={currentToken ? <Navigate to="/" /> : <SignupPage />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer />
    </>
  );
};

export default App;
