# S.A Engenharia — landing page

Landing page em React + TypeScript para apresentar os serviços da S.A Engenharia, com foco em gerenciamento de obras.

## Executar localmente

```bash
npm install
npm run dev
```

Verificação de qualidade e build de produção:

```bash
npm run check
```

## Configuração principal

Os textos operacionais, regiões, serviços, imagens e contato ficam centralizados em `src/config.ts`.

### Configurar o WhatsApp

Preencha `whatsappNumber` em `src/config.ts` usando somente números e o formato internacional, incluindo país e DDD. Exemplo de formato: código do país + DDD + número, sem `+`, espaços ou pontuação.

Enquanto o campo estiver vazio ou inválido:

- todos os CTAs levam à seção de contato;
- o formulário informa que o canal está indisponível;
- o envio permanece desabilitado;
- o botão flutuante de WhatsApp não aparece.

Quando um número válido for configurado, o formulário cria a mensagem com `encodeURIComponent`, abre o WhatsApp em uma nova aba e deixa claro que o visitante ainda precisa enviá-la.

## Substituir imagens

As imagens otimizadas ficam em `public/images`. Para substituí-las sem alterar os componentes, mantenha os mesmos nomes ou atualize os caminhos em `src/config.ts`.

Ao trocar uma imagem, revise também o texto alternativo correspondente em `src/App.tsx` e mantenha as dimensões declaradas para evitar deslocamentos de layout.

## Analytics

Os eventos `cta_click` e `whatsapp_open` são enviados para `window.dataLayer` quando ela estiver disponível e também publicados como evento customizado `sa:analytics`. Nenhum ID de analytics foi inventado ou configurado.

`whatsapp_open` significa apenas abertura da conversa; não representa mensagem enviada, lead confirmado ou venda.

## Informações pendentes

- Número real de WhatsApp no formato internacional.
- Domínio oficial para configurar canonical e `og:url`.
- ID e ferramenta de analytics, se houver.
- E-mail, Instagram ou outros canais oficiais, caso devam ser publicados.
- Confirmação de endereço, CREA, responsável técnico ou demais dados institucionais antes de qualquer publicação.

Nenhum dado pendente aparece como placeholder na interface.
