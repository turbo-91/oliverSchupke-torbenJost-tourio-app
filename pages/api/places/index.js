import Place from "../../../db/models/Place.js";
import dbConnect from "../../../db/dbConnect.js";

export default async function handler(request, response) {
  await dbConnect();
  if (request.method === "GET") {
    const places = await Place.find();
    if (!places) {
      return response.status(404).json({ status: "Not Found" });
    }
    response.status(200).json(places);
  }
  if (request.method === "POST") {
    Place.create(request.body);
    return response
      .status(200)
      .json({ success: true, status: "Place created" });
  }
}
