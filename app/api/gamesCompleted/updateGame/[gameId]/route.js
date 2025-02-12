import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import GamesCompleted from "@/models/GamesCompleted";

// @route    POST api/gamesCompleted/updateGame/:gameId
// @desc     Update a game in the game list
// @access   Private
export const POST = async (req, { params }) => {
  const body = await req.json();
  const gameId = params.gameId;

  await dbConnect();

  try {
    // retrieve the user from cookie
    let userId = req.headers.get("userId");
    const user = await User.findById(userId).select("-password");
    // if no user found
    if (!user) {
      return NextResponse.json({ errors: ["User not found"] }, { status: 404 });
    }

    const gameList = await GamesCompleted.findOne({ user: userId });

    // if the game does not exist in the list, return an error
    if (gameList.games.filter((game) => game._id == gameId).length === 0) {
      return NextResponse.json(
        { errors: "Game not found in the list" },
        { status: 404 }
      );
    }

    // find the game to update
    const gameToUpdate = gameList.games.find((game) => game._id == gameId);

    // update the game (Rating & Date)
    gameToUpdate.rating = body.rating || gameToUpdate.rating;
    gameToUpdate.dateCompleted = body.dateCompleted || gameToUpdate.dateCompleted;
    gameToUpdate.currentlyPlaying = body.currentlyPlaying || gameToUpdate.currentlyPlaying;

    // save the game list
    await gameList.save();

    return NextResponse.json({ msg: "Game updated" }, { status: 200 });
  } catch (err) {
    console.error(err.message);
    return NextResponse.json({ errors: ["Server Error"] }, { status: 500 });
  }
};

// CORS preflight request handler
// hope vercel can fix this soon
export async function OPTIONS(request) {
  const origin = request.headers.get("origin");

  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": origin || "*",
      "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
