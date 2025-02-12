const addCompletedGame = {
    type: "object",
    properties: {
      gameName: {
        type: "string",
        minLength: 1, 
        errorMessage: {
          minLength: "Game name is required",
        },
      },
      dateCompleted: {
        type: "string",
        format: "date-time", 
        errorMessage: {
          format: "Invalid date format. Use ISO 8601 (e.g., 2024-02-10T12:00:00Z)",
        },
      },
      rating: {
        type: "number",
        minimum: 1,
        maximum: 10, 
        errorMessage: {
          minimum: "Rating must be at least 1",
          maximum: "Rating cannot be more than 10",
        },
      },
      currentlyPlaying: {
        type: "boolean"
      }
    },
    required: ["gameName"],
    additionalProperties: false,
  };
  
  export default addCompletedGame;
  