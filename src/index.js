import StorageHttp from 'image-steam/lib/storage/http';

export default class StorageBlobby extends StorageHttp
{
  constructor(opts) {
    super(opts);

    if (!this.options.endpoint) {
      throw new Error('StorageBlobby.endpoint is required');
    }
  }

  store(opts, originalPath, stepsHash, image, cb) {
    if (!stepsHash) {
      return void cb(new Error('StorageBlobby: Cannot store an image over the original'));
    }

    const options = this.getOptions(opts);
    const client = this.getClient(options);
    const pathInfo = this.getPathInfo(originalPath, options);
    const reqOptions = this.getRequestOptions(pathInfo, options);
    if (stepsHash) reqOptions.path += '/' + stepsHash;

    image.info.stepsHash = stepsHash;

    reqOptions.method = 'PUT';
    reqOptions.headers = {
      'Content-Length': image.buffer.length,
      'Content-Type': image.contentType || 'application/octet-stream', // default to binary if unknown
      'Authorization': `ApiKey ${options.secret}`,
      'x-amz-meta-isteam': JSON.stringify(image.info)
    };

    const req = client.request(reqOptions, function(res) {
      res.resume(); // discard body

      if (res.statusCode > 204) {
        return void cb(new Error(`StorageBlobby.store.error: ${res.statusCode} for ${pathInfo.bucket}/${pathInfo.imagePath}`));
      }

      cb();
    }).on('error', function(err) {
      cb(err);
    });
    
    req.write(image.buffer);
    req.end();
  }

  deleteCache(opts, originalPath, cb) {
    // intended to be used with cache objects only
    const options = this.getOptions(opts);
    const client = this.getClient(options);
    const pathInfo = this.getPathInfo(originalPath, options);
    const reqOptions = this.getRequestOptions(pathInfo, options);

    reqOptions.path += '/'; // delete the directory instead
    reqOptions.method = 'DELETE';
    reqOptions.headers = {
      'Authorization': `ApiKey ${options.secret}`
    };

    const req = client.request(reqOptions, function(res) {
      res.resume(); // discard body

      if (res.statusCode > 404) {
        return void cb(new Error(`StorageBlobby.deleteCache.error: ${res.statusCode} for ${pathInfo.bucket}/${pathInfo.imagePath}`));
      }

      cb();
    }).on('error', function(err) {
      cb(err);
    }).end();
  }
}
