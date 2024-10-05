# Extra linting is required because orval's generated output does not support ES Modules

$folders = Get-ChildItem -Path './src/api/openapi-generated'

foreach ($folder in $folders) {
    $files = Get-ChildItem -Path $folder.FullName -Recurse -File -Filter '*.ts'

    foreach ($file in $files) {

        $content = Get-Content -Path $file.FullName

        # Replace _schemas with _schemas/index.ts
        $content = $content -replace "../audioling-openapi-client.schemas", "../audioling-openapi-client.schemas.ts"

        $content | Set-Content -Path $file.FullName -Encoding utf8
        Write-Host "Linted $($file.FullName)"
    }
}

# Run eslint
eslint ./src/api/openapi-generated --fix