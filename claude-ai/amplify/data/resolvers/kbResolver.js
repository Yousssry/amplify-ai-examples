export function request(ctx) {
    const { input } = ctx.args;
    return {
      resourcePath: "/retrieve",
      method: "POST",
      params: {
        headers: {
          "Content-Type": "application/json",
          "x-amz-content-sha256": "required" // Added this
        },
        body: JSON.stringify({
          knowledgeBaseId: "GU7YELUG8L",
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