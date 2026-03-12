const express = require('express');
const router = express.Router(); // Create a new router instance

const eventServiceHandler = require("../public/js/eventServiceHandler.js");
var events = eventServiceHandler.mockData.events;

const FireBase = require('../public/js/fireBase.js');
const fireBaseApp = new FireBase();

// Define routes using the router instance
router.get('/events', (req, res) => {
    res.send(events);
});

router.post('/events/:id', (req, res) => {
    const id = Number(req.params.id);
    const event = events.find(event => event.id === id);
    res.send(event);
});

//firebase test
router.get('/events/posttest', async (req, res) => {
    debugger;
    let result = await fireBaseApp.postData_test();
    res.send(result);
    debugger;
})

router.get('/events/gettest', async (req, res) => {
    debugger;
    let result = await fireBaseApp.getData_test();
    res.send(result);
    debugger;
})

module.exports = router; // Export the router