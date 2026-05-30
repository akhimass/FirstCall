# Brief Overview

**Original Link:** https://docs.aws.amazon.com/boto3/latest/reference/services/s3.html

## Table of Contents

- S3 Client
  - Usage
  - Available Methods

---

# S3 Client

A low-level client representing Amazon Simple Storage Service (S3).

## Usage
```python
import boto3
client = boto3.client('s3')
```

## Available Methods
- put_object
- get_object
- list_objects
- delete_object