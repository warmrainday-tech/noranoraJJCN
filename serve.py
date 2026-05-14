#!/usr/bin/env python3
"""Simple HTTP server with image upload support for noranoraJJCN."""
import http.server, socketserver, os, sys, json, uuid, urllib.parse

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
UPLOAD_DIR = os.path.join(BASE_DIR, 'images', 'uploads')
os.makedirs(UPLOAD_DIR, exist_ok=True)

class NoraHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **kw):
        super().__init__(*a, directory=BASE_DIR, **kw)

    def log_message(self, *a):
        pass  # silence logs

    # ---- POST /api/upload ----
    def do_POST(self):
        if self.path != '/api/upload':
            self.send_error(404)
            return
        ctype = self.headers.get('Content-Type', '')
        if 'multipart/form-data' not in ctype:
            self.send_error(400, 'Expected multipart/form-data')
            return

        # Parse boundary
        boundary = ctype.split('boundary=')[-1].encode()
        content_length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(content_length)

        # Extract file parts
        parts = body.split(b'--' + boundary)
        saved = []
        for part in parts:
            if part in (b'', b'--\r\n', b'--'):
                continue
            # Find headers
            header_end = part.find(b'\r\n\r\n')
            if header_end < 0:
                continue
            header_block = part[:header_end].decode('utf-8', errors='replace')
            file_data = part[header_end + 4:]
            if file_data.endswith(b'\r\n'):
                file_data = file_data[:-2]

            # Check it's a file field
            if 'filename=' not in header_block:
                continue

            # Extract filename
            for hdr_line in header_block.split('\r\n'):
                if 'filename=' in hdr_line:
                    raw_name = hdr_line.split('filename=')[-1].strip().strip('"')
                    ext = os.path.splitext(raw_name)[1].lower()
                    if ext not in ('.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'):
                        continue
                    # Generate unique filename
                    new_name = uuid.uuid4().hex[:12] + ext
                    filepath = os.path.join(UPLOAD_DIR, new_name)
                    with open(filepath, 'wb') as f:
                        f.write(file_data)
                    saved.append('images/uploads/' + new_name)
                    break

        if not saved:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': 'No valid image uploaded'}).encode())
            return

        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(json.dumps({'paths': saved}).encode())

    # ---- DELETE /api/delete ----
    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path != '/api/delete':
            self.send_error(404)
            return
        qs = urllib.parse.parse_qs(parsed.query)
        path_param = qs.get('path', [None])[0]
        if not path_param:
            self.send_error(400, 'Missing path param')
            return
        # Security: only allow deleting under images/uploads/
        safe_path = os.path.normpath(os.path.join(BASE_DIR, path_param))
        if not safe_path.startswith(os.path.join(BASE_DIR, 'images', 'uploads')):
            self.send_error(403, 'Can only delete uploaded images')
            return
        if os.path.isfile(safe_path):
            os.remove(safe_path)
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'ok': True, 'deleted': path_param}).encode())
        else:
            self.send_error(404, 'File not found')

socketserver.TCPServer.allow_reuse_address = True
httpd = socketserver.TCPServer(('', 9001), NoraHandler)
print(f'serving on :9001, pid={os.getpid()}', flush=True)
httpd.serve_forever()
