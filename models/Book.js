import mongoose from "mongoose";

const bookSchema = new mongoose.Schema({
    bookname:{
        type: String,
        required: true
    },
    title:{
        type: String,
        required: true
    },
    image:{
        type: String,
        require: true
    },
    rating:{
        type: Number,
        required: true,
        min:1,
        max:5
    },
    caption:{
        type: String,
        required: true
    },
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
    
},{
    timestamps: true
})


const Book = mongoose.model("Book",bookSchema);

export default  Book;