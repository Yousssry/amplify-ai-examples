import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';

const backend = defineBackend({
  auth,
  data,
});

const stack = cdk.Stack.of(backend.data);
const region = stack.region;

const KnowledgeBaseDataSource = 
  backend.data.resources.graphqlApi.addHttpDataSource(
    "KnowledgeBaseDataSource",
    `https://bedrock-runtime.${region}.amazonaws.com`, // Modified URL format
    {
      authorizationConfig: {
        signingRegion: region,
        signingServiceName: "bedrock",
      },
    },
  );

// Add broader permissions for Bedrock
KnowledgeBaseDataSource.grantPrincipal.addToPrincipalPolicy(
  new PolicyStatement({
    resources: [
      `arn:aws:bedrock:${region}:086711206683:knowledge-base/GU7YELUG8L`,
      `arn:aws:bedrock:${region}:086711206683:*` // Add this line for broader access if needed
    ],
    actions: [
      "bedrock:Retrieve",
      "bedrock:InvokeModel" // Add this if you need to invoke Bedrock models
    ],
  }),
);