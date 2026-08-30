# Arquitetura Hexagonal
`Regra de ouro: Regras de negócio vivem no Domain Layer. Use Cases orquestram. Adapters
implementam ports — nunca o contrário. Nenhuma dependência do domínio aponta para fora.`

# Quote API

API desenvolvida em **Node.js + TypeScript + Express**, utilizando **Arquitetura Hexagonal (Ports and Adapters)**.

O objetivo do projeto é disponibilizar uma cotação para o cliente a partir de uma cotação obtida de um provedor externo, aplicando um **spread fixo de 10%**.

O projeto também foi estruturado como um exemplo prático para demonstrar a separação entre:

* Domínio
* Casos de uso
* Portas
* Adapters
* Injeção de dependências
* Entrada HTTP
* Integração com serviços externos

---

# 1. Tecnologias

* Node.js
* TypeScript
* Express
* ES Modules
* REST Client para testes HTTP
* Arquitetura Hexagonal

![alt text](images/hexa01.jpg)
![alt text](images/hexa02.jpg)

---

# 2. Pré-requisitos

Antes de executar o projeto, certifique-se de possuir:

```text
Node.js
npm
```

Verifique as versões:

```bash
node --version
npm --version
```

---

# 3. Instalação

Clone o projeto:

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre na pasta:

```bash
cd quote-api
```

Instale as dependências:

```bash
npm install
```

---

# 4. Executando o projeto

Para executar em modo desenvolvimento:

```bash
npm run dev
```

A API será iniciada em:

```text
http://localhost:3000
```

---

# 5. Build

Para compilar o TypeScript:

```bash
npm run build
```

Os arquivos JavaScript compilados serão gerados em:

```text
dist/
```

Para executar a versão compilada:

```bash
npm start
```

---

# 6. Testando a API

O projeto possui um arquivo:

```text
requests.http
```

Esse arquivo pode ser utilizado com a extensão **REST Client** do VS Code.

Exemplo:

```http
### Solicitar cotação
POST http://localhost:3000/api/quote
Content-Type: application/json

{
    "amount": 500
}
```

Clique em:

```text
Send Request
```

para executar a requisição diretamente pelo VS Code.

---

# 7. Endpoint

## POST /api/quote

Solicita uma cotação para um determinado valor.

### Request

```http
POST /api/quote
Content-Type: application/json
```

Body:

```json
{
    "amount": 500
}
```

### Response

Exemplo:

```json
{
    "amount": 500,
    "marketQuote": 5.40,
    "spread": 0.10,
    "customerQuote": 2970
}
```

Considerando:

```text
Valor solicitado: 500 USD
Cotação de mercado: R$ 5,40
Spread: 10%
```

O cálculo será:

```text
500 × 5,40 = R$ 2.700,00

10% de spread = R$ 270,00

Total = R$ 2.970,00
```

---

# 8. Arquitetura

O projeto utiliza o conceito de **Arquitetura Hexagonal**, também conhecida como **Ports and Adapters**.

A ideia central é separar o núcleo da aplicação das tecnologias externas.

Podemos visualizar a arquitetura da seguinte forma:

```text
                         CLIENTE
                            │
                            │ HTTP
                            ▼
                  ┌──────────────────┐
                  │ Express Adapter  │
                  │                  │
                  │   Controller     │
                  └────────┬─────────┘
                           │
                           │
                           ▼
                    ┌──────────────┐
                    │  QuotePort   │
                    │              │
                    │ Porta entrada│
                    └──────┬───────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ QuoteApplication │
                  │                  │
                  │    Caso de uso   │
                  └────────┬─────────┘
                           │
                           │
                           ▼
                    ┌──────────────┐
                    │    Quote     │
                    │              │
                    │    Domínio   │
                    └──────────────┘
                           ▲
                           │
                           │
                    ┌──────┴───────┐
                    │ QuoteProvider│
                    │              │
                    │ Porta saída  │
                    └──────┬───────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ AwesomeAPI Adapter  │
                │                     │
                │ API externa         │
                └─────────────────────┘
```

---

# 9. Estrutura de pastas

A estrutura principal:

```text
src/
│
├── adapters/
│   │
│   ├── inbound/
│   │   └── http/
│   │       ├── controllers/
│   │       │   ├── dto/
│   │       │   └── quoteController.ts
│   │       │
│   │       └── routes/
│   │           └── quote.routes.ts
│   │
│   └── outbound/
│       └── AwesomeApiQuoteAdapter.ts
│
├── app/
│   │
│   ├── ports/
│   │   ├── inbound/
│   │   │   ├── dto/
│   │   │   └── QuotePort.ts
│   │   │
│   │   └── outbound/
│   │       └── QuoteProvider.ts
│   │
│   └── QuoteApplication.ts
│
├── domain/
│   └── entities/
│       └── Quote.ts
│
├── container/
│   └── container.ts
│
├── app.ts
└── server.ts
```

---

# 10. Domínio

O domínio contém as regras de negócio da aplicação.

Neste projeto temos a entidade:

```text
domain/entities/Quote.ts
```

A entidade `Quote` representa uma cotação.

Ela conhece regras como:

```text
Cotação de mercado
Spread
Cálculo do valor final
```

Por exemplo:

```typescript
const quote = new Quote(
    marketValue,
    0.10
);
```

O domínio não conhece:

```text
Express
HTTP
Axios
AwesomeAPI
Banco de dados
Node.js
```

Essa independência é fundamental.

---

# 11. Caso de uso

O caso de uso está representado por:

```text
app/QuoteApplication.ts
```

O caso de uso representa uma ação que o sistema realiza.

Neste projeto:

```text
Calcular uma cotação para o cliente
```

Ele coordena o fluxo:

```text
1. Receber o valor solicitado
2. Buscar a cotação atual
3. Criar o objeto de domínio
4. Aplicar as regras de negócio
5. Retornar o resultado
```

O caso de uso não conhece a tecnologia utilizada para obter a cotação.

Ele conhece apenas a porta:

```typescript
QuoteProvider
```

---

# 12. Porta de entrada

A porta de entrada define como o mundo externo pode solicitar uma operação da aplicação.

Exemplo:

```text
app/ports/inbound/QuotePort.ts
```

Ela pode definir:

```typescript
export interface QuotePort {

    calcQuote(
        request: GetQuoteRequest
    ): Promise<QuoteResponse>;

}
```

Observe que essa interface não conhece Express.

Ela não recebe:

```typescript
Request
Response
```

porque isso faria a aplicação depender de HTTP.

A porta trabalha com contratos da aplicação.

---

# 13. Adapter de entrada

O adapter de entrada é responsável por adaptar uma tecnologia externa para a aplicação.

Neste projeto:

```text
adapters/inbound/http/
```

O Express recebe:

```http
POST /api/quote
```

O Controller transforma a requisição HTTP em um objeto que a aplicação entende:

```text
HTTP Request
     ↓
Controller
     ↓
QuoteRequest
     ↓
QuoteApplication
```

O Controller conhece Express.

A aplicação não.

---

# 14. Porta de saída

A aplicação precisa obter a cotação de mercado.

Mas não queremos que `QuoteApplication` saiba que existe uma API chamada AwesomeAPI.

Por isso criamos:

```text
app/ports/outbound/QuoteProvider.ts
```

Exemplo:

```typescript
export interface QuoteProvider {

    getQuote(): Promise<number>;

}
```

Essa é uma porta de saída.

A aplicação depende da abstração:

```text
QuoteProvider
```

e não da implementação:

```text
AwesomeApiQuoteAdapter
```

---

# 15. Adapter de saída

A implementação concreta da porta está em:

```text
adapters/outbound/AwesomeApiQuoteAdapter.ts
```

Ela sabe:

```text
Como acessar a API externa
Como montar a requisição
Como interpretar a resposta
Como extrair a cotação
```

A aplicação não precisa conhecer nenhum desses detalhes.

Temos:

```text
QuoteApplication
       │
       │ depende de
       ▼
QuoteProvider
       ▲
       │ implementa
       │
AwesomeApiQuoteAdapter
       │
       ▼
AwesomeAPI
```

---

# 16. Dependency Injection

As dependências são montadas no:

```text
container/container.ts
```

O Container funciona como o ponto de composição da aplicação.

Por exemplo:

```typescript
const quoteProvider =
    new AwesomeApiQuoteAdapter();

const quoteApplication =
    new QuoteApplication(
        quoteProvider
    );

const quoteController =
    new QuoteController(
        quoteApplication
    );
```

A cadeia de dependências é:

```text
AwesomeApiQuoteAdapter
          ↓
   QuoteProvider
          ↓
 QuoteApplication
          ↓
 QuoteController
```

O Controller não precisa criar a aplicação.

A aplicação não precisa criar o Adapter externo.

As dependências são montadas em um único lugar.

---

# 17. Por que utilizar portas?

Imagine que amanhã a aplicação deixe de utilizar a AwesomeAPI.

Poderíamos criar:

```text
BancoCentralQuoteAdapter
```

ou:

```text
OutraApiQuoteAdapter
```

sem alterar o caso de uso.

A aplicação continuaria dependendo de:

```typescript
QuoteProvider
```

e não de:

```typescript
AwesomeApiQuoteAdapter
```

Isso reduz o acoplamento entre o núcleo da aplicação e as tecnologias externas.

---

# 18. Regra de dependência

Uma regra importante deste projeto é:

```text
Adapters
    ↓
Application
    ↓
Domain
```

O domínio não deve depender de:

```text
Express
HTTP
API externa
Banco de dados
Framework
```

E a aplicação deve depender de portas, não das implementações concretas dos adapters.

---

# 19. Alias de imports

O projeto utiliza aliases para evitar caminhos relativos muito longos.

Em vez de:

```typescript
import { Quote } from '../../../../domain/entities/Quote.js';
```

podemos utilizar:

```typescript
import { Quote } from '#/domain/entities/Quote.js';
```

O alias é configurado utilizando o mecanismo de `imports` do Node.js.

Isso melhora a legibilidade dos imports sem alterar a arquitetura da aplicação.

---

# 20. Fluxo completo da aplicação

Quando o cliente executa:

```http
POST /api/quote
```

com:

```json
{
    "amount": 500
}
```

o fluxo é:

```text
Cliente
   │
   │ HTTP
   ▼
Express
   │
   ▼
QuoteController
   │
   │ QuoteRequest
   ▼
QuotePort
   │
   ▼
QuoteApplication
   │
   │ solicita cotação
   ▼
QuoteProvider
   │
   ▼
AwesomeApiQuoteAdapter
   │
   │ HTTP
   ▼
API externa
   │
   │ cotação
   ▼
AwesomeApiQuoteAdapter
   │
   ▼
QuoteApplication
   │
   ▼
Quote
   │
   │ aplica spread
   ▼
QuoteApplication
   │
   ▼
QuoteController
   │
   ▼
HTTP Response
   │
   ▼
Cliente
```

---

# 21. Objetivo arquitetural

O objetivo principal deste projeto não é apenas criar uma API que funcione.

É demonstrar como podemos construir uma aplicação onde o **núcleo do negócio permanece independente das tecnologias externas**.

A ideia central é:

```text
             MUNDO EXTERNO
                   │
              ADAPTERS
                   │
                PORTAS
                   │
            ┌────────────┐
            │ APLICAÇÃO  │
            └─────┬──────┘
                  │
                DOMÍNIO
```

As tecnologias podem mudar.

O domínio e as regras de negócio permanecem protegidos.

---

# 22. Referência

A arquitetura utilizada neste projeto é baseada no conceito de **Hexagonal Architecture / Ports and Adapters**, proposto por **Alistair Cockburn**.

O artigo original pode ser consultado em:

https://alistair.cockburn.us/hexagonal-architecture

---

# 23. Comandos rápidos

Instalar:

```bash
npm install
```

Desenvolvimento:

```bash
npm run dev
```

Build:

```bash
npm run build
```

Produção:

```bash
npm start
```

Testes HTTP:

```text
requests.http
```

Endpoint:

```text
POST http://localhost:3000/api/quote
```
