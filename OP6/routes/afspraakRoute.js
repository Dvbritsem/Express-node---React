const express = require('express');
const router = express.Router();
const Afspraak = require('../modules/afspraakModule');

//Middleware for router//
router.use('/:afspraakId', async (req, res, next) => {
        let acceptType = req.get("Accept");

        if (acceptType = "application/json") {
            res.header("Access-Control-Allow-Origin", "*");
            res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");
            next();
        }
        else {
            res.status(400).send();
        }
    });

//Shows specific afspraak (GET)//
router.get('/:afspraakId', async (req,res) => {
    if (req.accepts('application/json')) {
        try {
            const afspraak = await Afspraak.findById(req.params.afspraakId);

            let afspraakItem = afspraak.toJSON();

            afspraakItem._links = {
                "self": { "href": "http://" + req.headers.host + "/api/afspraak/" + afspraakItem._id },
                "collection": { "href": "http://" + req.headers.host + "/api/afspraken" },
            };

            res.status(200).json(afspraakItem);
        }
        catch (err) {
            res.status(404).json({ message: err });
        };
    }
    else {
        res.status(400).send();
    }
});

//Delete a 'afspraak' (DELETE)//
router.delete('/:afspraakId', async (req,res) => {
    try {
        const removedAfspraak = await Afspraak.remove({ _id: req.params.afspraakId });
        res.status(204).json(removedAfspraak);
    }
    catch (err) {
        res.status(500).json({ message: err });
    };
});

//Change a 'afspraak' (PUT)//
router.put('/:afspraakId', async (req,res) => {
    try {
        const changedAfspraak = await Afspraak.findById({ _id: req.params.afspraakId });

        if (req.body.name && req.body.description && req.body.owner) {
            changedAfspraak.name = req.body.name;
            changedAfspraak.description = req.body.description;
            changedAfspraak.owner = req.body.owner;

            changedAfspraak.save();

            res.status(200).json(changedAfspraak);
        }
        else {
            res.status(400).json({ message: "No empty fields" });
        } 
    }
    catch (err) {
        res.status(404).json({ message: err });
    };
});

//Options//
router.options('/:afspraakId', async (req,res) => {
    try {
        res.header('Allow', 'GET, DELETE, PUT, OPTIONS');
        res.header('Access-Control-Allow-Methods', 'GET, DELETE, PUT, OPTIONS');
        res.status(200).send();
    }
    catch (err) {
        res.status(500).json({ message: err });
    };
});

router.use('/:afspraakId', async (req, res, next) => {
    console.log("Wrong method!");
    res.status(405).send();
});

module.exports = router;