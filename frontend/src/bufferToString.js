export default function bufferToString(image) {
    let binary = '';
    let bytes = new Uint8Array(image.data.data);
    bytes.forEach(byte => {
        binary += String.fromCharCode(byte)
    })
    return (`data:${image.contentType};base64,${window.btoa(binary)}`);
}