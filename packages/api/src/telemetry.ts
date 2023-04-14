import process from 'process';

import { NodeSDK } from '@opentelemetry/sdk-node';
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { FastifyInstrumentation } from '@opentelemetry/instrumentation-fastify';
import { PrismaInstrumentation } from '@prisma/instrumentation';

import { environment, isProduction } from './env';
import { GraphQLInstrumentation } from '@opentelemetry/instrumentation-graphql';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAMESPACE]: 'automa',
    [SemanticResourceAttributes.SERVICE_NAME]: 'api',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
  }),
  spanProcessor: isProduction
    ? new BatchSpanProcessor(new ConsoleSpanExporter())
    : new SimpleSpanProcessor(new ConsoleSpanExporter()),
  instrumentations: [
    new PrismaInstrumentation({ middleware: true }),
    new FastifyInstrumentation(),
    new GraphQLInstrumentation(),
  ],
});

sdk.start();

process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(
      () => console.log('Telemetry shut down successfully'),
      () => console.log('Telemetry shut down failed'),
    )
    .finally(() => {
      process.exit(0);
    });
});
