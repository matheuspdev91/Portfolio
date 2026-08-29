# Plano: Consolidação da Navbar

## Diagnóstico

Existem dois arquivos de navbar com markup e comportamento diferentes:

- `templates/partials/navbar.html` — **ativa**. Usada em `templates/base.html:16` via `{% include "partials/navbar.html" %}`.
- `templates/navbar.html` — **órfã**. Nunca é referenciada por qualquer include, extends, view ou URL config.

O JavaScript `static/js/main.js` continha dead code (linhas 35-44 originais) que referenciava `#navbar`, um elemento que não existe no DOM atual (a navbar ativa usa `data-header`). Esse bloco foi removido, mas deixou um resíduo sintático na linha 35 (`};`), causando `SyntaxError` que impede a execução de todo o arquivo.

## Objetivo

Remover o arquivo órfão e o dead code do JavaScript sem alterar o visual ou o comportamento atual da página.

## Escopo e restrições

- Alterar apenas `templates/navbar.html` (remoção) e `static/js/main.js` (remoção de dead code).
- Não modificar `templates/partials/navbar.html`, `templates/base.html`, `static/css/components/navbar.css` ou qualquer outro arquivo de apresentação.
- Não mesclar elementos, classes ou comportamento da navbar órfã na navbar ativa.
- Não alterar `docs/ROADMAP.md` ou qualquer documento de planejamento.
- Não introduzir novas classes CSS, ids, atributos data-*, ou comportamentos JavaScript.

## Status atual

- **Concluído:** `templates/navbar.html` foi removido com sucesso.
- **Pendente:** correção de resíduo sintático em `static/js/main.js`.

## Ações

### 1. Remover arquivo órfão
**Arquivo:** `templates/navbar.html`  
**Status:** ✅ Concluído  
**Motivo:** Nunca é incluído ou estendido. Marcação diferente da navbar ativa.  
**Risco:** Nenhum, pois não há referência de código.

### 2. Remover dead code do JavaScript
**Arquivo:** `static/js/main.js`  
**Status:** ⚠️ Parcialmente concluído — resíduo sintático remanescente  
**Correção necessária:** Remover a linha 35, que contém apenas `});`. Esse resíduo ficou após a remoção do bloco de dead code original (linhas 35-44). Ele não possui nenhuma abertura correspondente (`{` ou `(`) no arquivo e causa `SyntaxError` que impede a execução de todo o JavaScript.

**Conteúdo atual da linha 35:**
```
});
```

**Conteúdo esperado após a correção:** O arquivo deve terminar na linha 34, com a chave de fechamento `}` do bloco `if (toggle && menu)`.

**Motivo:** `document.getElementById("navbar")` retornava `null` porque nenhum elemento do DOM atual possui esse id. O listener de scroll executa incondicionalmente e lançava erro no browser. O comportamento de scroll já é coberto pelas linhas 5-8 (`syncHeaderState`) que operam sobre `[data-header]`.  
**Risco:** Baixo. A remoção do resíduo não afeta o visual ou comportamento atual.

## Verificação de referências

- `templates/navbar.html`: zero referências em templates, views, urls ou JavaScript. Apenas menção genérica em `docs/ROADMAP.md:50` (checklist de tarefa, não código).
- `id="navbar"`: existe apenas dentro do próprio arquivo órfão. Não há outro uso no projeto.

## Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Referência futura a `templates/navbar.html` | Baixa | Nulo (arquivo morto) | Nenhuma. O arquivo nunca foi carregado em runtime. |
| Quebra de comportamento de scroll | Baixa | Nulo | O scroll state atual é gerenciado por `syncHeaderState()` (linhas 5-8), que permanece intacto. |
| Perda de markup alternativo para reuso | Baixo | Baixo | O markup do arquivo órfão nunca foi usado. Se for necessário no futuro, pode ser recriado. |

## Validação pós-mudança

1. Abrir a página em `/` e verificar que a navbar aparece com o mesmo visual.
2. Testar abertura/fechamento do menu mobile.
3. Scrollar a página e confirmar que o header adquire o estado `is-scrolled`.
4. Verificar no DevTools (Console) que não há erros `TypeError` ou `SyntaxError`.
5. Confirmar que `templates/navbar.html` não existe mais no sistema de arquivos.
6. Confirmar que `static/js/main.js` não contém mais a string `navbar` (referência a `#navbar`).
7. Confirmar que o arquivo `static/js/main.js` termina corretamente, sem resíduos sintáticos.
8. Se Node.js estiver disponível, executar `node --check static/js/main.js` para validar sintaxe.

## Arquivos afetados

- **Removido:** `templates/navbar.html`
- **Editar:** `static/js/main.js` (remoção da linha 35 contendo `});`)
