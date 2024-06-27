---
title: 'Lessons from a Hack: Securing systems properly when using UFW with Docker'
description: 'My MongoDB was hacked because Docker mapped port 27017 publicly, bypassing UFW. The hacker demanded a ransom for the stolen data. Prevent this by using -p 127.0.0.1:27017:27017 to bind the port locally and secure your database or docker images'
pubDate: '4 Jun 2024'
category: 'code'
---

> TL;DR: My MongoDB was hacked because Docker mapped port 27017 publicly, bypassing UFW. The hacker demanded a ransom for the stolen data. Prevent this by using -p 127.0.0.1:27017:27017 to bind the port locally and secure your database or docker images

I recently purchased a server from Contabo.com. After provisioning, I performed the initial setup, including shell configuration and creating a new user. I also installed Tailscale and set it up as the primary method for logging into the server using Tailscale SSH.

My goal was to host a project that used MongoDB as the database. To do this, I installed Docker, pulled the MongoDB image, and ran the container using the `-p` flag to bind the local port to MongoDB’s default port 27017. Since I was connected with Tailscale, I could access the database locally for testing, and everything seemed to be working perfectly.

However, after some time, I noticed in MongoDB Compass that all my databases had vanished. Instead, there was a single database containing a document demanding a ransom: "*All your data is backed up. Pay 0.005 BTC to [address] to get the data back. If not paid within 48 hours, the data will be made public.*" Even though the data wasn't critical, the realization that someone had accessed my server was alarming.
![Hacker Demand](/mongodb_ss.png)

Upon investigation, I discovered the root cause: Contabo doesn’t provide a free external firewall, and my internal firewall was not configured properly. The hacker accessed the database because port 27017 was open to the public. This vulnerability arose because Docker, by default, maps the `-p` flag to open the specified port in iptables, bypassing UFW (Uncomplicated Firewall). Consequently, an external firewall would have been necessary to prevent this.

I hadn't anticipated this issue because I had used a similar setup with other providers like Oracle without any problems. However, it turns out this is a common issue for VPS providers that do not offer an external firewall. It's a critical problem since most users (who use UFW as firewall, which I did setup after seeing there was no internal firewall as well) expect UFW to protect their ports, not realizing Docker's behavior with iptables.

To avoid this issue, bind containers to the local interface using the -p flag as follows:
```bash
docker run -p 127.0.0.1:27017:27017
```

This method ensures Docker does not create an iptables entry that opens the port to the public, as explained [here](https://askubuntu.com/questions/652556/uncomplicated-firewall-ufw-is-not-blocking-anything-when-using-docker/652572#652572).

## Other Security Measures
Never publish any app/service/database on the default ports, including SSH. Only ports open should be 443, 80, and one random for SSH unless really required.

Contabo also had password-based authentication enabled for SSH. You should never use that for various security reasons. Later, I checked the logs and found out someone was also brute-forcing passwords into SSH.

Lastly, the Docker daemon can also be configured to use 127.0.0.1 as the default IP by editing /etc/docker/daemon.json.
On a side note, you can also use Tailscale SSH for connecting with your server, its super easy and then we can also close the SSH port. 

> If you're using Tailscale, you can map to the Tailscale IP of the same machine instead of mapping to 127.0.0.1 (localhost). This ensures the database is only accessible via Tailscale, while still allowing local access without routing through Tailscale.

Hope this helps!