const Ticket = require('../../common/models/ticket.model');
const User = require('../../common/models/user.model');
const { successResponse, errorResponse } = require('../../common/utils/api-response');
const logger = require('../../common/utils/logger');

exports.getAllTickets = async (req, res) => {
  try {
    const { status, priority, type, assignedTo } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (type) filter.type = type;
    if (assignedTo) filter.assignedTo = assignedTo;

    const tickets = await Ticket.find(filter)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .sort({ priority: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Ticket.countDocuments(filter);

    successResponse(res, 'Tickets retrieved successfully', {
      tickets,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Failed to get tickets:', error);
    errorResponse(res, 'Failed to retrieve tickets', error);
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('assignedTo', 'name email')
      .populate('relatedTransaction')
      .populate('relatedOrder');

    if (!ticket) {
      return errorResponse(res, 'Ticket not found', null, 404);
    }

    successResponse(res, 'Ticket retrieved successfully', ticket);
  } catch (error) {
    logger.error(`Failed to get ticket ${req.params.id}:`, error);
    errorResponse(res, 'Failed to retrieve ticket', error);
  }
};

exports.createTicket = async (req, res) => {
  try {
    const { subject, message, type, priority, relatedTransaction, relatedOrder } = req.body;

    const ticket = new Ticket({
      subject,
      messages: [{
        text: message,
        sentBy: req.user.id,
        isAdmin: true
      }],
      type,
      priority,
      status: 'open',
      createdBy: req.user.id,
      relatedTransaction,
      relatedOrder
    });

    await ticket.save();

    // Отправить уведомление пользователю
    if (ticket.relatedTransaction) {
      // Найти пользователя связанного с транзакцией
    }

    successResponse(res, 'Ticket created successfully', ticket, 201);
  } catch (error) {
    logger.error('Failed to create ticket:', error);
    errorResponse(res, 'Failed to create ticket', error);
  }
};

exports.updateTicketStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return errorResponse(res, 'Invalid status value', null, 400);
    }

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!ticket) {
      return errorResponse(res, 'Ticket not found', null, 404);
    }

    successResponse(res, 'Ticket status updated successfully', ticket);
  } catch (error) {
    logger.error(`Failed to update ticket status ${id}:`, error);
    errorResponse(res, 'Failed to update ticket status', error);
  }
};

exports.addMessageToTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      {
        $push: {
          messages: {
            text: message,
            sentBy: req.user.id,
            isAdmin: req.user.role === 'admin'
          }
        },
        $set: {
          status: req.user.role === 'admin' ? 'in_progress' : 'waiting_admin_response',
          updatedAt: new Date()
        }
      },
      { new: true }
    );

    if (!ticket) {
      return errorResponse(res, 'Ticket not found', null, 404);
    }

    // Отправить уведомление другой стороне
    const notificationRecipient = req.user.role === 'admin' 
      ? ticket.createdBy 
      : ticket.assignedTo || 'admin';

    successResponse(res, 'Message added to ticket successfully', ticket);
  } catch (error) {
    logger.error(`Failed to add message to ticket ${id}:`, error);
    errorResponse(res, 'Failed to add message to ticket', error);
  }
};

exports.assignTicket = async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    const user = await User.findById(assignedTo);
    if (!user || user.role !== 'admin') {
      return errorResponse(res, 'Invalid admin user specified', null, 400);
    }

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      {
        assignedTo,
        status: 'in_progress'
      },
      { new: true }
    );

    if (!ticket) {
      return errorResponse(res, 'Ticket not found', null, 404);
    }

    successResponse(res, 'Ticket assigned successfully', ticket);
  } catch (error) {
    logger.error(`Failed to assign ticket ${id}:`, error);
    errorResponse(res, 'Failed to assign ticket', error);
  }
};
