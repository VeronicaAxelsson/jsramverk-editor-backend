# Texteditor

REST API made in the course JSramverk.

# Get started with developing

-   Download repo
-   Install requirements:
    ```text
    npm install
    ```
-   .env

    -   ATLAS_USERNAME
    -   ATLAS_PASSWORD
    -   PORT (default 1337)

-   Run development server:
    ```text
    npm run start
    ```
-   To format code using prettier:
    ```text
      npm run format
    ```

# REST API
## Get list of all Documents

### Request

`GET /docs/`

### Response
**List of Documents ex.** 
[
    {
        "_id": "6310b0774f23cb1326f5cfb9",
        "title": "title",
        "content": "content"
    },
]

## Create a new Document

### Request

`POST /docs/`

### Response
**Created Document**
{
    "_id": "6310b0774f23cb1326f5cfb9",
    "title": "title",
    "content": "content"
}

## Get a specific Document

### Request

`GET /docs/:documentId`

### Response
**Matching Document**
{
    "_id": "6310b0774f23cb1326f5cfb9",
    "title": "title",
    "content": "content"
}

## Update a Document

### Request

`PUT /docs/:documentId/`

### Response
If success: {'message': 'Successfully updated one document.'}
If Doucment was not found: {'message': 'No document matched filter, new document created.'}

## Delete a Document

### Request

`DELETE /docs/:documentId`

### Response
If success: { 'message': 'Successfully deleted one document.'}
If document not found: {'message': 'No documents matched the query. Deleted 0 documents.'}
