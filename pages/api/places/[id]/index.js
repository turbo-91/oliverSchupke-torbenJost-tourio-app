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
    if (!place) {
      return response.status(404).json({ status: "Not Found" });
    }
    response.status(200).json(place);
  }
  if (request.method === "PUT") {
    const updatedPlace = request.body;
    const placeToUpdate = await Place.findByIdAndUpdate(id, updatedPlace);

    response.status(200).json({ status: "Product succesfully updated." });
  }
  if (request.method === "DELETE") {
    await Place.findByIdAndDelete(id);

    response.status(200).json({ status: "Product successfully deleted." });
  }
}
