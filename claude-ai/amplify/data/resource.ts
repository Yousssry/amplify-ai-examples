import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({

  chat: a.conversation({
    aiModel: a.ai.model("Claude 3 Sonnet"),
    systemPrompt: `You are a helpful assistant. You utilize your knowledge base to get all your information from.`,
    tools: [
      a.ai.dataTool({
        name: 'searchDocumentation',
        description: 'This is your knowledge base that you get all your information from.',
        query: a.ref('knowledgeBase'),
      }),
    ]
  })
    .authorization((allow) => allow.owner()),

  chatNamer: a
    .generation({
      aiModel: a.ai.model("Claude 3 Sonnet"),
      systemPrompt: `You are a helpful assistant that writes descriptive names for conversations. Names should be 2-10 words long`,
    })
    .arguments({
      content: a.string(),
    })
    .returns(
      a.customType({
        name: a.string(),
      })
    )
    .authorization((allow) => [allow.authenticated()]),

    knowledgeBase: a
    .query()
    .arguments({ input: a.string() })
    .handler(
      a.handler.custom({
        dataSource: "KnowledgeBaseDataSource",
        entry: "./resolvers/kbResolver.js",
      }),
    )
    .returns(a.string())
    .authorization((allow) => allow.authenticated()),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
