// routes/contactRoutes.js
import express from 'express';
import {
  submitContactMessage,
  getContactMessages,
  deleteContactMessage,
  submitCallbackRequest,
  getCallbackRequests,
  deleteCallbackRequest,
} from '../controllers/contactController.js';

const router = express.Router();

// Contact routes
router.post('/contact', submitContactMessage);
router.get('/contact', getContactMessages);
router.delete('/contact/:id', deleteContactMessage);

// Callback routes
router.post('/callback', submitCallbackRequest);
router.get('/callback', getCallbackRequests);
router.delete('/callback/:id', deleteCallbackRequest);

// ✅ default export
export default router;
