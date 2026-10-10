# NEXO Mobile — iPhone Demo | Agência VIDE

Demonstração de site para lojas de iPhone desenvolvida pela **Agência VIDE**. Marca fictícia e experiência conceitual, **sem afiliação com a Apple**.

## O que já funciona

- Página inicial premium, responsiva e otimizada para celular.
- Catálogo histórico de **55 modelos de iPhone** do original (2007) até a linha apresentada em 2026 (18 Pro, 18 Pro Max e Duo).
- Filtros por geração, linha Pro, essenciais e clássicos.
- Busca em tempo real, ordenação e botão de carregar mais modelos.
- Favoritos salvos no navegador com `localStorage`.
- Detalhes de produto em janela modal.
- **Simulador de avaliação de usados para troca**: modelo, capacidade, conservação, tela, funcionamento, bateria, acessórios e desvinculação de iCloud.
- Preparação de mensagem personalizada para atendimento via WhatsApp.
- FAQs e CTAs ao longo da experiência.

## Publicação no GitHub Pages

1. Abra **Settings → Pages** neste repositório.
2. Em **Build and deployment**, selecione **Deploy from a branch**.
3. Selecione **main** e **/(root)** e salve.
4. Aguarde a publicação. O endereço esperado é `https://videdigital.github.io/iphonedemo/` **depois que o GitHub Pages estiver habilitado e o deploy concluído**.

Não há dependências de build: `index.html`, `styles.css` e `app.js` funcionam como site estático.

## Como personalizar

Edite o objeto `CONFIG` no início de `app.js`:

```js
const CONFIG = {
  storeName: "NEXO Mobile",
  whatsappNumber: "5511999999999", // DDI 55 + DDD + número, sem pontuação
  currency: "BRL"
};
```

**Importante:** também altere logo/nome/textos no `index.html`, os estilos em `styles.css` e defina com a loja os dados comerciais reais antes de publicar como site oficial.

**Sem número configurado**, os botões encaminham para o compartilhamento do WhatsApp, sem destinatário pré-definido, apropriado apenas para a demonstração.

## Simulação de avaliação — atenção

Os valores calculados são **100% fictícios e ilustrativos**. Não representam preços de mercado, nem oferta de compra; a fórmula foi criada apenas para mostrar a interação de uma possível ferramenta de troca.

- A partir de 2016, o simulador combina um valor-base fictício por ano, variante e fatores de conservação.
- Modelos anteriores a 2016 são encaminhados para análise individual.
- Se o iCloud ainda estiver vinculado, não gera estimativa automática.
- Nenhum dado é enviado a um servidor: a simulação ocorre no navegador e só é compartilhada se o usuário escolher enviar ao WhatsApp.

**Para venda real**, é necessário substituir a lógica fictícia por uma tabela de valores aprovada pela loja e por critérios reais de avaliação; configurar preço, estoque e integrações de atendimento; acrescentar política de privacidade, termos e informações do vendedor.

## Fotografias e direitos

- Fotografia principal: [Thai Nguyen — Unsplash](https://unsplash.com/photos/a-person-holding-a-white-iphone-in-their-hand-UKZhQVri0OI).
- Fotografia da faixa editorial: [Thai Nguyen — Unsplash](https://unsplash.com/photos/a-person-holding-a-cell-phone-in-their-hand-q7n9Cz0Bw3c).
- Licença das fotografias: [Unsplash License](https://unsplash.com/license). São fotos com uso permitido nos termos dessa licença.
- As miniaturas do catálogo são **ilustrações CSS criadas para a demonstração**, não fotografias oficiais nem representações exatas de cada modelo.
- Nomes e marcas Apple / iPhone pertencem aos respectivos titulares. A licença de imagem da Unsplash **não concede direitos adicionais sobre marcas comerciais** retratadas.
- Lista dos modelos conferida com o [comparador oficial da Apple](https://www.apple.com/br/iphone/compare/).

## Próximas evoluções após validação com uma loja

1. Substituir miniaturas ilustrativas por fotos específicas de cada aparelho, com autorização e licença verificadas.
2. Adicionar estoque por modelo/cor/armazenamento e preços reais editáveis.
3. Integrar gestão de leads, formulários e eventos analíticos (cliques no WhatsApp, simulações, solicitações).
4. Implementar validações comerciais e política de avaliação de usados.
5. Publicar em domínio próprio com informações legais e política de privacidade.

---

**Projeto de portfólio da Agência VIDE.** Não utilizar como representação de estoque, valores, avaliações de clientes ou condições reais de uma loja.
