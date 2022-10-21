import type { NextApiRequest, NextApiResponse } from "next";
import { rooms } from "../../../cache";

type Data = {
  id: string;
};

type Error = {
  message: string;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data | Error>
) {
  if (typeof req.query.id !== typeof "") {
    res.status(500).send({ message: "Id is not a string" });
    return;
  }

  const id = `${req.query.id}`;

  if (req.method === "POST") {
    if (rooms.map((room) => room.id).includes(id)) {
      res.status(400).send({ message: "room with same id already exist" });
      return;
    }
    rooms.push({ id, message: "" });
    res.status(201).send({ id });
    return;
  } else if (req.method === "GET") {
    res
      .status(200)
      .json({ message: rooms.filter((room) => room.id === id)[0].message });
    return;
  } else {
    res
      .status(405)
      .send({ message: `Method ${req.method} is not allowed here` });
    return;
  }
}
