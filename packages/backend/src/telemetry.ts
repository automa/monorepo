import process from 'process';

import { NodeSDK } from '@opentelemetry/sdk-node';
import { ConsoleSpanExporter } from '@opentelemetry/sdk-trace-base';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { PrismaInstrumentation } from '@prisma/instrumentation';

import { environment, isProduction } from './env';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'automa-api',
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: environment,
  }),
  traceExporter: new ConsoleSpanExporter(),
  instrumentations: [new PrismaInstrumentation({ middleware: true })],
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
