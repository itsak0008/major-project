const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const { isloggedIn, isOwner, validateListing } = require("../middleware.js");

const listingController = require("../controller/listing.js");
const multer = require('multer')
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })


router
    .route("/")
    .get(wrapAsync(listingController.index))
    .post(isloggedIn,
        upload.single('listing[image]'),
        wrapAsync(listingController.createlisting));

router.get("/new", isloggedIn, listingController.randerNewForm);

router
    .route("/:id")
    .get(wrapAsync(listingController.showlisting))
    .put(isloggedIn,
        isOwner,
        upload.single('listing[image]'),
        validateListing,
        wrapAsync(listingController.routeupdateform))
    .delete(isloggedIn, isOwner, wrapAsync(listingController.distroyroute));

// edit route
router.get("/:id/edit", isloggedIn, isOwner, wrapAsync(listingController.routeEditForm));

module.exports = router;