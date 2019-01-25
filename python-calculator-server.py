from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import math
import logging

def isFloat(value):
  try:
    if '.' not in value:
      return False
    return not (int(value) == float(value))
  except:
    return True

def format(value):
  result = ''
  if isFloat(value):
    result = str(round(value,3))
  else:
    result = str(int(value))
  
  return result.rstrip('0').rstrip('.') if '.' in result else result

class SimpleHTTPRequestHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        body = json.loads(self.rfile.read(int(self.headers['Content-Length'])))

        left = float(body['left']) if isFloat(body['left']) else int(body['left'])
        right = float(body['right']) if isFloat(body['right']) else int(body['right'])

        if body['operator'] == '^':
            evaluated = left ** right
        if body['operator'] == '+':
            evaluated = left + right
        if body['operator'] == '-':
            evaluated = left - right
        if body['operator'] == 'x':
            evaluated = left * right
            evaluated = float(evaluated) if isFloat(evaluated) else int(evaluated)
        if body['operator'] == '%':
            evaluated = left / right
            evaluated = evaluated if isFloat(evaluated) else int(evaluated)
        if body['operator'] == 'log':
            evaluated = math.log(left, right)
            evaluated = evaluated if isFloat(evaluated) else int(evaluated)
        if body['operator'] == 'root':
            evaluated = left ** (1 / right)
            evaluated = evaluated if isFloat(evaluated) else int(evaluated)

        evaluated = format(evaluated)
        self.send_response(200)
        self.end_headers()
        self.wfile.write(bytes(evaluated, encoding='utf-8'))

httpd = HTTPServer(('localhost', 8000), SimpleHTTPRequestHandler)
httpd.serve_forever()
