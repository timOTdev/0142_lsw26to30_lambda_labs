const express = require('express');

const router = express.Router();
const responseStatus = require('./responseStatus');

router.get('/', async (req, res) => {
  try {
    const refreshr = await db('refreshr');
    res.status(responseStatus.success).json(refreshr);
  } catch (err) {
    res.status(responseStatus.serverError).json('Error');
  }
});

router.post('/', async (req, res) => {
  try {
    const ids = await db('refreshr').insert(req.body);
    res.status(responseStatus.postCreated).json(`Added new log with ID ${ids}`);
  } catch (error) {
    if (error.errno === 19) {
      res
        .status(responseStatus.badRequest)
        .json("You haven't entered the required information.");
    } else {
      res.status(responseStatus.serverError).json(error);
    }
  }
});

module.exports = router;
