import type { NextApiRequest, NextApiResponse } from "next";
import { rooms } from "../../../cache";

type Data = {
  message: string;
};

export default function message(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const id = `${req.query.id}`;

  if (req.method === "POST") {
    const message = `${req.body.message}`;
    rooms.filter((room) => room.id === id)[0].message = message;
    res.status(201).send({ message });
    return;
  } else if (req.method === "GET") {
    res
      .status(200)
      .json({ message: rooms.filter((room) => room.id === id)[0].message });
    return;
  }
}
