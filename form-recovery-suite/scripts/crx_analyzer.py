import sys
import os
import struct
import zipfile
import re

def extract_crx(crx_path, output_dir):
    """Strips CRX header and extracts ZIP content."""
    if not os.path.exists(crx_path):
        print(f"Error: {crx_path} not found.")
        return

    with open(crx_path, 'rb') as f:
        magic = f.read(4)
        if magic != b'Cr24':
            print("Error: Not a valid CRX file (magic mismatch).")
            return

        version = struct.unpack('<I', f.read(4))[0]
        pub_key_len = struct.unpack('<I', f.read(4))[0]
        sig_len = struct.unpack('<I', f.read(4))[0]

        f.seek(12 + pub_key_len + sig_len)
        zip_data = f.read()

    temp_zip = "temp_ext.zip"
    with open(temp_zip, 'wb') as f:
        f.write(zip_data)

    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    with zipfile.ZipFile(temp_zip, 'r') as z:
        z.extractall(output_dir)

    os.remove(temp_zip)
    print(f"Successfully extracted to {output_dir}")

def beautify_js(content):
    """Primitive JS beautifier for basic deobfuscation."""
    # Add newlines after semicolons and braces
    content = re.sub(r';', ';\n', content)
    content = re.sub(r'\{', ' {\n', content)
    content = re.sub(r'\}', '\n}\n', content)
    return content

def analyze_directory(directory):
    """Scans for interesting patterns in JS files."""
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith('.js'):
                path = os.path.join(root, file)
                with open(path, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                    if 'localStorage' in content or 'chrome.storage' in content:
                        print(f"Found storage logic in: {path}")
                    if 'input' in content or 'textarea' in content:
                        print(f"Found input monitoring in: {path}")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 crx_analyzer.py <path_to_crx> [output_dir]")
    else:
        crx = sys.argv[1]
        out = sys.argv[2] if len(sys.argv) > 2 else "extracted_extension"
        if os.path.isfile(crx):
            extract_crx(crx, out)
            analyze_directory(out)
        else:
            print(f"File {crx} not found.")
