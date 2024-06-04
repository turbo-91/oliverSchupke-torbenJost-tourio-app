import dbConnect from "../../../../db/dbConnect";
import Place from "../../../../db/models/Place";
import Comment from "../../../../db/models/Comment";

export default async function handler(request, response) {
  const { id } = request.query;
  await dbConnect();

  if (request.method === "POST") {
    const { comment, name } = request.body;

    if (!comment || !name) {
      return response.status(400).json({ error: "Missing required fields" });
    }

    const newComment = await Comment.create({ name, comment });

    try {
      const place = await Place.findByIdAndUpdate(
        id,
        { $push: { comments: newComment._id } },
        { new: true, useFindAndModify: false }
      ).populate("comments");
      if (!place) {
        return response.status(404).json({ error: "Place not found" });
      }
      place.comments.push({ name, comment });
      await place.save();
      response.status(201).json(place);
    } catch (error) {
      console.error(error);
      response.status(500).json({ error: "Internal Server Error" });
    }
  }
}
