export function getFileExt(fileName: string) {
    var re = /(?:\.([^.]+))?$/;
    var ext = re.exec(fileName);
    if (ext == null) return undefined;
    return '.' + ext[1];
}
