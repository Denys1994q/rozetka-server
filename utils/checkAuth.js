import jwt from "jsonwebtoken";

// export default (req, res, next) => {
//     // надсилаємо в запиті через хедери свій токен як клієнта, забираємо з нього слово Bearer
//     const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

//     // якщо токен є, розшифровуємо його
//     if (token) {
//         try {
//             const decoded = jwt.verify(token, "secret123");
//             // зберіг _id з токена (бо ми передавали саме _id в токен) в req.userId
//             req.userId = decoded._id;
//             next();
//         } catch (err) {
//             // статус 403 - немає доступу
//             return res.status(403).json({
//                 message: "Немає доступу",
//             });
//         }
//     } else {
//         return res.status(403).json({
//             message: "Немає доступу",
//         });
//     }
// };

export default (req, res, next) => {
    if (req.user) {
        res.cookie("connect.sid", 's%3Ar60y9HZBk13GKQgm6QXCmXZJy0cW7hFr.OpSn9Q7068jbxsawqxp37wlcLbV9TMzWHzN4jIjQz7M', { sameSite: "none", secure: true });
        next();
    } else {
        // надсилаємо в запиті через хедери свій токен як клієнта, забираємо з нього слово Bearer
        const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

        // якщо токен є, розшифровуємо його
        if (token) {
            try {
                const decoded = jwt.verify(token, "secret123");
                // зберіг _id з токена (бо ми передавали саме _id в токен) в req.userId
                req.userId = decoded._id;
                next();
            } catch (err) {
                // статус 403 - немає доступу
                return res.status(403).json({
                    message: "Немає доступу",
                });
            }
        } else {
            return res.status(403).json({
                message: "Немає доступу",
            });
        }
    }
};
