import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

export const upload = async () => {
  const form = new FormData();
  form.append('file', fs.createReadStream('./dist/index.html'));

  const res = await axios.post('https://0x0.st', form, {
    headers: form.getHeaders()
  });

  console.log(`🌍 Hosted at: ${res.data}`);
};
