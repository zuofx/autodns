import fetch from 'node-fetch';
import fs from 'fs';

function updateJason(newJson) {

    var writeJson = JSON.stringify(newJson)

    fs.writeFile("ip.json", writeJson, function(err, result) {
        if (err) console.log('error', err)

    })

}

function setIP(ipAddr) {
    console.log(ipAddr);

    // Open Json File
    let rawJson = fs.readFileSync("ip.json")
    let parseJson = JSON.parse(rawJson)

    // Check if the ip has changed:
    if (ipAddr === parseJson[0]) {
        console.log("Found no change in ip address.")
        return false;
    }else {
        parseJson[0] = ipAddr;
        console.log("Updating stored ip address to: " + parseJson);
        updateJason(parseJson);

        let dnsRaw = fs.readFileSync("records.json");
        let dnsRecords = JSON.parse(dnsRaw)

        console.log(dnsRecords)

        for (let i = 0; i < dnsRecords.length; i ++) {
            putCloudflare(ipAddr, dnsRecords[i].name, dnsRecords[i].zone, dnsRecords[i].id, dnsRecords[i].proxied);
        }

        return true;
    }

}

function getIP() {
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => setIP(data.ip));
}

// Retrieve all record information
function getCloudflare(zone) {

    let rawJson = fs.readFileSync("config.json");
    let parseJson = JSON.parse(rawJson);

    let apiKey = parseJson[0].apikey;

    const options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'Authorization': apiKey}
      };
      
      fetch('https://api.cloudflare.com/client/v4/zones/'+ zone +'/dns_records/', options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}

// Update DNS record on cloudflare
function putCloudflare(ipAddr, name, zone, id, proxied) {

    let rawJson = fs.readFileSync("config.json");
    let parseJson = JSON.parse(rawJson);

    let apiKey = parseJson[0].apikey;

    const options = {
        method: 'PUT',
        headers: {'Content-Type': 'application/json', 'Authorization': apiKey},
        body: '{"content":"'+ ipAddr +'","name":"'+ name +'","proxied":'+ proxied +', "type":"A"}'
    };
      
    fetch('https://api.cloudflare.com/client/v4/zones/'+ zone +'/dns_records/' + id, options)
        .then(response => response.json())
        .then(response => console.log(response))
        .catch(err => console.error(err));
}

getIP()

