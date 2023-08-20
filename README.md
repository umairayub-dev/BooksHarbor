
#  BookHarbor - MERN Stack
Welcome to the BookHarbor project! This is a full-stack MERN (MongoDB, Express, React, Node.js) application designed to provide an online platform for buying and selling books.
## Features

- User registration and authentication system.
- Browse books by category, author, or title.
- Search for books using keywords.
- Add books to the shopping cart and proceed to checkout.
- Track order status and delivery information.
- Leave reviews and ratings for books.
- Manage user profiles and track order history.
- Admin panel for managing books, users, and orders.
- Responsive and user-friendly UI.

## Demo
 You can visit the live demo of the app [here](https://bookharbor.cyclic.cloud/).


### Frontend Routes

1. **Home Page**
   - Path: "/"
   - Component: `HomePage`
   - Description: Landing page of the application.

2. **Admin Panel**
   - Path: "/admin-panel/*"
   - Component: `AdminPage`
   - Access: Requires "admin" token.
   - Description: Admin panel for managing administrative tasks.

3. **Book Detail Page**
   - Path: "/book/:id"
   - Component: `BookDetailPage`
   - Description: Displays details of a specific book based on its ID.

4. **Books Page**
   - Path: "/books"
   - Component: `BooksPage`
   - Description: Lists all available books.

5. **Categories Page**
   - Path: "/categories"
   - Component: `CategoriesPage`
   - Description: Lists book categories for users to explore.

6. **Publishers Page**
   - Path: "/publishers"
   - Component: `PublishersPage`
   - Description: Lists book publishers for users to explore.

7. **Tracking Page**
   - Path: "/track_order"
   - Component: `TrackingPage`
   - Description: Allows users to track their orders.

8. **Profile Page**
   - Path: "/profile"
   - Component: `ProfilePage`
   - Access: Requires user token.
   - Description: Displays user profile information.

9. **Orders Page**
   - Path: "/orders"
   - Component: `OrdersPage`
   - Access: Requires user token.
   - Description: Lists user's order history.

10. **Login Page**
    - Path: "/login"
    - Component: `LoginPage`
    - Access: If token is set, navigates to home page or admin panel.
    - Description: Allows users to log in to the application.

11. **Checkout Page**
    - Path: "/checkout"
    - Component: `CheckoutPage`
    - Access: Requires user token.
    - Description: Allows users to proceed with order checkout.

12. **Signup Page**
    - Path: "/signup"
    - Component: `SignupPage`
    - Access: If token is set, navigates to home page.
    - Description: Allows new users to sign up for the application.

13. **Not Found Page**
    - Path: "*"
    - Component: `NotFoundPage`
    - Description: Renders when no matching route is found.



## API Reference
### User

#### Login User

```http
  POST /api/v1/login
```

Log in a user by providing their email and password.

| Parameter  | Type     | Description            |
| :--------- | :------- | :--------------------- |
| `email`    | `string` | **Required**. User's email |
| `password` | `string` | **Required**. User's password |

**Responses:**

| Status Code | Response                                  |
| :---------- | :---------------------------------------- |
| `200 OK`    | Successful login.                         |
| `400 Bad Request` | Invalid credentials or missing fields. |
| `401 Unauthorized` | User not found or incorrect password. |
| `500 Internal Server Error` | Server error occurred. |

---

#### Signup User

```http
  POST /api/v1/signup
```

Sign up a new user with a unique username and a valid email address.

| Parameter  | Type     | Description            |
| :--------- | :------- | :--------------------- |
| `username` | `string` | **Required**. User's desired username |
| `email`    | `string` | **Required**. User's email |
| `password` | `string` | **Required**. User's password |

**Responses:**

| Status Code | Response                                       |
| :---------- | :--------------------------------------------- |
| `201 Created` | User successfully signed up.                 |
| `400 Bad Request` | Invalid or missing fields.                 |
| `400 Bad Request` | Invalid email format or weak password.     |
| `400 Bad Request` | Email or username already in use.         |
| `500 Internal Server Error` | Server error occurred.           |

---

#### Get User Profile

```http
  GET /api/v1/profile
```

Retrieve the profile of the authenticated user.

| Header                | Value                                       |
| :-------------------- | :------------------------------------------ |
| `Authorization`       | `Bearer your_jwt_token` (Required)         |

**Responses:**

| Status Code | Response                                  |
| :---------- | :---------------------------------------- |
| `200 OK`    | Successful profile retrieval.             |
| `401 Unauthorized` | Missing or invalid token.             |
| `500 Internal Server Error` | Server error occurred.           |

---

#### Update User Profile

```http
  PATCH /api/v1/profile
```

Update the profile details of the authenticated user.

| Header                | Value                                       |
| :-------------------- | :------------------------------------------ |
| `Authorization`       | `Bearer your_jwt_token` (Required)         |

| Parameter     | Type     | Description                  |
| :------------ | :------- | :--------------------------- |
| `userImage`   | `string` | New user image URL           |
| `username`    | `string` | New username                 |
| `email`       | `string` | New email address            |

**Responses:**

| Status Code | Response                               |
| :---------- | :------------------------------------- |
| `200 OK`    | Profile updated successfully.         |
| `400 Bad Request` | Invalid or missing fields.         |
| `404 Not Found` | User not found.                   |
| `500 Internal Server Error` | Server error occurred.   |

---

#### Get All Users

```http
  GET /api/v1/users
```

Retrieve a list of all users. (Restricted to admin users)

| Header                | Value                                       |
| :-------------------- | :------------------------------------------ |
| `Authorization`       | `Bearer your_admin_jwt_token` (Required)   |

**Responses:**

| Status Code | Response                                    |
| :---------- | :------------------------------------------ |
| `200 OK`    | Successful retrieval of user list.         |
| `401 Unauthorized` | Missing or invalid token or insufficient role. |
| `404 Not Found` | No users found.                         |
| `500 Internal Server Error` | Server error occurred.          |

---

#### Delete User

```http
  DELETE /api/v1/user/:id
```

Delete a user by their ID. (Restricted to admin users)

| Header                | Value                                       |
| :-------------------- | :------------------------------------------ |
| `Authorization`       | `Bearer your_admin_jwt_token` (Required)   |

| Parameter | Type     | Description          |
| :-------- | :------- | :------------------- |
| `id`      | `string` | ID of the user to delete |

**Responses:**

| Status Code | Response                                  |
| :---------- | :---------------------------------------- |
| `200 OK`    | User deleted successfully.               |
| `401 Unauthorized` | Missing or invalid token or insufficient role. |
| `404 Not Found` | User not found.                         |
| `500 Internal Server Error` | Server error occurred.           |

---


### Book

#### Get Books

```http
GET /api/v1/books
```

Retrieve a list of books based on provided filters and pagination options.

| Query Parameter | Type     | Description                                         |
| :-------------- | :------- | :-------------------------------------------------- |
| `category`      | `string` | Filter by book category                             |
| `author`        | `string` | Filter by author's name                            |
| `publisher`     | `string` | Filter by publisher's name                         |
| `limit`         | `number` | Limit the number of books per page (default: 20)  |
| `page`          | `number` | Page number to retrieve (default: 1)              |
| `sort_by`       | `string` | Sort by field (default: `createdAt`)              |
| `order_by`      | `string` | Sorting order (`asc` or `desc`, default: `asc`)   |
| `query_term`    | `string` | Search term to match against title, author, and ISBN |

**Responses:**

| Status Code | Response                               |
| :---------- | :------------------------------------- |
| `200 OK`    | Successful retrieval of book list.   |
| `500 Internal Server Error` | Server error occurred. |

---

#### Get Book by ID

```http
GET /api/v1/book_details/:id
```

Retrieve a single book by its unique ID.

| Parameter | Type     | Description          |
| :-------- | :------- | :------------------- |
| `id`      | `string` | ID of the book       |

**Responses:**

| Status Code | Response                               |
| :---------- | :------------------------------------- |
| `200 OK`    | Successful retrieval of the book.     |
| `404 Not Found` | Book not found.                  |
| `500 Internal Server Error` | Server error occurred. |

---

#### Get Featured Books

```http
GET /api/v1/featured-books
```

Retrieve a list of featured books (limited to 12 books).

**Responses:**

| Status Code | Response                               |
| :---------- | :------------------------------------- |
| `200 OK`    | Successful retrieval of featured books. |
| `500 Internal Server Error` | Server error occurred. |

---

#### Add Book

```http
POST /api/v1/books/new
```

Add a new book to the collection.

| Header                | Value                                         |
| :-------------------- | :-------------------------------------------- |
| `Authorization`       | `Bearer your_admin_jwt_token` (Required)     |

| Parameter       | Type     | Description                |
| :-------------- | :------- | :------------------------- |
| `title`         | `string` | Title of the book          |
| `author`        | `string` | Author's name              |
| `ISBN`          | `string` | ISBN of the book           |
| `publisher`     | `string` | Publisher's name           |
| `edition`       | `string` | Edition of the book        |
| `description`   | `string` | Description of the book    |
| `pages`         | `number` | Number of pages            |
| `price`         | `number` | Price of the book          |
| `category`      | `string` | Category of the book       |
| `stock`         | `number` | Available stock count      |
| `coverImage`    | `string` | Cover image URL            |
| `images`        | `array`  | Array of image URLs        |

**Responses:**

| Status Code | Response                               |
| :---------- | :------------------------------------- |
| `200 OK`    | Book added successfully.              |
| `401 Unauthorized` | Missing or invalid token.        |
| `500 Internal Server Error` | Server error occurred. |

---

#### Update Book

```http
PATCH /api/v1/update-book/:id
```

Update details of a book.

| Header                | Value                                         |
| :-------------------- | :-------------------------------------------- |
| `Authorization`       | `Bearer your_admin_jwt_token` (Required)     |

| Parameter        | Type     | Description                    |
| :--------------- | :------- | :----------------------------- |
| `updatedBook`    | `object` | Updated book details          |

**Responses:**

| Status Code | Response                               |
| :---------- | :------------------------------------- |
| `200 OK`    | Book updated successfully.            |
| `401 Unauthorized` | Missing or invalid token.        |
| `500 Internal Server Error` | Server error occurred. |

---

#### Delete Book

```http
DELETE /api/v1/delete-book/:id
```

Delete a book by its ID.

| Header                | Value                                         |
| :-------------------- | :-------------------------------------------- |
| `Authorization`       | `Bearer your_admin_jwt_token` (Required)     |

| Parameter | Type     | Description          |
| :-------- | :------- | :------------------- |
| `id`      | `string` | ID of the book       |

**Responses:**

| Status Code | Response                               |
| :---------- | :------------------------------------- |
| `200 OK`    | Book deleted successfully.            |
| `401 Unauthorized` | Missing or invalid token.        |
| `500 Internal Server Error` | Server error occurred. |



### Category

#### Add Category

```http
POST /api/v1/add-category
```

Add a new category.

| Header                | Value                                       |
| :-------------------- | :------------------------------------------ |
| `Authorization`       | `Bearer your_admin_jwt_token` (Required)   |

| Parameter       | Type     | Description               |
| :-------------- | :------- | :------------------------ |
| `CategoryName`  | `string` | Name of the new category |

**Responses:**

| Status Code | Response                               |
| :---------- | :------------------------------------- |
| `200 OK`    | Category added successfully.          |
| `400 Bad Request` | Invalid values or missing `CategoryName`. |
| `401 Unauthorized` | Missing or invalid token.        |
| `500 Internal Server Error` | Server error occurred. |

---

#### Get All Categories

```http
GET/api/v1/all-categories
```

Retrieve a list of all categories.

| Query Parameter | Type     | Description                                         |
| :-------------- | :------- | :-------------------------------------------------- |
| `limit`         | `number` | Limit the number of categories per page (default: 20)  |
| `page`          | `number` | Page number to retrieve (default: 1)              |

**Responses:**

| Status Code | Response                               |
| :---------- | :------------------------------------- |
| `200 OK`    | Successful retrieval of category list. |
| `500 Internal Server Error` | Server error occurred. |

---

#### Get Category by Name

```http
GET /api/v1/category-by-name/:name
```

Retrieve a category by its name.

| Parameter | Type     | Description          |
| :-------- | :------- | :------------------- |
| `name`    | `string` | Name of the category |

**Responses:**

| Status Code | Response                               |
| :---------- | :------------------------------------- |
| `200 OK`    | Successful retrieval of the category. |
| `500 Internal Server Error` | Server error occurred. |

---

#### Get Category by ID

```http
GET /api/v1/category-by-id/:id
```

Retrieve a category by its ID.

| Parameter | Type     | Description          |
| :-------- | :------- | :------------------- |
| `id`      | `string` | ID of the category   |

**Responses:**

| Status Code | Response                               |
| :---------- | :------------------------------------- |
| `200 OK`    | Successful retrieval of the category. |
| `500 Internal Server Error` | Server error occurred. |

---

#### Delete Category

```http
DELETE /api/v1/delete-category/:id
```

Delete a category by its ID.

| Header                | Value                                       |
| :-------------------- | :------------------------------------------ |
| `Authorization`       | `Bearer your_admin_jwt_token` (Required)   |

| Parameter | Type     | Description          |
| :-------- | :------- | :------------------- |
| `id`      | `string` | ID of the category   |

**Responses:**

| Status Code | Response                               |
| :---------- | :------------------------------------- |
| `200 OK`    | Category deleted successfully.        |
| `400 Bad Request` | Invalid category ID.              |
| `401 Unauthorized` | Missing or invalid token.        |
| `404 Not Found` | Category not found or already deleted. |
| `500 Internal Server Error` | Server error occurred. |

---

#### Update Category

```http
PUT /api/v1/update-category/:id
```

Update details of a category by its ID.

| Header                | Value                                       |
| :-------------------- | :------------------------------------------ |
| `Authorization`       | `Bearer your_admin_jwt_token` (Required)   |

| Parameter       | Type     | Description                    |
| :-------------- | :------- | :----------------------------- |
| `id`            | `string` | ID of the category to update  |
| `CategoryName`  | `string` | Updated category name          |

**Responses:**

| Status Code | Response                               |
| :---------- | :------------------------------------- |
| `200 OK`    | Category updated successfully.        |
| `400 Bad Request` | Missing or invalid fields.        |
| `401 Unauthorized` | Missing or invalid token.        |
| `404 Not Found` | Category not found.              |
| `500 Internal Server Error` | Server error occurred. |




### Publisher

#### Create Publisher

```http
POST /api/v1/add-publisher
```

Create a new publisher.

| Header                | Value                                         |
| :-------------------- | :-------------------------------------------- |
| `Authorization`       | `Bearer your_admin_jwt_token` (Required)     |

| Parameter | Type     | Description          |
| :-------- | :------- | :------------------- |
| `name`    | `string` | Name of the publisher|

**Responses:**

| Status Code | Response                               |
| :---------- | :------------------------------------- |
| `200 OK`    | Publisher created successfully.       |
| `400 Bad Request` | Publisher already exists or missing fields. |
| `401 Unauthorized` | Missing or invalid token.        |
| `500 Internal Server Error` | Server error occurred. |

---

#### Get All Publishers

```http
GET /api/v1/all-publishers
```

Retrieve a list of all publishers.

**Responses:**

| Status Code | Response                               |
| :---------- | :------------------------------------- |
| `200 OK`    | Successful retrieval of publisher list. |
| `500 Internal Server Error` | Server error occurred. |

---

#### Get Publisher by ID

```http
GET /api/v1/publisher-by-id/:id
```

Retrieve a publisher by its ID.

| Parameter | Type     | Description          |
| :-------- | :------- | :------------------- |
| `id`      | `string` | ID of the publisher |

**Responses:**

| Status Code | Response                               |
| :---------- | :------------------------------------- |
| `200 OK`    | Successful retrieval of the publisher. |
| `404 Not Found` | Publisher not found.             |
| `500 Internal Server Error` | Server error occurred. |

---

#### Get Publisher by Name

```http
GET /api/v1/publisher-by-name/:name
```

Retrieve a publisher by its name.

| Parameter | Type     | Description          |
| :-------- | :------- | :------------------- |
| `name`    | `string` | Name of the publisher |

**Responses:**

| Status Code | Response                               |
| :---------- | :------------------------------------- |
| `200 OK`    | Successful retrieval of the publisher. |
| `404 Not Found` | Publisher not found.             |
| `500 Internal Server Error` | Server error occurred. |

---

#### Update Publisher

```http
PUT /api/v1/update-publisher/:id
```

Update details of a publisher by its ID.

| Header                | Value                                         |
| :-------------------- | :-------------------------------------------- |
| `Authorization`       | `Bearer your_admin_jwt_token` (Required)     |

| Parameter | Type     | Description          |
| :-------- | :------- | :------------------- |
| `id`      | `string` | ID of the publisher |
| `name`    | `string` | Updated publisher name|

**Responses:**

| Status Code | Response                               |
| :---------- | :------------------------------------- |
| `200 OK`    | Publisher updated successfully.      |
| `400 Bad Request` | Missing or invalid fields.        |
| `401 Unauthorized` | Missing or invalid token.        |
| `404 Not Found` | Publisher not found.             |
| `500 Internal Server Error` | Server error occurred. |

---

#### Delete Publisher

```http
DELETE /api/v1/delete-publisher/:id
```

Delete a publisher by its ID.

| Header                | Value                                         |
| :-------------------- | :-------------------------------------------- |
| `Authorization`       | `Bearer your_admin_jwt_token` (Required)     |

| Parameter | Type     | Description          |
| :-------- | :------- | :------------------- |
| `id`      | `string` | ID of the publisher |

**Responses:**

| Status Code | Response                               |
| :---------- | :------------------------------------- |
| `200 OK`    | Publisher deleted successfully.      |
| `401 Unauthorized` | Missing or invalid token.        |
| `404 Not Found` | Publisher not found.             |
| `500 Internal Server Error` | Server error occurred. |


### Review 

#### Get All Reviews

```http
GET /api/v1/all-reviews
```

Retrieve a list of all reviews.

| Header                | Value                                       |
| :-------------------- | :------------------------------------------ |
| `Authorization`       | `Bearer your_admin_jwt_token` (Required)   |

**Responses:**

| Status Code | Response                             |
| :---------- | :----------------------------------- |
| `200 OK`    | Successful retrieval of review list. |
| `401 Unauthorized` | Missing or invalid token.    |
| `500 Internal Server Error` | Server error occurred. |

---

#### Admin Delete Review

```http
DELETE /api/v1/delete-review/:reviewId
```

Delete a review by its ID.

| Header                | Value                                       |
| :-------------------- | :------------------------------------------ |
| `Authorization`       | `Bearer your_admin_jwt_token` (Required)   |

| Parameter   | Type     | Description          |
| :---------- | :------- | :------------------- |
| `reviewId`  | `string` | ID of the review    |

**Responses:**

| Status Code | Response                             |
| :---------- | :----------------------------------- |
| `200 OK`    | Review deleted successfully.        |
| `401 Unauthorized` | Missing or invalid token.    |
| `404 Not Found` | Review not found.              |
| `500 Internal Server Error` | Server error occurred. |

---

#### Get Reviews for Product

```http
GET /api/v1/reviews/:productId
```

Retrieve reviews for a specific product.

| Parameter   | Type     | Description          |
| :---------- | :------- | :------------------- |
| `productId` | `string` | ID of the product   |

**Responses:**

| Status Code | Response                           |
| :---------- | :--------------------------------- |
| `200 OK`    | Successful retrieval of reviews.  |
| `500 Internal Server Error` | Server error occurred. |

---

#### Create Review

```http
POST /api/v1/reviews/create
```

Create a new review.

| Header                | Value                                       |
| :-------------------- | :------------------------------------------ |
| `Authorization`       | `Bearer your_user_jwt_token` (Required)    |

| Parameter   | Type     | Description          |
| :---------- | :------- | :------------------- |
| `productId` | `string` | ID of the product   |
| `rating`    | `number` | Rating for the product |
| `comment`   | `string` | Review comment     |
| `username`  | `string` | Username           |

**Responses:**

| Status Code | Response                             |
| :---------- | :----------------------------------- |
| `201 Created` | Review created successfully.     |
| `400 Bad Request` | Missing or invalid fields. |
| `401 Unauthorized` | Missing or invalid token.    |
| `500 Internal Server Error` | Server error occurred. |

---

#### Update Review

```http
PUT /api/v1/reviews/:reviewId
```

Update a review by its ID.

| Header                | Value                                       |
| :-------------------- | :------------------------------------------ |
| `Authorization`       | `Bearer your_user_jwt_token` (Required)    |

| Parameter   | Type     | Description          |
| :---------- | :------- | :------------------- |
| `reviewId`  | `string` | ID of the review    |
| `rating`    | `number` | Updated rating      |
| `comment`   | `string` | Updated comment     |

**Responses:**

| Status Code | Response                             |
| :---------- | :----------------------------------- |
| `200 OK`    | Review updated successfully.     |
| `400 Bad Request` | Missing or invalid fields. |
| `401 Unauthorized` | Missing or invalid token.    |
| `403 Forbidden` | Unauthorized to update review. |
| `404 Not Found` | Review not found.           |
| `500 Internal Server Error` | Server error occurred. |

---

#### Delete Review

```http
DELETE /api/v1/reviews/:reviewId
```

Delete a review by its ID.

| Header                | Value                                       |
| :-------------------- | :------------------------------------------ |
| `Authorization`       | `Bearer your_user_jwt_token` (Required)    |

| Parameter   | Type     | Description          |
| :---------- | :------- | :------------------- |
| `reviewId`  | `string` | ID of the review    |

**Responses:**

| Status Code | Response                             |
| :---------- | :----------------------------------- |
| `200 OK`    | Review deleted successfully.     |
| `400 Bad Request` | Missing or invalid fields. |
| `401 Unauthorized` | Missing or invalid token.    |
| `403 Forbidden` | Unauthorized to delete review. |
| `404 Not Found` | Review not found.           |
| `500 Internal Server Error` | Server error occurred. |


### Order

#### Get All Orders (Admin Only)

```http
GET /api/v1/all-orders
```

Retrieve a list of all orders (admin only).

| Header                | Value                                       |
| :-------------------- | :------------------------------------------ |
| `Authorization`       | `Bearer your_admin_jwt_token` (Required)   |

**Responses:**

| Status Code | Response                             |
| :---------- | :----------------------------------- |
| `200 OK`    | Successful retrieval of order list. |
| `401 Unauthorized` | Missing or invalid token.    |
| `500 Internal Server Error` | Server error occurred. |

---

#### Get User Orders

```http
GET /api/v1/get-user-orders
```

Retrieve orders for the logged-in user.

| Header                | Value                                       |
| :-------------------- | :------------------------------------------ |
| `Authorization`       | `Bearer your_user_jwt_token` (Required)    |

**Responses:**

| Status Code | Response                           |
| :---------- | :--------------------------------- |
| `200 OK`    | Successful retrieval of orders.  |
| `401 Unauthorized` | Missing or invalid token.    |
| `500 Internal Server Error` | Server error occurred. |

---

#### Create Order

```http
POST /api/v1/create-order
```

Create a new order.

| Header                | Value                                       |
| :-------------------- | :------------------------------------------ |
| `Authorization`       | `Bearer your_user_jwt_token` (Required)    |

| Body Field    | Type     | Description          |
| :------------ | :------- | :------------------- |
| `user`        | `object` | User information    |
| `products`    | `array`  | Ordered products    |
| `totalAmount` | `number` | Total order amount  |
| `trackingInfo`| `object` | Order tracking info |

**Responses:**

| Status Code | Response                             |
| :---------- | :----------------------------------- |
| `201 Created` | Order created successfully.    |
| `400 Bad Request` | Missing or invalid fields. |
| `401 Unauthorized` | Missing or invalid token.    |
| `500 Internal Server Error` | Server error occurred. |

---

#### Update Order Status (Admin Only)

```http
PUT /api/v1/update-order/:orderId
```

Update order status (admin only).

| Header                | Value                                       |
| :-------------------- | :------------------------------------------ |
| `Authorization`       | `Bearer your_admin_jwt_token` (Required)   |

| Parameter   | Type     | Description          |
| :---------- | :------- | :------------------- |
| `orderId`   | `string` | ID of the order     |
| `status`    | `string` | Updated order status |

**Responses:**

| Status Code | Response                             |
| :---------- | :----------------------------------- |
| `200 OK`    | Order status updated successfully. |
| `400 Bad Request` | Missing or invalid fields. |
| `401 Unauthorized` | Missing or invalid token.    |
| `403 Forbidden` | Unauthorized to update order. |
| `404 Not Found` | Order not found.              |
| `500 Internal Server Error` | Server error occurred. |

---

#### Cancel Order (User Only)

```http
PUT /api/v1/cancel-order/:orderId
```

Cancel an order (user only).

| Header                | Value                                       |
| :-------------------- | :------------------------------------------ |
| `Authorization`       | `Bearer your_user_jwt_token` (Required)    |

| Parameter   | Type     | Description          |
| :---------- | :------- | :------------------- |
| `orderId`   | `string` | ID of the order     |

**Responses:**

| Status Code | Response                             |
| :---------- | :----------------------------------- |
| `200 OK`    | Order canceled successfully.     |
| `400 Bad Request` | Missing or invalid fields. |
| `401 Unauthorized` | Missing or invalid token.    |
| `403 Forbidden` | Unauthorized to cancel order. |
| `404 Not Found` | Order not found.              |
| `500 Internal Server Error` | Server error occurred. |

---

#### Track Order

```http
GET /api/v1/track-order/:orderId
```

Retrieve tracking information for an order.

| Parameter   | Type     | Description          |
| :---------- | :------- | :------------------- |
| `orderId`   | `string` | ID of the order     |

**Responses:**

| Status Code | Response                           |
| :---------- | :--------------------------------- |
| `200 OK`    | Successful retrieval of tracking info.  |
| `400 Bad Request` | Invalid order ID format. |
| `404 Not Found` | Order not found.           |
| `500 Internal Server Error` | Server error occurred. |


### Get Statistics

```http
GET /api/v1/stats
```

Retrieve statistics about various entities in your system (admin only).

| Header                | Value                                       |
| :-------------------- | :------------------------------------------ |
| `Authorization`       | `Bearer your_admin_jwt_token` (Required)   |

**Responses:**

| Status Code | Response                             |
| :---------- | :----------------------------------- |
| `200 OK`    | Successful retrieval of statistics. |
| `401 Unauthorized` | Missing or invalid token.    |
| `403 Forbidden` | Unauthorized to access statistics. |
| `500 Internal Server Error` | Server error occurred. |

**Response Example:**

```json
{
  "numBooks": 120,
  "numCategories": 15,
  "numOrders": 350,
  "numPublishers": 25,
  "numReviews": 450,
  "numUsers": 800
}
```
MONGO_URI
PORT=
SECRET
ADMIN_EMAIL
GMAIL_MAIL
GMAIL_PASSWORD
APP_LINK =  // hosted app link
