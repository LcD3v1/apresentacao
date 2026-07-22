/**
 * Conferência de ambiente, antes de qualquer outra coisa.
 *
 * Este arquivo é importado primeiro em server/index.js de propósito: módulos ES
 * são avaliados na ordem em que aparecem, então a checagem roda antes do db.js
 * tentar carregar o `node:sqlite`. Sem isso, uma hospedagem com Node antigo
 * derrubaria a aplicação com um erro de módulo difícil de entender.
 */

const MIN_MAJOR = 22;
const MIN_MINOR = 5;

const [major, minor] = process.versions.node.split('.').map(Number);
const atendeVersao = major > MIN_MAJOR || (major === MIN_MAJOR && minor >= MIN_MINOR);

function abortar(titulo, linhas) {
  console.error(`\n  ${titulo}\n`);
  for (const linha of linhas) console.error(`  ${linha}`);
  console.error('');
  process.exit(1);
}

if (!atendeVersao) {
  abortar('Node muito antigo para esta aplicação.', [
    `Versão encontrada: ${process.versions.node}`,
    'Versão necessária: 24 ou superior (recomendado), no mínimo 22.5.',
    '',
    'O banco de dados usa o módulo nativo `node:sqlite`, que só existe',
    'a partir do Node 22.5 e é estável no Node 24.',
    '',
    'No painel da hospedagem, troque a versão do Node e suba de novo.',
  ]);
}

try {
  await import('node:sqlite');
} catch {
  abortar('O módulo `node:sqlite` não está disponível.', [
    `Node em uso: ${process.versions.node}`,
    '',
    'No Node 22 e 23 esse módulo exige a flag --experimental-sqlite.',
    'A solução mais simples é usar Node 24 ou superior, onde ele já vem ligado.',
    '',
    'Se o painel não oferecer o Node 24, me avise que eu troco a camada',
    'de banco por uma alternativa compatível.',
  ]);
}
