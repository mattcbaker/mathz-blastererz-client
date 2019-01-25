## Huh?
This is a client for the kata https://github.com/tenth10th/mathz-blastererz.

## Why the Python server?
Node can't do math at the precision that the kata demands, so I wrote a little Python server to do the math. You'll notice that the JavaScript **does not**  convert anything to ints or floats, that all happens in the Python server in order to preserve precision.

## Why not tests for each component?
I originally did that, but changed it because I didn't want to stage an expression tree for each test in the [evaluator](/infix-evaluator.js) and [reducer](/infix-reducer.js) test files. I'm happy with that choice, I've been able to iterate more quickly since making the change to [black box testing](https://en.wikipedia.org/wiki/Black-box_testing).

## I can do it with less code
I have no doubt that you can, and I'd love to see it. I've been studying interpreters, so I used this as an excuse to go overboard and write one for evaluating algebraic expressions. Even so, I'm sure you could still do it better than me and I'd love to see your client!

## How can I run it?
1. Set the following environment variable - `export MATHZBLASTERERZ_USERID=<your user id>`
1. Start the Python server (I used Python 3, not sure if it works in 2) - `python python-calculator-server.py`
1. Run the client - `node mathz-blastererz-client.js`
