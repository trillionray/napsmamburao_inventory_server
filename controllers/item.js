const Item = require("../models/Item");

module.exports.createItem = (req, res) => {
  const { itemName, quantity, price, status, by, notes } = req.body;

  const newItem = new Item({
    itemName,
    quantity,
    price,
    status,
    by,
    notes // optional
  });

  return newItem.save()
    .then(savedItem => res.status(201).send(savedItem))
    .catch(err => res.status(500).send(err));
};

// Get All Items
module.exports.getAllItems = (req, res) => {
  Item.find({})
    .populate("by", "_id name email role") // include only the fields you want
    .then((items) => {
      return res.status(200).json(items);
    })
    .catch((err) => {
      return res.status(500).json({ error: err.message });
    });
};


module.exports.updateItemStatus = (req, res) => {
  const { itemId } = req.params;
  const { status, by, notes } = req.body;

  const allowedStatus = ["in", "out", "returned"];
  if (status && !allowedStatus.includes(status)) {
    return res.status(400).send({ error: "Invalid status value" });
  }

  // Build the update object only with fields provided
  const updateFields = {};
  if (status) updateFields.status = status;
  if (by) updateFields.by = by;
  if (notes !== undefined) updateFields.notes = notes;

  return Item.findByIdAndUpdate(itemId, updateFields, { new: true })
    .then((updatedItem) => {
      if (!updatedItem) {
        return res.status(404).send({ error: "Item not found" });
      }
      return res.status(200).send(updatedItem);
    })
    .catch((err) => res.status(500).send(err));
};

