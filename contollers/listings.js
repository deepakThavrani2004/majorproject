const Listing=require("../models/listing");

module.exports.index=async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  };

  module.exports.renderNewForm=(req, res) => {
    res.render("listings/new.ejs");
  };

  module.exports.showListing=async (req, res) => {
    let { id } = req.params;
    id = id.trim();
    const listing = await Listing.findById(id)
    .populate({path: "reviews", populate: {path: "author"},}).populate("owner");

      
    if(!listing){
      req.flash("error","listing you requested does not exist!");
      return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
  };

  module.exports.createListing=async (req, res ,next) => {
   
    let url=req.file.path;
    let filename=req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner=req.user._id;
    newListing.image={url,filename};
      await newListing.save();
      req.flash("success","new listing created !");
      res.redirect("/listings");
   
  };

  module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    id = id.trim();
    const listing = await Listing.findById(id);
    if(!listing){
      req.flash("error","listing you requested does  not exist!");
      return res.redirect("/listings");
    }
    let originalImageUrl=listing.image.url;
   originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
    res.render("listings/edit.ejs", { listing,originalImageUrl });
  };

  module.exports.updateListing=async (req, res) => {
    if(!req.body.listing){
      throw new ExpressError(400,"send valid data for listing");
    }
    let { id } = req.params;
    id = id.trim();
   
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file!=="undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
      await listing.save();
    }
   req.flash("success","listing updated !"); 
    res.redirect(`/listings/${id}`);
  };

  module.exports.destroyListing=async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted !");
    //console.log(deletedListing);
    res.redirect("/listings");
  };

  module.exports.filter = async(req,res,next)=>{
    // let {q} = req.query;
    let {id} = req.params;
    let allListings = await Listing.find({category: id});
    // console.log(allListing)
    if(allListings.length != 0){
        res.render("listings/index.ejs", { allListings });
    }else{
        req.flash("error","Listings is not here")
        res.redirect("/listings")
    }
}


module.exports.search = async (req, res) => {
  let { title } = req.query;

  const allListings = await Listing.find({ title });
  res.render("./listings/index.ejs", { allListings });
};