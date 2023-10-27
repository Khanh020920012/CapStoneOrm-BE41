import { helper } from "../helpers/helper.js";
import { prisma } from "../../app.js";

export const userService = {
    login: async (dataReq) => {
        const { userName, password } = dataReq;

        const dataRes = await prisma.users.findFirst({ where: { userName } });
        if (!dataRes) throw Object.assign(new Error("user does not exist"), { status: 400 });

        const isPassword = await helper.checkPassword(password, dataRes.password);
        if (!isPassword) throw Object.assign(new Error("Incorrect password"), { status: 400 });

        delete dataRes.password;

        const token = helper.createJwt(dataRes, "5h");

        return token;
    },

    register: async (dataReq) => {
        dataReq.password = await helper.hashedPassword(dataReq.password);

        const dataRes = await prisma.users.create({ data: dataReq });

        delete dataRes.password;

        return dataRes;
    },

    getUserInfo: async (user) => {
        return await prisma.users.findFirst({
            select: {
                userId: true,
                userName: true,
                fullName: true,
                email: true,
                phoneNumber: true,
            },
            where: {
                userId: user.userId,
            },
        });
    },

    deleteUser: async () => {
        return "deleteUser";
    },

    getImagesCreated: async (user) => {
        const list = await prisma.images.findMany({
            include: {
                users: true,
            },
            where: {
                users_id: user.userId,
            },
        });

        const listSaved = await prisma.saved.findMany({
            where: {
                users_id: user.userId,
                isSaved: 1,
            },
        });

        return list.map((image) => {
            const isSave = listSaved.findIndex((item) => {
                if (image.imageId === item.images_id) return true;
            });
            return {
                ...image,
                saved: isSave !== -1 ? 1 : 0,
            };
        });
    },

    getImagesSaved: async (user) => {
        const result = await prisma.images.findMany({
            include: {
                users: {
                    select: {
                        userName: true,
                    },
                },
            },
            where: {
                saved: {
                    some: {
                        isSaved: 1, // Điều kiện isSaved là 1 trong bảng saved
                        users_id: user.userId,
                    },
                },
            },
        });

        return result.map((item) => {
            return {
                ...item,
                saved: 1,
            };
        });
    },
};
