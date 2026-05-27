# Alex's Photo Board

## Safe Firestore Importer

This project includes a local-only importer for read-only community place records in Firestore.

Important security rules:

- Never commit a Firebase service account key.
- Do not create `serviceAccountKey.json` inside this repo.
- Do not paste private keys, client emails, project IDs, or credentials into JavaScript files.
- Keep the service account key only on your local computer.
- The importer reads credentials only from `GOOGLE_APPLICATION_CREDENTIALS`.

The `.gitignore` blocks common Firebase credential filenames:

- `serviceAccountKey.json`
- `*.service-account.json`
- `firebase-adminsdk*.json`

### Import The First Test Record

Install the importer dependency once:

```sh
npm install
```

Set `GOOGLE_APPLICATION_CREDENTIALS` to a service account key stored outside this repository:

```sh
export GOOGLE_APPLICATION_CREDENTIALS="/absolute/path/outside/this/repo/your-service-account-key.json"
```

Then import the first `communityPlaces` test record:

```sh
npm run import:community-place
```

This writes:

```text
communityPlaces/manurewa-community-centre
```

After importing, test:

- `search.html`
- `search.html?q=community`
- `place.html?id=manurewa-community-centre`

