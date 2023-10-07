import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserModel from "../models/User.js";

export const register = async (req, res) => {
    try {
        const existingUser = await UserModel.findOne({
            $or: [{ email: req.body.email }, { phone: req.body.phone }],
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Користувач з такою поштою або номером телефону вже зареєстрований",
            });
        }

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const doc = new UserModel({
            name: req.body.name,
            surname: req.body.surname,
            phone: req.body.phone,
            email: req.body.email,
            passwordHash: hash,
        });
        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secret123",
            {
                expiresIn: "30d",
            }
        );

        const { passwordHash, ...userData } = user._doc;

        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не вдалося зареєструватися",
        });
    }
};

export const login = async (req, res) => {
    try {
        // перевіряємо чи є такий користувач у базі даних
        const user = await UserModel.findOne({
            $or: [{ email: req.body.email }, { phone: req.body.phone }],
        });
        // якщо немає, відразу даємо помилку
        if (!user) {
            return res.status(404).json({
                message: "Користувача не знайдено",
            });
        }
        // якщо користувач знайдений, перевіряємо чи правильний пароль (bcrypt для порівняння звичайного паролю і захешованого з бази даних)
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPass) {
            return res.status(400).json({
                message: "Неправильний пароль",
            });
        }
        // якщо все ок, створюємо новий токен. Ми тут його теж маємо передати на клієнт
        const token = jwt.sign(
            {
                _id: user._id,
            },
            "secret123",
            {
                expiresIn: "30d",
            }
        );
        // повертаємо дані просто без пароля
        const { passwordHash, ...userData } = user._doc;

        // повертаємо інформацію про юзера
        res.json({
            ...userData,
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Не вдалося авторизуватися",
        });
    }
};

export const getMe = async (req, res) => {
    try {
        if (req.user) {
            const userId = req.user._id;
            // res.send(req.user);
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({
                    message: "Користувача не знайдено",
                });
            }
            res.json(user);
        } else {
            const user = await UserModel.findById(req.userId);
            if (!user) {
                return res.status(404).json({
                    message: "Користувача не знайдено",
                });
            }

            const { passwordHash, ...userData } = user._doc;
            res.json(userData);
        }
    } catch (err) {
        console.log(err);
    }
};

// UserController.js
const updateUser = async (req, res) => {
    try {
        const updatedUserData = req.body; // Отримати нові дані користувача з тіла запиту
        if (req.user) {
            const userId = req.user._id; // Отримати ідентифікатор користувача з авторизованого запиту
            // Оновити дані користувача в базі даних
            await UserModel.findByIdAndUpdate(userId, updatedUserData);
            // Отримати оновлені дані користувача з бази даних (необов'язково)
            const updatedUser = await UserModel.findById(userId);
            res.json(updatedUser); // Відправити оновлені дані користувача відповідь
        } else {
            await UserModel.findByIdAndUpdate(req.userId, updatedUserData);
            // Отримати оновлені дані користувача з бази даних (необов'язково)
            const updatedUser = await UserModel.findById(req.userId);
            res.json(updatedUser); // Відправити оновлені дані користувача відповідь
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Помилка сервера" });
    }
};

const deleteUser = async (req, res) => {
    try {
        if (req.user) {
            const userId = req.user._id
            await UserModel.findByIdAndDelete(userId);
            res.json({ message: "Користувач видалений успішно" });
        } else {
            await UserModel.findByIdAndDelete(req.userId);
            res.json({ message: "Користувач видалений успішно" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Помилка сервера" });
    }
};

export { updateUser, deleteUser };
