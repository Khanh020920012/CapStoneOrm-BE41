import { helper } from "../helpers/helper.js";

export const middleware = {
    errorHandle: (err, req, res, next) => {
        const statusCode = err.status || 500;

        res.status(statusCode).json({
            message: err.message,
            data: null,
            links: {
                docs: "https://doc.com/api",
            },
        });
    },

    protect: (req, res, next) => {
        const accessToken = req.headers.authorization;
        
        if (!accessToken || !accessToken.startsWith("Bearer ")) return helper.responses(res, 400, "Not enough permissions");

        const token = accessToken.split(" ")[1];
        if (!token || token === "null") return helper.responses(res, 400, "Not enough permissions");

        const decodedToken = helper.verifyJwt(token);
        if (!decodedToken) return helper.responses(res, 400, "Not enough permissions");

        req.user = decodedToken;

        next();
    },

    checkLoginRequest: (req, res, next) => {
        if (!req.body.userName) return helper.responses(res, 400, "Invalid username");

        if (!req.body.password) return helper.responses(res, 400, "Invalid password");

        next();
    },

    checkRegisterRequest: (req, res, next) => {
        if (!req.body.userName) return helper.responses(res, 400, "Invalid userName");
        if (!req.body.password) return helper.responses(res, 400, "Invalid password");
        if (!req.body.email) return helper.responses(res, 400, "Invalid email");
        if (!req.body.phoneNumber) return helper.responses(res, 400, "Invalid phone number");
        if (!req.body.fullName) return helper.responses(res, 400, "Invalid fullname");

        next();
    },

    checkCommentRequest: (req, res, next) => {
        if (!req.body.imageId) return helper.responses(res, 400, "Invalid imageId");
        if (!req.body.content) return helper.responses(res, 400, "Invalid content");

        next();
    },
};
