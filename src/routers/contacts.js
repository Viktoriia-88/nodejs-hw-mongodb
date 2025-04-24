import { Router } from "express";
import { ctrlWrapper } from "../utils/ctrlWrapper.js";
import {
    createContactController,
    deleteContactController,
    getContactByIdController,
    getContactsController,
    patchContactController
} from "../controllers/contacts.js";
import { validateBody } from "../middlewares/validateBody.js";
import { contactAddSchema, contactUpdateSchema } from "../validation/contacts.js";
import { isValidId } from "../middlewares/isValidId.js";

const router = Router();

router.get('/contacts', ctrlWrapper(getContactsController));

router.get('/contacts/:id', isValidId, ctrlWrapper(getContactByIdController));

router.post('/contacts', validateBody(contactAddSchema), ctrlWrapper(createContactController));

router.patch('/contacts/:id', isValidId, validateBody(contactUpdateSchema), ctrlWrapper(patchContactController));

router.delete('/contacts/:id', isValidId, ctrlWrapper(deleteContactController));

export default router;
