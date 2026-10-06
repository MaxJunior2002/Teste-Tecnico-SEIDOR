# Seidor Vehicle API

API REST para controlar os automóveis de uma empresa, seus motoristas e os
registros de utilização dos veículos. O projeto foi desenvolvido com NestJS e
TypeScript.

## Funcionalidades

- Cadastro, consulta, atualização e exclusão de automóveis, com filtros por cor
  e marca.
- Cadastro, consulta, atualização e exclusão de motoristas, com filtro por
  nome.
- Registro do início e do motivo da utilização de um automóvel por um
  motorista.
- Encerramento de uma utilização, registrando a data de término.
- Histórico de utilizações com os dados do automóvel e do motorista.
- Regras que impedem um automóvel ou motorista de participar de mais de uma
  utilização ativa ao mesmo tempo.
- Exclusão de automóveis e motoristas bloqueada enquanto estiverem em uso. Os
  registros históricos permanecem disponíveis após a exclusão dos cadastros.

Os dados são armazenados em memória e são reiniciados quando a aplicação é
encerrada.

## Pré-requisitos

- Node.js 20 ou superior
- npm
- Git

## Clonar e executar a aplicação

Clone o repositório e acesse sua pasta:

```bash
git clone https://github.com/MaxJunior2002/Teste-Tecnico-SEIDOR.git
cd Teste-Tecnico-SEIDOR
```

Instale as dependências e inicie o servidor em modo de desenvolvimento:

```bash
npm install
npm run start:dev
```

A API estará disponível em `http://localhost:3000`. Para alterar a porta,
defina a variável de ambiente `PORT`.

### Swagger

Com a aplicação em execução, acesse
[`http://localhost:3000/api`](http://localhost:3000/api) para consultar e
experimentar interativamente os endpoints, seus parâmetros, exemplos e
respostas documentadas.

## Endpoints principais

| Método | Endpoint | Descrição |
| --- | --- | --- |
| `POST` | `/cars` | Cadastrar automóvel |
| `GET` | `/cars?color=Blue&brand=Honda` | Listar automóveis; filtros opcionais por cor e marca |
| `GET` | `/cars/:id` | Consultar automóvel |
| `PUT` | `/cars/:id` | Atualizar automóvel |
| `DELETE` | `/cars/:id` | Excluir automóvel |
| `POST` | `/drivers` | Cadastrar motorista |
| `GET` | `/drivers?name=Maria` | Listar motoristas; filtro opcional por nome |
| `GET` | `/drivers/:id` | Consultar motorista |
| `PUT` | `/drivers/:id` | Atualizar motorista |
| `DELETE` | `/drivers/:id` | Excluir motorista |
| `POST` | `/usages` | Iniciar utilização de automóvel |
| `GET` | `/usages` | Listar o histórico de utilizações |
| `POST` | `/usages/end` | Encerrar utilização pelo motorista |

Para iniciar uma utilização, envie os IDs existentes do automóvel e do
motorista, além do motivo:

```json
{
  "carId": "uuid-do-automovel",
  "driverId": "uuid-do-motorista",
  "reason": "Visita a um cliente"
}
```

Para encerrar a utilização ativa, envie os IDs do mesmo automóvel e motorista:

```json
{
  "carId": "uuid-do-automovel",
  "driverId": "uuid-do-motorista"
}
```

## Testes e verificações

Os testes unitários dos serviços de automóveis, motoristas e utilizações são
executados com Vitest. Como a raiz deste repositório contém o `package.json`,
execute os comandos abaixo a partir da pasta `Teste-Tecnico-SEIDOR`:

```bash
# Executar testes unitários
npm test

# Executar testes unitários com cobertura
npm run test:cov

# Executar lint
npm run lint

# Compilar a aplicação
npm run build
```
