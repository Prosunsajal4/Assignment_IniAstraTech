const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../db/connection");
const {
  checkSlotOverlap,
  isPastTime,
  getEndTime,
} = require("../utils/slotHelper");

const router = express.Router();

const withError = (handler) => async (req, res) => {
  try {
    await handler(req, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const hasRequired = (values) => values.every((value) => Boolean(value));

const toAuthResponse = (teacher) => ({
  id: teacher._id.toString(),
  username: teacher.username,
  totalSlots: teacher.totalSlots || 0,
});

router.post(
  "/register",
  withError(async (req, res) => {
    const { username, password } = req.body;

    if (!hasRequired([username, password])) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const db = getDB();
    const teachers = db.collection("teachers");

    const existingTeacher = await teachers.findOne({ username });
    if (existingTeacher) {
      return res.status(400).json({ error: "Teacher already exists" });
    }

    const result = await teachers.insertOne({
      username,
      password,
      totalSlots: 0,
      createdAt: new Date(),
    });

    const teacher = await teachers.findOne({ _id: result.insertedId });
    return res.status(201).json(toAuthResponse(teacher));
  }),
);

router.post(
  "/login",
  withError(async (req, res) => {
    const { username, password } = req.body;

    const db = getDB();
    const teachers = db.collection("teachers");

    const teacher = await teachers.findOne({ username, password });

    if (!teacher) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    return res.json(toAuthResponse(teacher));
  }),
);

router.post(
  "/create-slot",
  withError(async (req, res) => {
    const { teacherId, date, startTime } = req.body;

    if (!hasRequired([teacherId, date, startTime])) {
      return res
        .status(400)
        .json({ error: "teacherId, date, and startTime required" });
    }

    if (isPastTime(date, startTime)) {
      return res
        .status(400)
        .json({ error: "Cannot create slots for past times" });
    }

    const endTime = getEndTime(startTime);
    const normalizedDate = new Date(date);

    const db = getDB();
    const slots = db.collection("slots");
    const teachers = db.collection("teachers");

    const existingSlots = await slots
      .find({ teacherId: new ObjectId(teacherId), date: normalizedDate })
      .toArray();

    if (checkSlotOverlap(startTime, endTime, existingSlots)) {
      return res
        .status(400)
        .json({ error: "Slot overlaps with existing slot" });
    }

    const result = await slots.insertOne({
      teacherId: new ObjectId(teacherId),
      date: normalizedDate,
      startTime,
      endTime,
      status: "Available",
      bookedBy: null,
      createdAt: new Date(),
    });

    await teachers.updateOne(
      { _id: new ObjectId(teacherId) },
      { $inc: { totalSlots: 1 } },
    );

    const slot = await slots.findOne({ _id: result.insertedId });
    return res.status(201).json({ ...slot, _id: slot._id.toString() });
  }),
);

router.get(
  "/slots/:teacherId",
  withError(async (req, res) => {
    const { teacherId } = req.params;

    const db = getDB();
    const slots = db.collection("slots");
    const students = db.collection("students");

    const slotList = await slots
      .find({ teacherId: new ObjectId(teacherId) })
      .sort({ date: 1, startTime: 1 })
      .toArray();

    for (let slot of slotList) {
      if (slot.bookedBy) {
        const student = await students.findOne({ _id: slot.bookedBy });
        if (student) {
          slot.bookedBy = {
            _id: student._id.toString(),
            username: student.username,
          };
        }
      }
      slot._id = slot._id.toString();
      slot.teacherId = slot.teacherId.toString();
    }

    return res.json({ slots: slotList });
  }),
);

module.exports = router;
