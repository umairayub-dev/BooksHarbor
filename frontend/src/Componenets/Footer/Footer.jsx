import React from "react";
import { Link } from 'react-router-dom';
import paymentImage from '../../assets/images/payment_method.svg';

const Footer = () => {
  return (<footer className="bg-dark text-light py-4">
      <div className="container">
        <div className="row">
          <div className="col-md-3">
            <h5>About BookHarbor</h5>
            <p>
              Embark on literary journeys with BookHarbor. We're dedicated to providing you with a diverse selection of books that ignite your imagination and expand your horizons.
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
            </ul>
          </div>
          <div className="col-md-3">
            <h5>Connect</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/social-media">Social Media</Link>
              </li>
              <li>
                <Link to="/newsletter">Newsletter</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="row mt-4">
          <div className="col-md-12 text-center">
            <p>
              Accepted Payments: <br />
              <img src={paymentImage} width={280} height={38} alt="Accepted Payments" />
            </p>
            <p>&copy; {new Date().getFullYear()} BookHarbor. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>)
}

export default Footer
