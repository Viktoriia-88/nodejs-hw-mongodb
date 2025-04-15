import { ContactsCollection } from "../db/models/contact.js";

export const getAllContacts = async () => {
    const contacts = await ContactsCollection.find();
    return contacts;
};

export const getContactById = async (id) => {
    const contact = await ContactsCollection.findOne({_id: id});
    return contact;
};

export const createContact = async (payload) => {
    const contact = await ContactsCollection.create(payload);
    return contact;
};

export const updateContact = async (id, payload, options = {}) => {
    const rawResult = await ContactsCollection.findOneAndUpdate({ _id: id }, payload, {
        new: true,
        includeResultMetadata: true,
        ...options,
    },
    );

    if (!rawResult || !rawResult.value) return null;

    return rawResult.value;
};

export const deleteContact = async (id) => {
    const contact = await ContactsCollection.findOneAndDelete({ _id: id });
    return contact;
};
