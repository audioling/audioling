import type { OpenAPIHono } from '@hono/zod-openapi';
import { apiReference } from '@scalar/hono-api-reference';
import type { AuthVariables } from '@/middlewares/auth-middleware.js';
import packageJson from '../../../package.json';

export const initOpenApiUI = async (app: OpenAPIHono<{ Variables: AuthVariables }>) => {
    const openApiDocument = app.getOpenAPI31Document({
        info: { title: 'Audioling API', version: packageJson.version },
        openapi: '3.1.0',
    });

    app.doc('/openapi', openApiDocument);

    app.openAPIRegistry.registerComponent('securitySchemes', 'Bearer', {
        scheme: 'bearer',
        type: 'http',
    });

    // Broken middleware type from @scalar/hono-api-reference
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const apiRef: any = apiReference({
        darkMode: true,
        layout: 'classic',
        servers: [
            {
                description: 'Local development server',
                url: 'http://localhost:4544',
                variables: {},
            },
        ],
        showSidebar: true,
        spec: { url: '/openapi' },
        theme: 'default',
    });

    app.get('/docs', apiRef);
};
