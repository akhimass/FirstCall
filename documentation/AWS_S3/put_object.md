# Brief Overview

**Original Link:** https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/s3/client/put_object.html

## Table of Contents

- put_object
  - Request Syntax
- ... other params
  - Parameters

---

# put_object

Adds an object to a bucket.

## Request Syntax
```python
response = client.put_object(
    ACL='private'|'public-read'|'public-read-write'|'authenticated-read'|'aws-exec-read'|'bucket-owner-read'|'bucket-owner-full-control',
    Body=b'bytes'|file,
    Bucket='string',
    Key='string',
    Metadata={
        'string': 'string'
    },
    # ... other params
)
```

## Parameters
- Body: Object data.
- Bucket: The bucket name.
- Key: Object key name.