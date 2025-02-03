import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({

    
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

  chat: a.conversation({
    aiModel: a.ai.model("Claude 3.5 Sonnet"),
    systemPrompt: `You are a helpful assistant`,
    tools: [
      a.ai.dataTool({
        name: 'searchDocumentation',
        description: 'Performs a similarity search over the documentation for ...',
        query: a.ref('knowledgeBase'),
      }),
    ]
  })
    .authorization((allow) => allow.owner()),

  chatNamer: a
    .generation({
      aiModel: a.ai.model("Claude 3.5 Sonnet"),
      systemPrompt: `You are a helpful assistant that writes descriptive names for conversations. Names should be 2-10 words long`,
      tools: [
        a.ai.dataTool({
          name: 'searchDocumentation',
          description: 'Performs a similarity search over the documentation for ...',
          query: a.ref('knowledgeBase'),
        }),
      ]
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
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
