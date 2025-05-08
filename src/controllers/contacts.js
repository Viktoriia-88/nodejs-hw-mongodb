import createHttpError from "http-errors";
import {
    getAllContacts,
    getContactById,
    createContact,
    updateContact,
    deleteContact
} from "../services/contacts.js";
import { parsePaginationParams } from "../utils/parsePaginationParams.js";
import { parseSortParams } from "../utils/parseSortParams.js";
import { parseFilterParams } from "../utils/filters/parseFilterParams.js";
import { saveFileToUploadDir } from "../utils/saveFileToUploadDir.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { getEnvVar } from "../utils/getEnvVar.js";

export const getContactsController = async (req, res) => {
    const { page, perPage } = parsePaginationParams(req.query);
    const { sortBy, sortOrder } = parseSortParams(req.query);
    const filter = parseFilterParams(req.query);

    filter.userId = req.user._id;

    const contacts = await getAllContacts({
        page,
        perPage,
        sortBy,
        sortOrder,
        filter,
    });

    res.json({
        status: 200,
        message: "Successfully found contacts!",
        data: contacts,
    });
};

export const getContactByIdController = async (req, res, next) => {
    const { id } = req.params;
    const userId  = req.user._id;

    const contact = await getContactById(id, userId);

    if (!contact) {
        throw createHttpError(404, "Contact not found");
    }

    res.json({
        status: 200,
        message: `Successfully found contact with id ${id}!`,
        data: contact,
    });
};

export const createContactController = async (req, res) => {
    const userId  = req.user._id;
    const photo = req.file;

    let photoUrl;

    if (photo) {
        if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
        }
    }

    const contact = await createContact({
        ...req.body,
        photo: photoUrl,
        userId
    });

    res.status(201).json({
        status: 201,
        message: "Successfully created a contact!",
        data: contact,
    });
};

export const patchContactController = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;
    const photo = req.file;

    let photoUrl;

    if (photo) {
        if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
            photoUrl = await saveFileToCloudinary(photo);
        } else {
            photoUrl = await saveFileToUploadDir(photo);
        }
    }

    const contact = await updateContact(id, userId, {
        ...req.body,
        photo: photoUrl,
    });

    if (!contact) {
        next(createHttpError(404, "Contact not found"));
        return;
    }

    res.json({
        status: 200,
        message: "Successfully patched a contact!",
        data: contact,
    });
};

export const deleteContactController = async (req, res, next) => {
    const { id } = req.params;
    const userId = req.user._id;

    const contact = await deleteContact(id, userId);

    if (!contact) {
        next(createHttpError(404, "Contact not found"));
        return;
    }

    res.status(204).send();
};
