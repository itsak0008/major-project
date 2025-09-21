const Listing = require("../models/listing")

module.exports.index = async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index", { allListings });
};

module.exports.randerNewForm = (req, res) => {
    res.render("listings/new.ejs");
}

module.exports.showlisting = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id)
        .populate("owner")
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        });
    if (!listing) {
        req.flash("error", "The listing you are trying to access is deleted");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show", { listing });
};


module.exports.createlisting = async (req, res) => {
    let url = req.file.path;
    let filename = req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image = { url, filename };
    await newlisting.save();
    req.flash("success", "New listing created!");
    res.redirect("/Listings");
};

module.exports.routeEditForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "The listing you are trying to access is deleted");
        return res.redirect("/listings");
    }
    let originalimageurl = listing.image.url;
    originalimageurl = originalimageurl.replace("/upload", "/upload/h_300,w_250");
    res.render("listings/edit.ejs", { listing, originalimageurl });
};
// module.exports.routeEditForm = async (req, res) => {
//     let { id } = req.params;
//     let listing = await Listing.findById(id);
//     if (!listing) {
//         req.flash("error", "The listing you are trying to access is deleted");
//         return res.redirect("/Listings");
//     }
//     let originalimageurl = "";
//     if (listing.image && listing.image.url) {
//         originalimageurl = listing.image.url.replace("/upload", "/upload/h_300,w_250");
//     }
//     res.render("listings/edit", { listing, originalimageurl });
// };

module.exports.routeupdateform = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if (typeof req.file !== "undefined") {
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { url, filename };
        await listing.save();
        req.flash("success", "listing updated");
        res.redirect(`/Listings/${id}`);
    }
};

module.exports.distroyroute = async (req, res) => {
    let { id } = req.params;
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    req.flash("success", "Listing deleted");
    res.redirect("/Listings");
};