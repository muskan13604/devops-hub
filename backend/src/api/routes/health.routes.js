const { Router } = require('express');
const { getDatabase } = require('../../database/mongoClient');
const { asyncHandler } = require('../../shared/utils/asyncHandler');

const router = Router();

router.get('/', asyncHandler(async (req, res) => {
  await getDatabase().command({ ping: 1 });
  res.status(200).json({ status: 'ok' });
}));

module.exports = router;
