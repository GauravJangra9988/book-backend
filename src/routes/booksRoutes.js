import express from "express"
import cloudinary from "../../lib/cloudinary.js";
import protectRoute from "../../middleware/auth.middleware.js";
import Book from "../../models/Book.js"




const router = express.Router();



router.post("/", protectRoute ,async(req,res)=>{
    try {
        const {title, caption, rating, image} = req.body;

        if(!image || !caption || !rating || !title) return res.status(400).json({message:"Provide all details"});
    
        const uploadResponse = await cloudinary.uploader.upload(image);
        const imageUrl = uploadResponse.secure_url;

        const newBook = new Book({
            title,
            caption,
            rating,
            image: imageUrl,
            user: req.user._id
            
        })

        await newBook.save();
        res.status(201).json(newBook);
    
    } catch (error) {
        console.log("Error creating book");
        res.status(500).json({message: error.message});
    }
})

router.get("/", protectRoute, async(req, res)=>{
    try {
        
        const page = req.query.page || 1;
        const limit = req.query.limit || 5;
        const skip =  (page - 1) * limit;
        const books = await Book.find().sort({createdAt: -1})
            .skip(skip)
            .limit(limit)
            .populate("user", "username profilePic");

            const totalBooks = await Book.countDocuments();

        res.send({
            books,
            currentPage: page,
            totalBooks: totalBooks,
            totalPages: Math.ceil(totalBooks/limit)
        });
    } catch (error) {
        console.log("Error getting books");
        res.status(500).json({message: "internal server error"});
    }
})

router.delete("/:id", protectRoute, async (req,res)=>{
    try {
        const book = await Book.findById(req.params.id);
        if(!book) return res.status(404).json({message: "book not found"});

        if(book.user.toString() !== req.user._id.toString())
            return res.status(401).json({message: "Unauthorized"});

        await book.deleteOne();
        if(book.image && book.image.includes("cloudinary")){
            try {
                const publicId = book.image.split("/").pop().split(".")[0];
                await cloudinary.uploader.destroy(publicId);
            } catch (deleteError) {
                console.log("Error deleting image");
            }
        }
        
        
        res.json({message: "Book deleted Succesfully"});

    } catch (error) {
        res.status(500).json({message: "internal server error"});
    }
})


router.get("/user",protectRoute, async (req,res)=>{
    try {
        const books = await Book.find({user: req.user._id}).sort({createdAt: -1});
        res.json(books);
    } catch (error) {
        console.error("Get user books error", error.message);
        res.status(500).json({message: "server error"});
    }
})







export default router;