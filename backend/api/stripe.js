"use strict";
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { domain } = require("../../configs/dashboardConfig.js");
const { Router } = require("express");
const app = Router();
module.exports = () => {
    app.get('/stripe/test', async (req, res) => {
        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price_data: {
                        currency: "pln",
                        product_data: {
                            name: "Item",
                            images: ["https://i.imgur.com/EHyR2nP.png"],
                        },
                        unit_amount: 500,
                    },
                    quantity: 1,
                },
                {
                    price_data: {
                        currency: "pln",
                        product_data: {
                            name: "Opłata za transport",
                        },
                        unit_amount: 1699,
                    },
                    quantity: 1,
                }
            ],
            mode: "payment",
            allow_promotion_codes: true,
            success_url: domain+"/api/stripe/success/{CHECKOUT_SESSION_ID}",
            cancel_url: domain+"/api/stripe/cancel/{CHECKOUT_SESSION_ID}",
        });
        res.redirect(session.url);
    });
    app.get('/stripe/success/:id', async (req, res) => {
        const session = await stripe.checkout.sessions.retrieve(req.params.id);
        console.log(session.status);

        res.redirect("/");
    });
    app.get('/stripe/cancel/:id', async (req, res) => {
        const session = await stripe.checkout.sessions.retrieve(req.params.id);
        console.log(session.status);
        res.redirect("/");
    });
    return app;
}