const Concert = require('../models/concert.model');
const Seat = require('../models/seat.model');
var sanitize = require('mongo-sanitize');

exports.getAll = async (req, res) => {
  try {
    const concerts = await Concert.find({});
    const seats = await Seat.find();
    const updatedConcerts = concerts.map((concert) => {
      const concertObj = concert.toObject();
      concertObj.tickets = 50 - seats.filter((seat) => seat.day === concertObj.day).length;
      return concertObj;
    });
    res.json(updatedConcerts);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
exports.getRandom = async (req, res) => {
  try {
    const count = await Concert.countDocuments();
    const rand = Math.floor(Math.random() * count);
    const con = await Concert.findOne().skip(rand);
    if (!con) res.status(404).json({ message: 'Not found' });
    else res.json(con);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
exports.getById = async (req, res) => {
  try {
    const con = await Concert.findById(req.params.id);
    if (!con) res.status(404).json({ message: 'Not found' });
    else res.json(con);
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.post = async (req, res) => {
  try {
    const { performer, genre, price, day, image } = sanitize(req.body);
    const newConcert = new Concert({ performer: performer, genre: genre, price: price, day: day, image: image });
    await newConcert.save();
    res.json({ message: 'OK' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

exports.update = async (req, res) => {
  const { performer, genre, price, day, image } = sanitize(req.body);

  try {
    const con = await Concert.findById(req.params.id);
    if (con) {
      await Concert.updateOne({ _id: req.params.id }, { $set: { performer: performer, genre: genre, price: price, day: day, image: image } });
      res.json({ message: 'Document edited', con });
    } else res.status(404).json({ message: 'Not found...' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};
exports.delete = async (req, res) => {
  try {
    const con = await Concert.findById(req.params.id);
    if (con) {
      await Concert.deleteOne({ _id: req.params.id });
      res.json({ message: 'Deleted', con });
    } else res.status(404).json({ message: 'Not found...' });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};