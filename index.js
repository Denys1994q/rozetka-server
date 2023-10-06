import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { UserController } from "./controllers/index.js";
import { registerValidation, loginValidation } from "./validation/validation.js";
import { handleValidationErrors, checkAuth } from "./utils/index.js";
import passport from "./passport.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import CategoryModel from "./models/Category.js";
import ProductModel from "./models/Product.js";

function isLoggedIn(req, res, next) {
    req.user ? next() : res.sendStatus(401);
}

const app = express();
app.use(
    session({
        secret: "cats",
        resave: false,
        saveUninitialized: true,
    })
);
app.use(passport.initialize());
app.use(passport.session());
dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use('/assets', express.static('assets'));

const corsOptions = {
    origin: "https://rozetka-server.onrender.com", 
    credentials: true
};

app.use(cors(corsOptions));

mongoose
    .connect(
        `mongodb+srv://${process.env.MONGODB_KEY}@cluster0.l8hygki.mongodb.net/rozetka?retryWrites=true&w=majority`
    )
    .then(() => console.log("DB Ok"))
    .catch(err => console.log("ERROR", err));

app.post("/auth/register", registerValidation, handleValidationErrors, UserController.register);
app.post("/auth/login", loginValidation, handleValidationErrors, UserController.login);
app.get("/auth/me", checkAuth, UserController.getMe);
app.put("/auth/update", checkAuth, UserController.updateUser);
app.delete("/auth/delete", checkAuth, UserController.deleteUser);

// авторизація через гугл
app.get("/auth/google", passport.authenticate("google", { scope: ["email", "profile"] }));
app.get(
    "/google/callback",
    (req, res, next) => {
      passport.authenticate("google", (err, user, info) => {
        if (err) {
          return res.status(500).json({ message: "Помилка сервера" });
        }
        if (!user) {
          return res.status(401).json({ message: "Не вдалося авторизуватися" });
        }
        // Успішна авторизація
        req.logIn(user, err => {
          if (err) {
            return res.status(500).json({ message: "Помилка сервера" });
          }
          res.send('<script>window.opener.postMessage("authSuccess", "http://localhost:4200");</script>');
        });
      })(req, res, next);
    }
  );
  
app.get("/auth/logout", (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        res.json({ message: "Дані видалено" });
    });
});
app.get("/auth/failure", (req, res) => {
    res.send("something went wrong");
});
// авторизація через фейсбук
app.get("/auth/facebook", passport.authenticate("facebook"));
app.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
        successRedirect: "http://localhost:4200",
        failureRedirect: "auth/failure",
    })
);

// всі категорії (без продуктів)
app.get("/categories", async (req, res) => {
    try {
        const categories = await CategoryModel.find().lean();
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Помилка сервера" });
    }
});

// одна категорія
app.get("/categories/:id", async (req, res) => {
    try {
        const categoryId = req.params.id;
        const category = await CategoryModel.findOne({ id: categoryId }).lean();
        if (!category) {
            return res.status(404).json({ message: "Категорію не знайдено" });
        }
        res.json(category);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Помилка сервера" });
    }
});

// всі продукти
app.get("/products", async (req, res) => {
    try {
        const products = await ProductModel.find();
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Помилка сервера" });
    }
});

// один продукт
app.get("/products/:id", async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ message: "Недійсний ObjectId" });
        }
        const product = await ProductModel.findOne({ _id: req.params.id });
        if (!product) {
            return res.status(404).json({ message: "Продукт не знайдено" });
        }
        res.json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Помилка сервера" });
    }
});

// запуск сервера
app.listen(4444, err => {
    if (err) {
        return console.log(err);
    }
    console.log("Server OK");
});
