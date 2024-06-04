import Place from "../../../../db/models/Place.js";
import dbConnect from "../../../../db/dbConnect.js";

export default async function handler(request, response) {
  const { id } = request.query;
  await dbConnect();

  if (!id) {
    return;
  }

  if (request.method === "GET") {
    const place = await Place.findById(id);
    console.log("place in pages/api/[]id/index.js", place);
    if (!place) {
      return response.status(404).json({ status: "Not Found" });
    }
    response.status(200).json(place);
  }
}
