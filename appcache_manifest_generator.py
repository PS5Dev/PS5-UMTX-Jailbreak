import os
import hashlib
import argparse

def calculate_file_hash(file_path):
    sha256_hash = hashlib.sha256()
    with open(file_path, "rb") as f:
        data = f.read()
        sha256_hash.update(data)
    return sha256_hash.hexdigest()

def generate_cache_manifest(directory_path, include_payloads=True):
    manifest = ["CACHE MANIFEST"]
    manifest.append("")
    
    for root, _, files in os.walk(directory_path):
        for file in files:
            if '.appcache' in file or file.endswith('.exe'):
                continue
            file_path = os.path.join(root, file)

            if not include_payloads and 'payload' in root:
                continue
            file_hash = calculate_file_hash(file_path)
            
            if args.cloudflare_workaround and file == 'index.html':
                file_path = file_path.replace("index.html","")
                if file_path.isspace() or file_path == '':
                    file_path = '/'

            manifest_path = os.path.relpath(file_path, directory_path)
            if manifest_path.isspace() or manifest_path == '' or manifest_path == '.':
                manifest_path = '/'
                
            manifest_path = manifest_path.replace("\\","/")
            manifest.append(manifest_path + " #" + file_hash)

    manifest.append("")
    manifest.append("NETWORK:")
    manifest.append("*")

    return manifest

def update_manifest_tag(directory_path, add_manifest):
    index_html_path = os.path.join(directory_path, "index.html")
    index_html_needs_updating = False
    html_tag_found = False

    with open(index_html_path, "r") as f:
        lines = f.readlines()
        for i, line in enumerate(lines):
            if line.startswith("<html") and "<!--" not in line:
                html_tag_found = True
                if add_manifest and "manifest" not in line:
                    lines[i] = "<html manifest=\"cache.appcache\">\n"
                    index_html_needs_updating = True
                elif not add_manifest and "manifest" in line:
                    lines[i] = "<html>\n"
                    index_html_needs_updating = True
                break

    if not html_tag_found:
        print(f"<html> tag not found in '{index_html_path}'")
    
    if index_html_needs_updating:
        with open(index_html_path, "w") as f:
            f.writelines(lines)
            action = "Added" if add_manifest else "Removed"
            print(f"{action} manifest attribute in '{index_html_path}'")

parser = argparse.ArgumentParser(description="Generate an appcache file.")
parser.add_argument("directory_path", nargs='?', default='document/en/ps5',
                    help="The directory to generate the appcache for (default: 'document/en/ps5').")
parser.add_argument("-cf", "--cloudflare-workaround", action="store_true",
                    help="Cloudflare responds with 308 redirect to root when fetching index.html. Causing the appcache to error out.")
parser.add_argument("--update-manifest-tag", action="store_true", default=True,
                    help="Toggle updating the manifest tag in the HTML file (default: True).")
parser.add_argument("--clean", action="store_true",
                    help="Remove the previously generated cache manifest file and the manifest attribute from the HTML file.")
args = parser.parse_args()

if args.clean:
    output_path = os.path.join(args.directory_path, "cache.appcache")
    if os.path.exists(output_path):
        os.remove(output_path)
        print(f"Removed cache manifest: '{output_path}'")
else:
    cache_manifest = generate_cache_manifest(args.directory_path)

    output_path = os.path.join(args.directory_path, "cache.appcache")
    output_path = output_path.replace("\\","/")

    with open(output_path, "w") as manifest_file:
        manifest_file.write("\n".join(cache_manifest))

    print(f"Cache manifest generated in path: '{output_path}'")

if args.update_manifest_tag:
    update_manifest_tag(args.directory_path, add_manifest=not args.clean)