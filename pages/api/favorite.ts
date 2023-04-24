import { NextApiRequest, NextApiResponse } from "next";
import serverAuth from "../../lib/serverAuth";
import { without } from "lodash";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST" && req.method !== "DELETE") {
    return res.status(405).end();
  }

  try {
    if (req.body.type === "POST") {
      const { movieId, currentUser } = req.body;

      // const { currentUser } = await serverAuth(req);

      const existingMovie = await prisma?.movie.findUnique({
        where: {
          id: movieId,
        },
      });

      if (!existingMovie) {
        return res.status(422).json({ error: "Invalid ID" });
      }

      const user = await prisma?.user.update({
        where: {
          email: currentUser.email || "",
        },
        data: {
          favouriteIds: {
            push: movieId,
          },
        },
      });

      return res.status(200).json(user);
    }

    if (req.body.type === "DELETE") {
      // const { currentUser } = await serverAuth(req);

      const { movieId, currentUser } = req.body;

      const existingMovie = await prisma?.movie.findUnique({
        where: {
          id: movieId,
        },
      });

      if (!existingMovie) {
        return res.status(422).json({ error: "Invalid ID" });
      }

      const updatedFavoriteIds = without(currentUser.favouriteIds, movieId);

      const updateUser = await prisma.user.update({
        where: {
          email: currentUser.email || "",
        },
        data: {
          favouriteIds: updatedFavoriteIds,
        },
      });

      return res.status(200).json(updateUser);
    }
  } catch (error) {
    console.log(error);
    return res.status(400).end();
  }
}
