const Book = require("./BookModel");

const getBooks = async (req, res) => {
  try {
    const {
      category,
      author,
      publisher,
      limit,
      page,
      sort_by,
      order_by,
      query_term,
    } = req.query;
    const limitValue = parseInt(limit) || 20;
    const pageValue = parseInt(page) || 1;

    let filter = {};

    if (category) {
      filter.category = category;
    }

    if (author) {
      filter.author = author;
    }
    if (publisher) {
      filter.publisher = publisher;
    }

    if (query_term) {
      filter.$or = [
        { title: { $regex: query_term, $options: "i" } },
        { author: { $regex: query_term, $options: "i" } },
        { ISBN: { $regex: query_term, $options: "i" } },
      ];
    }
    const totalBooksCount = await Book.countDocuments(filter);

    const books = await Book.find(filter)
      .find(filter)
      .sort({ [sort_by || "createdAt"]: order_by === "desc" ? -1 : 1 })
      .skip((pageValue - 1) * limitValue)
      .limit(limitValue)
      .select("-__v");

    res.status(200).json({
      books,
      totalBooksCount,
      currentPage: pageValue,
      totalPages: Math.ceil(totalBooksCount / limitValue),
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch Books" });
  }
};

const getBookById = async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);
    return res.status(200).json({
      book,
    });
  } catch (error) {
    return res.status(404).json({
      message: "Book not found",
    });
  }
};

const getFeatBooks = async (req, res) => {
  try {
    const books = await Book.find().limit(12);
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: "Error getting books" });
  }
};

const addBook = async (req, res) => {
  try {
    const existingBook = await Book.findOne({ ISBN: req.body.ISBN });

    if (existingBook) {
      return res
        .status(401)
        .json({ message: "A book with this ISBN already exists" });
    }

    const {
      title,
      author,
      ISBN,
      publisher,
      edition,
      description,
      pages,
      price,
      category,
      stock,
      coverImage,
    } = req.body;
    const newBook = new Book({
      title,
      author,
      ISBN,
      publisher,
      pages,
      edition,
      description,
      price,
      category,
      stock,
      coverImage,
    });

    await Book.create(newBook);
    const totalBooksCount = await Book.countDocuments();
    const books = await Book.find();
    res.status(200).json({ books, totalBooksCount });
  } catch (error) {
    res.status(500).json({ message: "Error creating book", error });
  }
};
const deleteBook = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedBook = await Book.findByIdAndDelete(id);
    if (!deletedBook) {
      return res.status(404).json({ error: "Book not found" });
    }

    const totalBooksCount = await Book.countDocuments();
    const books = await Book.find();
    res.status(200).json({ books, totalBooksCount });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete Book" });
  }
};

const updateBook = async (req, res) => {
  try {
    const { updatedBook } = req.body;
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(500).json({
        message: "Book not found",
      });
    }

    await Book.findByIdAndUpdate(req.params.id, updatedBook);
    const totalBooksCount = await Book.countDocuments();
    const books = await Book.find();
    res.status(200).json({ books, totalBooksCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  addBook,
  getBooks,
  getFeatBooks,
  deleteBook,
  updateBook,
  getBookById,
};
