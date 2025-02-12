const addFutureGame = {
    type: "object",
    properties: {
      gameName: {
        type: "string",
        minLength: 1, 
        errorMessage: {
          minLength: "Game name is required",
        },
      }
    },
    required: ["gameName"],
    additionalProperties: false,
  };
  
  export default addFutureGame;
  