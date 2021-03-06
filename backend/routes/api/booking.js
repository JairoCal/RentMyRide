const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const { User } = require("../../db/models");
const { Booking } = require("../../db/models");
const { Car } = require("../../db/models");
const db = require("../../db/models");

router.get(
  "/:userId",
  asyncHandler(async (req, res) => {
    // do a query for all the bookings that a user has associations to
    const user = await User.findByPk(req.params.userId, {
      include: {
				model: Booking,
				include: Car 
			},
    });

    return res.json(user);
  })
);

router.post(
  "/bookCar",
  asyncHandler(async (req, res) => {
    const { userId, carId, startDate, endDate } = req.body;

    const newBooking = await Booking.create({
      userId,
      carId,
      startDate,
      endDate,
    });
    return res.json({ newBooking });
  })
);

module.exports = router;
