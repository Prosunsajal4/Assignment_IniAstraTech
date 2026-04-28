const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../db/connection");

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password required" });
    }

    const db = getDB();
    const students = db.collection("students");

    const existingStudent = await students.findOne({ username });
    if (existingStudent) {
      return res.status(400).json({ error: "Student already exists" });
    }

    const result = await students.insertOne({
      username,
      password,
      bookedSlots: [],
      createdAt: new Date(),
    });

    const student = await students.findOne({ _id: result.insertedId });

    res.status(201).json({
      id: student._id.toString(),
      username: student.username,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const db = getDB();
    const students = db.collection("students");

    const student = await students.findOne({ username, password });
    if (!student) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json({
      id: student._id.toString(),
      username: student.username,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/available-slots", async (req, res) => {
  try {
    const db = getDB();
    const slots = db.collection("slots");
    const teachers = db.collection("teachers");

    const slotList = await slots
      .find({ status: "Available" })
      .sort({ date: 1, startTime: 1 })
      .toArray();

    for (let slot of slotList) {
      const teacher = await teachers.findOne({ _id: slot.teacherId });
      if (teacher) {
        slot.teacherId = {
          _id: teacher._id.toString(),
          username: teacher.username,
        };
      }
      slot._id = slot._id.toString();
    }

    res.json({ slots: slotList });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/book-slot", async (req, res) => {
  try {
    const { slotId, studentId } = req.body;

    if (!slotId || !studentId) {
      return res.status(400).json({ error: "slotId and studentId required" });
    }

    const db = getDB();
    const slots = db.collection("slots");
    const students = db.collection("students");
    const bookings = db.collection("bookings");

    const slot = await slots.findOne({ _id: new ObjectId(slotId) });
    if (!slot) {
      return res.status(404).json({ error: "Slot not found" });
    }

    if (slot.status === "Booked") {
      return res.status(400).json({ error: "Slot already booked" });
    }

    const student = await students.findOne({ _id: new ObjectId(studentId) });
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    await slots.updateOne(
      { _id: new ObjectId(slotId) },
      { $set: { status: "Booked", bookedBy: new ObjectId(studentId) } },
    );

    await students.updateOne(
      { _id: new ObjectId(studentId) },
      { $push: { bookedSlots: new ObjectId(slotId) } },
    );

    await bookings.insertOne({
      slotId: new ObjectId(slotId),
      studentId: new ObjectId(studentId),
      teacherId: slot.teacherId,
      bookedAt: new Date(),
    });

    res.json({
      message: "Slot booked successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/my-bookings/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    const db = getDB();
    const students = db.collection("students");
    const slots = db.collection("slots");
    const teachers = db.collection("teachers");

    const student = await students.findOne({ _id: new ObjectId(studentId) });

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }

    const bookedSlotIds = student.bookedSlots || [];
    const bookedSlots = [];

    for (const slotId of bookedSlotIds) {
      const slot = await slots.findOne({ _id: slotId });
      if (slot) {
        const teacher = await teachers.findOne({ _id: slot.teacherId });
        slot.teacherId = teacher
          ? { _id: teacher._id.toString(), username: teacher.username }
          : slot.teacherId;
        slot._id = slot._id.toString();
        bookedSlots.push(slot);
      }
    }

    res.json({
      student: {
        username: student.username,
      },
      bookedSlots,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
