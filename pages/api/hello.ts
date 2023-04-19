import { IncomingMessage, ServerResponse } from "http";

export default function handler(req: IncomingMessage, res: ServerResponse) {
  
    res.statusMessage = "OK";
    res.statusCode = 200;
    res.write(JSON.stringify({test: 'Hello'}))
    res.end();
}
