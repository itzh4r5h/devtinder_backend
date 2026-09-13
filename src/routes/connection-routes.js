import express from 'express'
import { isAuthorized, isValidData } from '../middlewares/auth-middleware.js'
import { asyncHandler } from "../middlewares/async-handler.js"
import { connectionFeed, reviewRequest, sendRequest, viewConnections, viewPendingReviewRequests, viewSentRequests } from '../controllers/connection-controller.js'
import { checkProfileCompletion } from '../middlewares/check-profile-completion.js'

export const connectionRouter = express.Router()

// for sending connection req
connectionRouter.post("/req", isAuthorized, checkProfileCompletion, isValidData, asyncHandler(sendRequest))
// for viewing sent requests
connectionRouter.get('/req', isAuthorized, checkProfileCompletion, asyncHandler(viewSentRequests))


// for accepting or rejecting req
connectionRouter.post("/review", isAuthorized, checkProfileCompletion, isValidData, asyncHandler(reviewRequest))
// for viewing recevied requests
connectionRouter.get("/review", isAuthorized, checkProfileCompletion, asyncHandler(viewPendingReviewRequests))

// for viewing connections
connectionRouter.get("/view", isAuthorized, checkProfileCompletion, asyncHandler(viewConnections))

// for getting all users who are not connected
connectionRouter.get('/feed', isAuthorized, checkProfileCompletion, asyncHandler(connectionFeed))
