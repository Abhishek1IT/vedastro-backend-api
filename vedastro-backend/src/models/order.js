import mongoose from "mongoose";


const orderItemSchema = new mongoose.Schema({

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },

    name: {
        type: String,
        required: true,
    },

    image: {
        type: String,
    },

    price: {
        type: Number,
        required: true,
    },

    quantity: {
        type: Number,
        required: true,
    },

});


const orderSchema = new mongoose.Schema(
    {

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },


        items: [orderItemSchema],


        shippingAddress: {


            fullName: {
                type: String,
                required: true,
            },


            phone: {
                type: String,
                required: true,
            },


            address: {
                type: String,
                required: true,
            },


            city: String,

            state: String,

            pincode: String,


        },


        subtotal: {
            type: Number,
            required: true,
        },


        shipping: {
            type: Number,
            default: 0,
        },


        total: {
            type: Number,
            required: true,
        },


        paymentMethod: {
            type: String,
            enum: [
                "COD",
                "ONLINE"
            ],
            default: "COD"
        },


        paymentStatus: {
            type: String,
            enum: [
                "PENDING",
                "PAID",
                "FAILED"
            ],
            default: "PENDING"
        },

        orderStatus: {
            type: String,
            enum: [
                "PLACED",
                "CONFIRMED",
                "SHIPPED",
                "DELIVERED",
                "CANCELLED"
            ],
            default: "PLACED"
        },


    },
    {
        timestamps: true
    }
);


export default mongoose.model(
    "Order",
    orderSchema
);