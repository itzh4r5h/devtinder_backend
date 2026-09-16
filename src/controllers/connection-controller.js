import { CustomError } from "../middlewares/error-middleware.js";
import { Connection } from "../models/connection-model.js";
import { User } from "../models/user-model.js";
import { connectionReqValidator } from "../joi-validators/connnection-validators.js";

// ==================================== SEND REQUEST ====================================
export const sendRequest = async (req, res) => {
  const { status, id } = req.body;
  const loggedInUserId = req.user._id;

  const errorMessage = connectionReqValidator({ status, id, isSendReq: true });

  if (errorMessage) {
    throw new CustomError(errorMessage, 400);
  }

  if (loggedInUserId.toString() === id) {
    throw new CustomError("invalid req - same user");
  }

  const isToUserValid = await User.findById(id);

  if (!isToUserValid) {
    throw new CustomError("invalid req", 400);
  }

  const isReqExists = await Connection.findOne({
    $or: [
      { fromUser: loggedInUserId, toUser: id },
      { fromUser: id, toUser: loggedInUserId },
    ],
  });

  if (isReqExists) {
    throw new CustomError("invalid req", 400);
  }

  await Connection.create({ fromUser: loggedInUserId, toUser: id, status });

  res.status(200).json({
    success: true,
    message:
      status === "interested"
        ? "connection request sent successfully"
        : "connection ignored successfully",
  });
};

// ==================================== VIEW SENT REQUESTS ====================================
export const viewSentRequests = async (req, res) => {
  const loggedInUserId = req.user._id;

  const sentRequests = await Connection.find({
    fromUser: loggedInUserId,
    status: "interested",
  }).populate("toUser", "name");

  const data = sentRequests.map((connectionReq) => {
    return {
      connectionId: connectionReq._id,
      user: connectionReq.toUser,
    };
  });

  res.status(200).json({
    success: true,
    connectionRequests: data,
  });
};

// ==================================== REVIEW REQUEST - ACCEPT OR REJECT ====================================
export const reviewRequest = async (req, res) => {
  const { status, id } = req.body;
  const loggedInUserId = req.user._id;

  const errorMessage = connectionReqValidator({ status, id, isSendReq: false });

  if (errorMessage) {
    throw new CustomError(errorMessage, 400);
  }

  const connectionReq = await Connection.findOne({
    _id: id,
    toUser: loggedInUserId,
    status: "interested",
  });

  if (!connectionReq) {
    throw new CustomError("connection req not found", 404);
  }

  connectionReq.status = status;
  await connectionReq.save({ validateBeforeSave: true });

  res.status(200).json({
    success: true,
    message: `connection ${status} successfully`,
  });
};

// ==================================== VIEW REVIEW REQUESTS i.e received one's ====================================
export const viewPendingReviewRequests = async (req, res) => {
  const loggedInUserId = req.user._id;

  const pendingConnectionRequests = await Connection.find({
    toUser: loggedInUserId,
    status: "interested",
  }).populate("fromUser", "name");

  const data = pendingConnectionRequests.map((connectionReq) => {
    return {
      connectionId: connectionReq._id,
      user: connectionReq.fromUser,
    };
  });

  res.status(200).json({
    success: true,
    connectionRequests: data,
  });
};

// ==================================== VIEW CONNECTIONS ====================================
export const viewConnections = async (req, res) => {
  const loggedInUserId = req.user._id;

  const connections = await Connection.find({
    $or: [{ fromUser: loggedInUserId }, { toUser: loggedInUserId }],
    status: "accepted",
  })
    .populate("fromUser", "name")
    .populate("toUser", "name");

  const data = connections.map((conn) => {
    // if logged in user is sender then return receiver user data
    // otherwise return sender data
    if (loggedInUserId.toString() === conn.fromUser._id.toString()) {
      return conn.toUser;
    }
    return conn.fromUser;
  });

  res.status(200).json({
    success: true,
    connections: data,
  });
};

// ==================================== FEED i.e. GET ALL - NOT CONNECTED USERS ====================================
export const connectionFeed = async (req, res) => {
  const loggedInUserId = req.user._id;

  const connections = await Connection.find({
    $or: [{ fromUser: loggedInUserId }, { toUser: loggedInUserId }],
  }).select("fromUser toUser");

  const connectedUsersIds = connections.map((connection) => {
    if (loggedInUserId.toString() === connection.fromUser.toString()) {
      return connection.toUser._id;
    }
    return connection.fromUser._id;
  });

  const filter = {
    _id: { $nin: [loggedInUserId, ...connectedUsersIds] },
  };

  const totalUsers = await User.countDocuments(filter);
  let page = parseInt(req.query?.page) || 1;
  const limit = 2;
  const totalPages = Math.ceil(totalUsers / limit);

  if (page > totalPages) {
    page = 1;
  }

  const skip = (page - 1) * limit;

  const users = await User.find(filter)
    .select("name")
    .sort({ _id: 1 })
    .skip(skip)
    .limit(limit);

  return res.status(200).json({
    users,
    currentPage: page,
    totalPages,
    totalUsers,
  });
};
