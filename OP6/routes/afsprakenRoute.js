const express = require('express');
const router = express.Router();
const Afspraak = require('../modules/afspraakModule');
const pagFunctions = require('../modules/paginationFunctions');

//Middleware for router//
router.use('/', async (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

    let acceptType = req.get("Accept");

    if (acceptType == "application/json") {
        next();
    }
    else {
        res.status(400).send();
    }
});

//Shows all 'Afspraken' (GET)//
router.get('/', async (req, res) => {
    if (req.accepts('application/json')) {
        try {
            let limitParam = parseInt(req.query.limit);
            let skipParam = parseInt(req.query.start);

            if (isNaN(limitParam) || isNaN(skipParam)) {
                limit = 0;
                start = 1; 
            }
            else {
                limit = limitParam;
                start = skipParam;
            };

            const total = await Afspraak.find().count();
            const afspraken = await Afspraak.find().limit(limit).skip(start-1);

            let afsprakenCollection = {
                "items": [],
                "_links": {
                    "self": { "href": "http://" + req.headers.host + "/api/afspraken" },
                    "collection": { "href": "http://" + req.headers.host + "/api/afspraken" },
                },
                "pagination": pagFunctions.createPagination(total, start, limit, req)
            }

            for(let afspraak of afspraken) {
                let afspraakItem = afspraak.toJSON();

                afspraakItem._links = {
                    "self": { "href": "http://" + req.headers.host + "/api/afspraak/" + afspraakItem._id },
                    "collection": { "href": "http://" + req.headers.host + "/api/afspraken" },
                };

                afsprakenCollection.items.push(afspraakItem);
            }

            res.status(200).json(afsprakenCollection);
        } 
        catch (err) {
            res.status(500).json({ message: err });
        };
    }
});

//Submits a post (POST)//
router.post('/', async (req, res) => {
    console.log(req.body)

    const post = new Afspraak({
        name: req.body.name,
        description: req.body.description,
        owner: req.body.owner
    });

    if (req.body.name && req.body.description && req.body.owner) {
        if (req.is('application/json') || req.is('application/x-www-form-urlencoded')) {
            try {
                post.save();
                res.status(201).json(post);
            } 
            catch (err) {
                res.status(500).json({ message: err });
            };
        }
        else {
            res.status(400).json({ message: "Use application/json or application/x-www-form-urlencoded"});
        };
    }
    else {
        res.status(400).json({ message: "No empty fields" });
    };
});

//Options//
router.options('/', async (req,res) => {
    try {
        res.header('Allow', 'GET, POST, OPTIONS');
        res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.status(200).send();
    }
    catch (err) {
        res.status(500).json({ message: err });
    };
});

router.use('/', async (req, res, next) => {
    console.log("Wrong method! 1");
    res.status(405).send();
});

module.exports = router;