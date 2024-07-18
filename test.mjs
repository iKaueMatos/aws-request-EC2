import { IoTClient, DescribeEndpointCommand } from "@aws-sdk/client-iot";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { HttpRequest } from "@aws-sdk/protocol-http";
import fetch from 'node-fetch';

const region = ''; 
const clientAccessKey = ''; 
const clientSecretKey = '';
const credentials = '';

async function getEndpoint() {
  const client = new IoTClient({ region, credentials: { accessKeyId: clientAccessKey, secretAccessKey: clientSecretKey } });
  const command = new DescribeEndpointCommand({ endpointType: "" });
  const response = await client.send(command);
  return response.endpointAddress;
}

async function makeSignedRequest(path) {
  const endpoint = await getEndpoint();
  const url = `https://${endpoint}${path}`;

  const requestParams = new HttpRequest({
    method: 'GET',
    hostname: endpoint,
    path: path,
    headers: {
      'Host': endpoint,
      'Content-Type': 'application/json'
    }
  });

  const signer = new SignatureV4({
    credentials: credentials,
    region: region,
    service: '',
    sha256: 'sha256'
  });

  const signedRequest = await signer.sign(requestParams);

  try {
    const response = await fetch(url, {
      method: signedRequest.method,
      headers: signedRequest.headers
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    console.log('Response:', data);
  } catch (error) {
    console.error('Error making request:', error);
  }
}

// Exemplo de uso
const path = '';
makeSignedRequest(path);
