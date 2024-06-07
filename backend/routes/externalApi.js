const express = require('express');
const incomingEmitEvent = require('../controller/externalApi.js/IncomingEmitEvents');
const router = express.Router();


router.post('/emit-event/incoming', incomingEmitEvent);

module.exports = router;