export function request(ctx) {
    const { input } = ctx.args;
    return {
      resourcePath: "/knowledgebases/GU7YELUG8L/retrieve",
      method: "POST",
      params: {
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          retrievalQuery: {
            text: input,
          },
        }),
      },
    };
  }
  
  export function response(ctx) {
    return JSON.stringify(ctx.result.body);
  }