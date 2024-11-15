const express = require('express');
const multer = require('multer');
const axios = require('axios');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

// Configura o armazenamento de arquivos para upload
const upload = multer({ dest: 'uploads/' });

const app = express();
const PORT = 3000;

// URL do webhook do Discord
const WEBHOOK_URL = 'https://discord.com/api/webhooks/1288980879397621791/iK325TYN4nvqY4Pls61Uq6K1hP-t2vEQn77Qvif29SVClz0b-CWVjpqHyEZf_LAhiZIa';

// Endpoint para compilar e enviar o arquivo
app.post('/compile', upload.single('pwnFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Arquivo .pwn não enviado.');
    }

    const pwnFilePath = req.file.path;
    const amxFilePath = path.join('compiled', `${req.file.filename}.amx`);

    // Compilação do arquivo .pwn com pawncc
    exec(`pawncc ${pwnFilePath} -o${amxFilePath}`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).send(`Erro ao compilar: ${stderr}`);
        }

        // Enviar o arquivo compilado para o Discord
        const fileStream = fs.createReadStream(amxFilePath);

        axios.post(WEBHOOK_URL, {
            files: [
                {
                    file: fileStream,
                    filename: path.basename(amxFilePath),
                    contentType: 'application/octet-stream',
                }
            ]
        }).then(() => {
            // Remover arquivos temporários
            fs.unlinkSync(pwnFilePath);
            fs.unlinkSync(amxFilePath);

            res.status(200).send('Arquivo compilado e enviado para o Discord com sucesso!');
        }).catch((err) => {
            res.status(500).send('Erro ao enviar para o Discord.');
        });
    });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
