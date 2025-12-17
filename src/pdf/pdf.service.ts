import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import { Readable } from 'stream';
import { mapUnstructuredData } from './mapper';

@Injectable()
export class PdfService {
  async processPdf(buffer: Buffer) {
    const response = await fetch(
      'https://api.unstructured.io/general/v0/general?strategy=auto',
      {
        method: 'POST',
        headers: {
          'unstructured-api-key': process.env.UNSTRUCTURED_API_KEY!,
          'Content-Type': 'application/pdf',
        },
        body: Readable.from(buffer),
      },
    );

    const raw = await response.json();
    const mapped = mapUnstructuredData(raw);

    return { mapped };
  }
}
