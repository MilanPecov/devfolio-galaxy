const e=`
---
slug: building-high-performance-ticketing-systems
title: Building High-Performance Ticketing Systems
excerpt: Learn how we architected a system capable of handling over 100,000 bookings per minute using modern cloud infrastructure.
date: March 10, 2024
readTime: 8 min read
categories:
  - Architecture
  - Cloud
  - Performance
icon: Server
iconColor: indigo
---

## Introduction

At Showpass, we faced the challenge of building a ticketing system that could handle massive concurrent user load during high-demand event sales. This article details our journey in architecting a solution that can process over 100,000 bookings per minute.

## Implementation Example

Here's how we implemented our rate limiting using Python:

\`\`\`python
import redis
from functools import wraps
from datetime import datetime, timedelta

class RateLimiter:
    def __init__(self, redis_client):
        self.redis = redis_client
    
    def limit_requests(self, max_requests=100, window_seconds=60):
        def decorator(f):
            @wraps(f)
            async def wrapped(request, *args, **kwargs):
                key = f"rate_limit:{request.client_ip}"
                
                # Get current count
                current = await self.redis.get(key) or 0
                
                if int(current) >= max_requests:
                    raise Exception("Rate limit exceeded")
                
                # Increment and set expiry
                pipe = self.redis.pipeline()
                pipe.incr(key)
                pipe.expire(key, window_seconds)
                await pipe.execute()
                
                return await f(request, *args, **kwargs)
            return wrapped
        return decorator
\`\`\`

And here's the corresponding frontend JavaScript code:

\`\`\`javascript
const handleBooking = async (eventId) => {
  try {
    const response = await fetch('/api/bookings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventId,
        quantity: 1,
        timestamp: Date.now()
      })
    });

    if (response.status === 429) {
      throw new Error('Too many requests. Please try again later.');
    }

    const data = await response.json();
    return data.bookingId;
  } catch (error) {
    console.error('Booking failed:', error);
    throw error;
  }
};
\`\`\`

## Results

The new architecture allowed us to handle peak loads of over 100,000 concurrent users while maintaining sub-second response times and ensuring transaction consistency.
`;export{e as default};
