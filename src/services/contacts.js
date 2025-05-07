import { SORT_ORDER } from "../constants/index.js";
import { ContactsCollection } from "../db/models/contact.js";
import { calculatePaginationData } from "../utils/calculatePaginationData.js";

export const getAllContacts = async ({
    page = 1,
    perPage = 10,
    sortBy = 'name',
    sortOrder = SORT_ORDER.ASC,
    filter = {},
}) => {
    const limit = perPage;
    const skip = (page - 1) * perPage;

    const contactsQuery = ContactsCollection.find();

    if (filter.userId) {
        contactsQuery.where('userId').eq(filter.userId);
    }

    if (filter.contactType) {
        contactsQuery.where('contactType').eq(filter.contactType);
    }

    if (filter.isFavourite) {
        contactsQuery.where('isFavourite').eq(filter.isFavourite);
    }

    const [contactsCount, contacts] = await Promise.all([
        ContactsCollection
            .find()
            .merge(contactsQuery)
            .countDocuments(),
        contactsQuery
            .skip(skip)
            .limit(limit)
            .sort({ [sortBy]: sortOrder })
            .exec(),
    ]);

    const paginationData = calculatePaginationData(contactsCount, page, perPage);

    return {
        data: contacts,
        ...paginationData,
    };
};

export const getContactById = async (id, userId) => {
    const contact = await ContactsCollection.findOne({_id: id, userId});
    return contact;
};

export const createContact = async (payload) => {
    const contact = await ContactsCollection.create(payload);
    return contact;
};

export const updateContact = async (id, userId, payload, options = {}) => {
    const rawResult = await ContactsCollection.findOneAndUpdate({ _id: id, userId }, payload, {
        new: true,
        includeResultMetadata: true,
        ...options,
    },
    );

    if (!rawResult || !rawResult.value) return null;
    return rawResult.value;
};

export const deleteContact = async (id, userId) => {
    const contact = await ContactsCollection.findOneAndDelete({ _id: id, userId });
    return contact;
};
