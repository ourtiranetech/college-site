import { httpRouter } from "convex/server";
import { auth } from "./auth"; // Assurez-vous d'avoir un fichier auth.ts configuré

const http = httpRouter();

auth.addHttpRoutes(http);

export default http;