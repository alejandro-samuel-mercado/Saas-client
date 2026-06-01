const chars = [
    { key: 'Uso de suelo', value: 'Residencial Exclusivo' },
    { key: 'Ciudad/Zona/Dirección', value: 'Nordelta, Tigre' },
    { key: 'Mapa interactivo GPS', value: 'https://maps.google.com/?q=-34.402,-58.641' },
    { key: 'Plano/Croquis (Enlace)', value: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' }
];

function getCharValue(keys) {
    for (const key of keys) {
        const found = chars.find(c => c.key.toLowerCase().includes(key.toLowerCase()));
        if (found) return found.value;
    }
    return null;
}

const mapUrl = getCharValue(['mapa', 'gps']);
let embedUrl = null;
if (mapUrl) {
    const qMatch = mapUrl.match(/q=([^&]+)/);
    if (qMatch) {
        embedUrl = `https://maps.google.com/maps?q=${qMatch[1]}&hl=es&z=14&output=embed`;
    }
}
console.log('Embed URL:', embedUrl);
console.log('Plano URL:', getCharValue(['plano', 'croquis']));
