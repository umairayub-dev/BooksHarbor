const Publisher = require("./PublisherModel");

const handleServerError = (res, error, defaultMessage) => {
  console.error(error); // Log the error for debugging purposes
  res.status(500).json({ error: defaultMessage });
};

const handleNotFoundError = (res, message) => {
  res.status(404).json({ error: message });
};

const getAllPublishersAndRespond = async (req, res) => {
  const { limit, page } = req.query;

  const limitValue = parseInt(limit) || 20;
  const pageValue = parseInt(page) || 1;

  try {
    const total = await Publisher.countDocuments();
    const publishers = await Publisher.find()
      .skip((pageValue - 1) * limitValue)
      .limit(limitValue);
    res.status(200).json({ publishers, total });
  } catch (error) {
    handleServerError(
      res,
      error,
      "An error occurred while fetching publishers."
    );
  }
};

const createPublisher = async (req, res) => {
  try {
    const { name } = req.body;

    const existingPublisher = await Publisher.findOne({ name });
    if (existingPublisher) {
      return res.status(400).json({ error: "Publisher already exists." });
    }

    const newPublisher = new Publisher(req.body);
    const savedPublisher = await newPublisher.save();
    getAllPublishersAndRespond(req,res); // Return all publishers
  } catch (error) {
    handleServerError(
      res,
      error,
      "An error occurred while creating the publisher."
    );
  }
};

const getAllPublishers = async (req, res) => {
  getAllPublishersAndRespond(req,res);
};

const getPublisherById = async (req, res) => {
  try {
    const publisher = await Publisher.findById(req.params.id);
    if (!publisher) {
      return handleNotFoundError(res, "Publisher not found.");
    }
    res.status(200).json(publisher);
  } catch (error) {
    handleServerError(
      res,
      error,
      "An error occurred while fetching the publisher."
    );
  }
};

const getPublisherByName = async (req, res) => {
  try {
    const publisher = await Publisher.findOne({ name: req.params.name });
    if (!publisher) {
      return handleNotFoundError(res, "Publisher not found.");
    }
    res.status(200).json(publisher);
  } catch (error) {
    handleServerError(
      res,
      error,
      "An error occurred while fetching the publisher."
    );
  }
};

const updatePublisher = async (req, res) => {
  try {
    const updatedPublisher = await Publisher.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedPublisher) {
      return handleNotFoundError(res, "Publisher not found.");
    }
    getAllPublishersAndRespond(req, res); // Return all publishers
  } catch (error) {
    handleServerError(
      res,
      error,
      "An error occurred while updating the publisher."
    );
  }
};

const deletePublisher = async (req, res) => {
  try {
    const deletedPublisher = await Publisher.findByIdAndDelete(req.params.id);
    if (!deletedPublisher) {
      return handleNotFoundError(res, "Publisher not found.");
    }
    getAllPublishersAndRespond(req, res); // Return all publishers
  } catch (error) {
    handleServerError(
      res,
      error,
      "An error occurred while deleting the publisher."
    );
  }
};

module.exports = {
  createPublisher,
  getAllPublishers,
  getPublisherById,
  getPublisherByName,
  updatePublisher,
  deletePublisher,
};
