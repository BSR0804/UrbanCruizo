const asyncHandler = require('express-async-handler');
const Caravan = require('../models/Caravan');

// @desc    Fetch all caravans
const getCaravans = asyncHandler(async (req, res) => {
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? {
            title: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};

    const count = await Caravan.countDocuments({ ...keyword });
    const caravans = await Caravan.find({ ...keyword })
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ caravans, page, pages: Math.ceil(count / pageSize) });
});

// @desc    Fetch single caravan
const getCaravanById = asyncHandler(async (req, res) => {
    const caravan = await Caravan.findById(req.params.id);

    if (caravan) {
        res.json(caravan);
    } else {
        res.status(404);
        throw new Error('Caravan not found');
    }
});

// @desc    Create a caravan
const createCaravan = asyncHandler(async (req, res) => {
    const { title, description, pricePerDay, amenities, images, location, packagePrice, duration, city, description1, description2, organizer } = req.body;

    const caravan = new Caravan({
        title,
        description,
        pricePerDay,
        amenities,
        images,
        location,
        packagePrice,
        duration,
        city,
        description1,
        description2,
        organizer
    });

    const createdCaravan = await caravan.save();
    res.status(201).json(createdCaravan);
});

// @desc    Update a caravan
const updateCaravan = asyncHandler(async (req, res) => {
    const { title, description, pricePerDay, amenities, images, location, availability, packagePrice, duration, city, description1, description2, organizer } = req.body;

    const caravan = await Caravan.findById(req.params.id);

    if (caravan) {
        caravan.title = title;
        caravan.description = description;
        caravan.pricePerDay = pricePerDay;
        caravan.amenities = amenities;
        caravan.images = images;
        caravan.location = location;
        caravan.availability = availability;
        caravan.packagePrice = packagePrice;
        caravan.duration = duration;
        caravan.city = city;
        caravan.description1 = description1;
        caravan.description2 = description2;
        caravan.organizer = organizer;

        const updatedCaravan = await caravan.save();
        res.json(updatedCaravan);
    } else {
        res.status(404);
        throw new Error('Caravan not found');
    }
});

// @desc    Delete a caravan
const deleteCaravan = asyncHandler(async (req, res) => {
    const caravan = await Caravan.findById(req.params.id);

    if (caravan) {
        await caravan.deleteOne();
        res.json({ message: 'Caravan removed' });
    } else {
        res.status(404);
        throw new Error('Caravan not found');
    }
});

module.exports = {
    getCaravans,
    getCaravanById,
    createCaravan,
    updateCaravan,
    deleteCaravan,
};
