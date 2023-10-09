# autodns

This is a simple Node.js project that checks whether the stored IP and your current IP have changed, and if it has, it will update Cloudflare DNS configs appropriately.
Made this because I didn't want to pay $25 a month for a static ip address.

If you use this, make sure to update config.json (apikey) and records.json

records.json are the DNS records you want to be updated.

Run it on an automated script using cron or something.
