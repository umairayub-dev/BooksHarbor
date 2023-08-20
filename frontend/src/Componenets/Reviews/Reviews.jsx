import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../Context/Auth/AuthContext";
import axios from "axios";
import useToast from "../../Hooks/useToast";
import { Card, Spinner } from "react-bootstrap";
import ReviewList from "./ReviewList";
import ReviewForm from "./ReviewForm";
import { decodeToken } from "react-jwt";

const API_BASE_URL = "/api/v1";

const Reviews = ({ bookID }) => {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(null);
  const authContext = useContext(AuthContext);
  const user = decodeToken(authContext.state?.token);
  const showToast = useToast();
  const [selectedReview, setSelectedReview] = useState(null);


  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/reviews/${bookID}`);

      if (response.status === 200) {
        setReviews(response.data);
      } else {
        showToast("error", "Failed to fetch reviews.", 100, 1800);
      }
    } catch (error) {
      showToast("error", error.message, 100, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [bookID]);

  const onReviewDelete = async (reviewId) => {
    setIsLoading(true);
    try {
      await axios
        .delete(`${API_BASE_URL}/reviews/${reviewId}`, {
          headers: {
            Authorization: `Bearer ${authContext.state?.token}`,
          },
        })
        .then((response) => {
          if (response.status === 200) {
            setReviews(response.data);
            showToast("success", "Review Deleted", 100, 1800);
          }
        });
    } catch (error) {
      console.error(error)
      showToast("error", "An error occurred", 100, 1800);
    } finally {
      setSelectedReview(null);
      setIsLoading(false);
    }
  };

  const onReviewEdit = (review) => {
    setSelectedReview(review);
  };

  const onReviewSubmit = async (review) => {
    setIsLoading(true);
    try {
      if (review._id) {
        const updatedReview = {
          rating: review.rating,
          comment: review.comment,
        };
        // If the review has an _id, it means we are in edit mode
        const response = await axios.put(
          `${API_BASE_URL}/reviews/${review._id}`,
          updatedReview,
          {
            headers: {
              Authorization: `Bearer ${authContext.state?.token}`,
            },
          }
        );
        if (response.status === 200) {
          setReviews(response.data.reviews);
          showToast("success", "Review updated", 100, 1800);
        }
      } else {
        // If the review doesn't have an _id, it means we are in create mode
        const data = {
          productId:bookID,
          username: user.username,
          ...review,
        };
        const response = await axios.post(
          `${API_BASE_URL}/reviews/create`,
          data,
          {
            headers: {
              Authorization: `Bearer ${authContext.state?.token}`,
            },
          }
        );
        if (response.status === 201) {
          setReviews(response.data);
          showToast("success", "Review Added", 100, 1800);
        }
      }
    } catch (error) {
      console.log(error)
      showToast("error", "An error occurred", 100, 1800);
    } finally {
      setIsLoading(false);
    }
  };

  const isAuth = () => authContext.state.authStatus === "LoggedIn" && user.role !== "admin";
  const userReview = isAuth()
    ? reviews.find((review) => review.username === user.username)
    : null;

  return (
    <Card className="shadow-lg p-4" bg="dark" data-bs-theme="dark">
      <h3 className="fs-3 color-green fw-bold">Reviews</h3>
      <div>
        {isAuth() ? (
          <div>
            {isLoading ? (
              <Spinner />
            ) : (
              <>
                {!userReview && <ReviewForm onSubmit={onReviewSubmit} />}
                {userReview && selectedReview && (
                  <ReviewForm
                    onSubmit={onReviewSubmit}
                    initialReview={selectedReview}
                    onCancel={() => setSelectedReview(null)}
                  />
                )}
                <ReviewList
                  reviews={reviews}
                  user={user}
                  reviewDelete={onReviewDelete}
                  onReviewEdit={onReviewEdit}
                />
              </>
            )}
          </div>
        ) : (
          <div>
            <ReviewList reviews={reviews} user={null} />
          </div>
        )}
      </div>
    </Card>
  );
};

export default Reviews;
