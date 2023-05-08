import { Static, Type } from '@sinclair/typebox';
import envSchema from 'env-schema';

export const environment = process.env.NODE_ENV || 'development';

export const isProduction = environment === 'production';

const schema = Type.Object({
  API_URI: Type.String({
    default: 'http://localhost:8080',
  }),
  CLIENT_URI: Type.String({
    default: 'http://localhost:3000',
  }),
  COOKIE_SECRET: Type.String({
    default: 'thisismycoupdetathandsupupgethigh',
  }),
  CORS_ORIGIN: Type.String({
    default: 'http://localhost:3000',
  }),
  DATABASE_URL: Type.String({
    default: 'postgresql://automa@localhost:5432/automa',
  }),
  GITHUB_APP: Type.Object(
    {
      ACCESS_TOKEN_URL: Type.String({
        default: 'https://github.com/login/oauth/access_token',
      }),
      API_URI: Type.String({
        default: 'https://api.github.com',
      }),
      AUTHORIZE_URL: Type.String({
        default: 'https://github.com/login/oauth/authorize',
      }),
      CALLBACK_URI: Type.String({
        default: '/callbacks/github',
      }),
      CLIENT_ID: Type.String({
        default: 'Iv1.0e7aa571acf06cb6',
      }),
      CLIENT_SECRET: Type.String({
        default: '60c519fff3b06b286480d0083f77f1b730d50544',
      }),
      ID: Type.String({
        default: '52696',
      }),
      PEM: Type.String({
        default:
          '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA8CwhmTiDPwTaMASzPFJwrIHiRlcP7kxQWjuyFv9Im5xzgp4J\nusD7tVUwiZ6hkrvuobjTciCx/HKtDgwX71lgxIvWcG79ytUCtyOXXeeTewzaAszK\nP6+uBgvBmOTM9cpG2RwkkTXGyZPm7ApfzMMsHXtSX+WOiIPKU7CGuOmSOxOPlqiF\nsiJ8gdDhJoij6r1iTQuCFSWs5GeqIxUmr5LVQ1XklFrMBEpi0dwe/YYdkRYw6Qvd\nbAZFyd1gOBmJB2TrFL119rptaPE0u2VPKNZUBAThpwZE0r5xtlsoPm6CzaU83DHc\n2GbR7RFUk0swYrwX3tMWHTdQJ/YnUjNOM0PNVwIDAQABAoIBADP3GH3ygFNOVXc2\nTSGsJLzujWryw3un/2rGp83aBnfE7ilA0JIb11pwyEO+ku8Qwp0zRGzZLimVFmSH\nsVYUXJ+qMge5vCf61s+RX9rtlDd3nGQms0v8Uwbz3Ducpcw4rAOl1zOkExLicYB4\n7il7wTvPxw8AuEpJWamp9DxmLUGimotPTheqDWAe0hJIlT5Vw6SlYzW+i6XKWOMz\nSzlTLmNMzIdAPkCFySifcnY659T3m99KW+4iihCTeVejWpPilClDX9HM48taF61E\nX+FCS+ZFxWaXQlnSiJ46+pZaQ20B7RFk6EB0qGVNiaeXqTflnuMIpz76gBC0A7/D\nL2AbreECgYEA+yQXSkczJGcTj1A8dRviTUVVIzGyZv3OzKNigHbedbri9KyjvWb4\nCANMi7Xh2weaoPy7rsBIzky15uibzvZ3tt2APawHSofLBjOEwiNwqjL2+yoXTMkh\nUBRG2YxyFainni+L/O+UFIMoIUvv70Amq8R5+lA/pMhqdQ6coMbkfQMCgYEA9NG2\nZa6GZduxXV8Yjt9pKhK+GaaKt7RfQxOW8op65U0s9ui2TsyfFpfPt9y9WnE6jdlH\n0ctTTtkgpq1bdQr771N7vO2swKne/vP7LWE263MAQfokLISUNHef4g+PfrSsRNob\ne29FHLOI4phI+DTf+C/gUzIbuL9M7xKTApOsjB0CgYEAr1u/C3V1x2hV5w7ueBM1\nTCEqVn3ABVwZxxgaknrt0KTjDldxqbG5ZNbw3ujsQKUpmll+r4HCFJLJvOcUzEma\nw8wcXHO/T5JL+BOHEovuglk9zZjRViNmqGTQJ92CV49BIxouFDoxWrVOExnT+mn/\n1pZFWbwpBGWQuBWw1i6qooMCgYEAtcjubew8gW+y8IkHPDdp6ELIg1VllWjKf40R\nPYFUJeW7aI99p19LFcSeCYFP3NNMzj0zlfUrI9YX54u76FnCnn/X1n6JEvpPyfIy\nZQzVcdkPrO3nZGMBhT/6KSqyuzu+2tU1KN+Dav9ouhCnxh3E3I34PO5tJS5vGuoo\n3PX4XoUCgYB5BbslEkyQln7HEoIL9U17HPFmaRGdSSFVfmZug0n4EGF7wnINRz3b\nKmIXghanCY7H143iFc0jT3AlS1Mux8kBQb7Dh2Mrg6/PV+xlvRZDraR75AgqafTH\nlOtNhn+KyLkVat1KMpiHjsUhGxz5ZfxM3Qr9cdXxAeR/14vcik+Yyw==\n-----END RSA PRIVATE KEY-----',
      }),
      WEBHOOK_SECRET: Type.String({
        default: 'thisismygithubsecret',
      }),
    },
    {
      default: {},
    },
  ),
  PORT: Type.String({
    default: 8080,
  }),
  REDIS_URL: Type.String({
    default: 'redis://localhost:6379',
  }),
});

type Schema = Static<typeof schema>;

export const env = envSchema({ schema });

declare module 'fastify' {
  interface FastifyInstance {
    config: Schema;
  }
}
