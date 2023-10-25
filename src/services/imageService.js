import { prisma } from "../../app.js";

export const imageService = {
    getList: async () => {
        return await prisma.images.findMany({
            include: {
                users: {
                    select: {
                        userName: true,
                    },
                },
            },
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
        const data = {
            imageName: dataReq.file.filename,
            imageUrl: dataReq.imageName,
            users_id: dataReq.user.userId,
        };

        return await prisma.images.create({
            data,
        });
    },
};
