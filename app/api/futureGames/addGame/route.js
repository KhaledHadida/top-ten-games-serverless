import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import FutureGames from "@/models/FutureGames";
import ajv from "@lib/customAjvKeyword";
import addFutureGame from "@schemas/addFutureGame";
const validate = ajv.compile(addFutureGame);
import { getCoverImg } from "@/lib/igdb";

// @route    POST api/futureGames/addGame
// @desc     Add a game to the completed game list
// @access   Private
export const POST = async (req) => {
  const body = await req.json();

  // validation against API using schema
  const valid = validate(body);
  if (!valid) {
    return NextResponse.json({ errors: validate.errors }, { status: 400 });
  }

  await dbConnect();

  try {
    // retrieve the user from cookie
    let userId = req.headers.get("userId");

    const user = await User.findById(userId).select("-password");

    // if no user found
    if (!user) {
      return NextResponse.json({ errors: ["User not found"] }, { status: 404 });
    }

    const gameList = await FutureGames.findOne({ user: userId });

    // if the game already exists in the list, return an error
    if (
      gameList.games.filter(
        (game) => game.name.toLowerCase() === body.gameName.toLowerCase()
      ).length > 0
    ) {
      return NextResponse.json(
        { errors: ["Game already in the list"] },
        { status: 400 }
      );
    }

    // if the gameList already has 25 games is what we set it for now, return an error
    if (gameList.games.length >= 25) {
      return NextResponse.json(
        { errors: ["You have reached max limit of 25 games."] },
        { status: 400 }
      );
    }

    // fetch the game cover image URL
    const coverImageUrl = await getCoverImg(body.gameName);

    // make name first letter uppercase in every word and the rest lowercase
    const gameName = body.gameName
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");

    // add the game to the game list
    // rank is automatically added based on the number of games in the list, so it will always be the last one
    const newGame = {
      name: gameName,
      gameCoverURL: coverImageUrl,
    };

    gameList.games.push(newGame);

    // save the game list
    await gameList.save();

    return NextResponse.json(gameList.games);
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
