import { PrismaClient } from "@prisma/client";
import { helper } from "../helpers/helper.js";
const prisma = new PrismaClient();

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
        return await prisma.images.findMany({
            where: {
                users_id: user.userId,
            },
        });
    },

    getImagesSaved: async (user) => {
        return await prisma.saved.findMany({
            include: {
                images: true,
            },
            where: {
                AND: {
                    users_id: user.userId,
                    isSaved: 1,
                },
            },
        });
    },
};
