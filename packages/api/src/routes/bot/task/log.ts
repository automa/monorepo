import { FastifyInstance } from 'fastify';
import { ZodTypeProvider } from 'fastify-type-provider-zod';
import z from 'zod';

export default async function (app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().post(
    '/log',
    {
      schema: {
        body: z.object({
          events: z.array(
            z.object({
              task: z.object({
                id: z.number(),
                token: z.string(),
              }),
              event: z
                .object({
                  type: z.string(),
                  timestamp: z.number(),
                })
                .passthrough(),
            }),
          ),
        }),
      },
    },
    async (request, reply) => {
      const { events } = request.body;

      if (!events || events.length === 0) {
        return reply.code(204).send();
      }

      const payloadJson = JSON.stringify(events);

      await app.prisma.$executeRaw`
        WITH payload AS (
          SELECT
            (e->'task'->>'id')::int AS task_id,
            (e->'task'->>'token') AS token,
            (e->'event')::jsonb AS event
          FROM jsonb_array_elements(${payloadJson}::jsonb) AS e
        ),
        valid AS (
          SELECT p.task_id, p.event
          FROM payload p
          JOIN public.tasks t
            ON t.id = p.task_id
           AND t.token = p.token
        ),
        grouped AS (
          SELECT
            task_id,
            jsonb_agg(event ORDER BY (event->>'timestamp')::numeric) AS events
          FROM valid
          GROUP BY task_id
        )
        UPDATE public.tasks t
        SET log = t.log || g.events
        FROM grouped g
        WHERE t.id = g.task_id;
      `;

      return reply.send();
    },
  );
}
