import {Router} from "express";

import {AuthMiddleware} from "@middlewares/AuthMiddleware";

import {CommunicationsController} from "@controllers/CommunicationsController";

export const CommunicationRouter = Router();

CommunicationRouter.get("/getProcess", AuthMiddleware, CommunicationsController.getProcesses);
CommunicationRouter.put("/editProcess/:processId", AuthMiddleware, CommunicationsController.updateProcess);

CommunicationRouter.post("/add", AuthMiddleware, CommunicationsController.addContact);
CommunicationRouter.get("/", AuthMiddleware, CommunicationsController.getContacts);
CommunicationRouter.put("/edit/:contactId", AuthMiddleware, CommunicationsController.updateContact);
CommunicationRouter.delete("/remove/:contactId", AuthMiddleware, CommunicationsController.removeContact);
