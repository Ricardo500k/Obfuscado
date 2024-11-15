const fs = require('fs');
const path = require('path');
const { compile } = require('pawn-compiler');  // Assumindo que 'pawn-compiler' seja uma dependência

// Caminho do arquivo Pawn
const sourceFile = path.join(__dirname, 'src', 'meu_script.pwn');
const outputFile = path.join(__dirname, 'dist', 'meu_script.amx');

// Função para compilar o código Pawn para AMX
const compilePawnToAMX = () => {
  compile(sourceFile, outputFile, (err, result) => {
    if (err) {
      console.error("Erro na compilação: ", err);
    } else {
      console.log("Compilação concluída com sucesso!");
      // Aqui você pode adicionar um webhook para notificar quando a compilação for concluída
      notifyWebhook();
    }
  });
};

// Função para enviar uma notificação via Webhook
const notifyWebhook = () => {
  const webhookUrl = 'https://discord.com/api/webhooks/1288980879397621791/iK325TYN4nvqY4Pls61Uq6K1hP-t2vEQn77Qvif29SVClz0b-CWVjpqHyEZf_LAhiZIa';
  const data = {
    content: 'A compilação do script Pawn foi concluída com sucesso!',
  };

  const axios = require('axios');
  axios.post(webhookUrl, data)
    .then(() => console.log("Notificação enviada ao Discord"))
    .catch(err => console.error("Erro ao enviar a notificação:", err));
};

// Executar a compilação
compilePawnToAMX();
