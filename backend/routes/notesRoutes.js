const express = require("express");
const {
  getAllNotes,
  addNote,
  updateNote,
  deleteNote,
  noteCompletion, 
} = require("../controllers/notesController"); 
const router = express.Router();


router.get("/", getAllNotes);
router.post("/", addNote);
router.put("/:id", updateNote);
router.delete("/:id", deleteNote);
router.patch("/:id", noteCompletion); 

module.exports = router;
