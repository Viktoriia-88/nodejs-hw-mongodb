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
import { authenticate } from "../middlewares/authenticate.js";

const router = Router();

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));

router.get('/:id', isValidId, ctrlWrapper(getContactByIdController));

router.post('/', validateBody(contactAddSchema), ctrlWrapper(createContactController));

router.patch('/:id', isValidId, validateBody(contactUpdateSchema), ctrlWrapper(patchContactController));

router.delete('/:id', isValidId, ctrlWrapper(deleteContactController));

export default router;
