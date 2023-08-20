import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-dark text-light py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <h5>About Us</h5>
            <p>
              Your phone store is dedicated to providing high-quality
              smartphones to customers worldwide.
            </p>
          </div>
          <div className="col-md-3">
            <h5>Customer Service</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/help-center">Help Center</Link>
              </li>
              <li>
                <Link to="/privacy-policy">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-condition">Terms & Conditions</Link>
              </li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Support</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/faqs">FAQs</Link>
              </li>
              <li>
                <Link to="/contact-us">Contact Us</Link>
              </li>
              <li>
                <Link to="/installments-plan">Installments Plan</Link>
              </li>
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Company</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/careers">Careers</Link>
              </li>
              <li>
                <Link to="/press-blog">Press & Blog</Link>
              </li>
              <li>
                <Link to="/e-warranty-activation">E-Warranty Activation</Link>
              </li>
              <li>
                <Link to="/secure-payments">Secure Payments Methods</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-12 text-center">
            <p>
              Accepted Payments: <br />
              <img src="https://static.priceoye.pk/images/payment_method.svg" width={280}  height={38} />
            </p>
            <p>&copy; 2023 Your Phone Store. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
