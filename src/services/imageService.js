import { prisma } from "../../app.js";
import { helper } from "../helpers/helper.js";

export const imageService = {
    getList: async () => {
        const listImage = await prisma.images.findMany({
            include: {
                users: {
                    select: {
                        userName: true,
                    },
                },
            },
        });
        return listImage.map((item) => {
            return { ...item, saved: 0 };
        });
    },

    search: async (searchText) => {
        return await prisma.images.findMany({
            include: {
                users: {
                    select: {
                        userName: true,
                    },
                },
            },
            where: {
                imageName: {
                    contains: searchText,
                },
            },
        });
    },

    getImageInfo: async (imageId) => {
        const imageExist = await prisma.images.findFirst({
            include: {
                users: {
                    select: {
                        userName: true,
                    },
                },
            },
            where: {
                imageId,
            },
        });

        if (!imageExist) throw Object.assign(new Error("Image Not Found"), { status: 404 });

        return imageExist;
    },

    createComment: async (dataReq) => {
        const data = {
            content: dataReq.content,
            users_id: dataReq.user.userId,
            images_id: dataReq.imageId,
        };

        return await prisma.comments.create({ data });
    },

    getComment: async (imageId) => {
        return await prisma.comments.findMany({
            where: {
                images_id: imageId,
            },
            include: {
                users: {
                    select: {
                        userName: true,
                    },
                },
            },
        });
    },

    saveAndUnSave: async (dataReq) => {
        const imageExist = await prisma.images.findFirst({ where: { imageId: dataReq.imageId } });
        if (!imageExist) throw Object.assign(new Error("Image Not Found"), { status: 404 });

        const savedExist = await prisma.saved.findFirst({
            where: {
                AND: {
                    images_id: dataReq.imageId,
                    users_id: dataReq.user.userId,
                },
            },
        });

        // nếu đã tồn tại => save hoặc unsave
        if (savedExist) {
            return await prisma.saved.update({
                where: {
                    users_id_images_id: {
                        images_id: dataReq.imageId,
                        users_id: dataReq.user.userId,
                    },
                },
                data: { isSaved: savedExist.isSaved === 1 ? 0 : 1 },
            });
        }

        // nếu chưa tồn tại => tạo mới (default = save)
        if (!savedExist) {
            const data = {
                isSaved: 1,
                users_id: dataReq.user.userId,
                images_id: dataReq.imageId,
            };
            return await prisma.saved.create({ data });
        }
    },

    getSave: async (dataReq) => {
        const imageExist = await prisma.images.findFirst({ where: { imageId: dataReq.imageId } });
        if (!imageExist) throw Object.assign(new Error("Image Not Found"), { status: 404 });

        const savedExist = await prisma.saved.findFirst({
            where: {
                AND: {
                    images_id: dataReq.imageId,
                    users_id: dataReq.user.userId,
                },
            },
        });

        return savedExist;
    },

    deleteImage: async (dataReq) => {
        return await prisma.images.delete({
            where: {
                imageId: dataReq.imageId,
                users_id: dataReq.user.userId,
            },
        });
    },

    createImage: async (dataReq) => {
        const fileName = helper.saveImage(dataReq.file);

        const data = {
            imageName: dataReq.imageName,
            imageUrl: fileName,
            users_id: dataReq.user.userId,
        };

        return await prisma.images.create({
            data,
        });
    },

    getListSaved: async (user) => {
        const list = await prisma.images.findMany({
            include: {
                users: {
                    select: {
                        userName: true,
                    },
                },
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
};
