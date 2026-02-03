from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import os

# Ensure we act as if we are in the 'public' directory for serving files
# But we are running from root, so SimpleHTTPRequestHandler serves CWD.
# We should probably run this FROM public directory command-line side or change dir here.
if os.path.exists('public'):
    os.chdir('public')

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/save':
            try:
                content_length = int(self.headers['Content-Length'])
                post_data = self.rfile.read(content_length)
                
                # Verify it parses as JSON
                points = json.loads(post_data)
                print(f"Received {len(points)/3} points.")

                # Save to src/data/dragon_points.json (relative to public which we chdir'd into)
                # So we need to go up one level
                output_path = '../src/data/dragon_points.json'
                
                with open(output_path, 'w') as f:
                    # Write as raw array
                    f.write(json.dumps(points))
                
                self.send_response(200)
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(b'Saved')
            except Exception as e:
                print(f"Error: {e}")
                self.send_error(500, str(e))
        else:
            self.send_error(404)

    def do_GET(self):
        super().do_GET()

print("Starting server on 8081...")
httpd = HTTPServer(('localhost', 8081), CORSRequestHandler)
httpd.serve_forever()
