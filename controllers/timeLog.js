const TimeLog = require("../models/TimeLog");

module.exports.timeIn = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    // find active log (timeIn exists but timeOut not set)
    const activeLog = await TimeLog.findOne({
      userId,
      timeOut: { $exists: false }
    });

    if (activeLog) {
      // user already clocked in and not yet clocked out
      return res.status(400).json({
        message: "User already clocked in."
      });
    }

    // create new log for this time-in
    const newLog = await TimeLog.create({
      userId,
      timeIn: new Date()
    });

    res.status(201).json({
      message: "Clock In successful",
      timelog: newLog
    });
  } catch (error) {
    res.status(500).json({
      message: "Time in failed",
      error: error.message
    });
  }
};


module.exports.timeIn = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    // find active log (timeIn exists but timeOut not set)
    const activeLog = await TimeLog.findOne({
      userId,
      timeOut: { $exists: false }
    });

    if (activeLog) {
      // user already clocked in and not yet clocked out
      return res.status(400).json({
        message: "User already clocked in."
      });
    }

    // create new log for this time-in
    const newLog = await TimeLog.create({
      userId,
      timeIn: new Date()
    });

    res.status(201).json({
      message: "Clock In successful",
      timelog: newLog
    });
  } catch (error) {
    res.status(500).json({
      message: "Time in failed",
      error: error.message
    });
  }
};


module.exports.timeOut = async (req, res) => {
  try {
    const timelog = await TimeLog.findOne({
      userId: req.user.id,
      timeOut: null
    }).sort({ timeIn: -1 });

    if (!timelog) {
      return res.status(400).json({
        message: "No open time log found"
      });
    }

    timelog.timeOut = new Date();

    // compute totalTime in hours with 4 decimals
    const durationHours = (timelog.timeOut - timelog.timeIn) / 1000 / 60 / 60; // ms → hours
    timelog.totalTime = parseFloat(durationHours.toFixed(4)); // e.g., 0.0167 for 1 min

    await timelog.save();

    res.status(200).json({
      message: "Time out recorded",
      timelog
    });
  } catch (error) {
    res.status(500).json({
      message: "Time out failed",
      error: error.message
    });
  }
};




module.exports.markAsPaid = async (req, res) => {
  try {
    const { timelogId } = req.params;

    const timelog = await TimeLog.findByIdAndUpdate(
      timelogId,
      { isPaid: true },
      { new: true }
    );

    if (!timelog) {
      return res.status(404).json({
        message: "Time log not found"
      });
    }

    res.status(200).json({
      message: "Time log marked as paid",
      timelog
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update payment status",
      error: error.message
    });
  }
};


module.exports.getMyTimeLogs = async (req, res) => {
  try {
    const timelogs = await TimeLog.find({
      userId: req.user.id
    }).sort({ timeIn: -1 });

    res.status(200).json({
      timelogs
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch time logs",
      error: error.message
    });
  }
};



module.exports.getAllTimeLogs = async (req, res) => {
  try {
    const timelogs = await TimeLog.find()
      .populate("userId", "name email")
      .sort({ timeIn: -1 });

    res.status(200).json({
      timelogs
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch time logs",
      error: error.message
    });
  }
};