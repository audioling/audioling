module.exports = {
    'audioling-openapi-client': {
        input: {
            target: './openapi.json',
        },
        output: {
            mode: 'tags-split',
            target: './src/api/openapi-generated/audioling-openapi-client.ts',
            client: 'react-query',
        },
        hooks: {
            afterAllFilesWrite: 'prettier --write ./src/api/openapi-generated',
        },
    },
};
