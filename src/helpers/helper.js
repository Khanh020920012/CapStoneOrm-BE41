import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";

export const helper = {
    responses: (res, code, data, links) => {
        let message = "processed successfully";
        if (`${code}`.startsWith("4")) message = "fail";
        if (`${code}`.startsWith("5")) message = "error";
        if (!links) links = { docs: "https://doc.com/api" };

        const result = {
            message,
            data,
            links,
        };

        res.status(code).json(result);
    },

    hashedPassword: async (password) => {
        const salt = await bcryptjs.genSalt(10);

        return await bcryptjs.hash(password, salt);
    },

    checkPassword: async (userInputPassword, hashedPasswordFromDatabase) => {
        return await bcryptjs.compare(userInputPassword, hashedPasswordFromDatabase);
    },

    createJwt: (payload, expiresIn) => {
        const secret = process.env.SECRET;

        if (!secret) return undefined;

        const token = jwt.sign(payload, secret, { expiresIn });

        return token;
    },

    verifyJwt: (accessToken) => {
        const secret = process.env.SECRET;

        const decodedToken = jwt.verify(accessToken, secret);

        return decodedToken;
    },
};
