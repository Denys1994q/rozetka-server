import { body } from "express-validator";

export const registerValidation = [
    body("name")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Недостатньо символів")
        .matches(/^[А-Яа-яієїІЄЇ,]*$/u)
        .withMessage("Неправильний формат імені"),

    body("surname")
        .trim()
        .isLength({ min: 2 })
        .withMessage("Недостатньо символів")
        .matches(/^[А-Яа-яієїІЄЇ,]*$/u)
        .withMessage("Неправильний формат прізвища"),

    body("phone")
        .trim()
        .isLength({ min: 10 })
        .withMessage("Недостатньо символів")
        .matches(/^((0|380)+(97|95|67|50|63|68|91|92|98|99)\d{3}\d{2}\d{2})+$/)
        .withMessage("Неправильний формат телефону"),

    body("email").trim().isEmail().withMessage("Неправильний формат пошти").isLength({ min: 2 }),

    body("password")
        .trim()
        .isLength({ min: 6 })
        .withMessage("Недостатньо символів")
        .matches(/^[a-zA-Z0-9 ]*$/)
        .withMessage("Пароль має містити лише латинські літери")
        .custom((value, { req }) => {
            if (value === req.body.email || value === req.body.name) {
                throw new Error("Пароль не може бути таким же, як пошта або ім'я користувача");
            }
            return true;
        })
        .matches(/(?=.*[0-9])/)
        .withMessage("Пароль має містити хоча б одну цифру")
        .matches(/(?=.*[A-Z])/)
        .withMessage("Пароль має містити хоча б одну велику літеру"),
];

export const loginValidation = [
    body("email")
        .if(body("email").exists())
        .trim()
        .isEmail()
        .withMessage("Неправильний формат пошти")
        .isLength({ min: 2 })
        .withMessage("Недостатньо символів"),

    body("phone")
        .if(body("phone").exists())
        .trim()
        .isLength({ min: 10 })
        .withMessage("Недостатньо символів")
        .matches(/^((0|380)+(97|95|67|50|63|68|91|92|98|99)\d{3}\d{2}\d{2})+$/)
        .withMessage("Неправильний формат телефону"),

    body("password", "Недостатньо символів").isLength({ min: 1 }),
];
