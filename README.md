# image-steam-redis
Blobby client for [Image Steam](https://github.com/asilvas/node-image-steam).

**For caching only**


## Options

```ecmascript 6
import isteamBlobby from 'image-steam-blobby';

const blobby = new isteamBlobby({
  endpoint: 'https://some-endpoint.com',
  bucket: 'myBucket', // equates to https://some-endpoint.com/myBucket
  secret: 'mySecretShhh' // enable writes
});
```

| Param | Info |
| --- | --- |
| endpoint (***required***) | Endpoint of http(s) service |
| secret | Only required if using as a cache layer that must write back to storage |
| bucket | Path of folder from root |


## Usage

Example:

```ecmascript 6
import isteam from 'image-steam';

const options = {
  storage: {
    app: {
      static: {
        driver: 'http',
        endpoint: 'https://some-endpoint.com'
      }
    },
    cache: {
      driverPath: 'image-steam-blobby',
      endpoint: 'https://some-endpoint.com',
      bucket: 'myBucket',
      secret: 'mySecretShh' // enable writes
    }
  }
}

http.createServer(new isteam.http.Connect(options).getHandler())
  .listen(13337, '127.0.0.1')
;
```
