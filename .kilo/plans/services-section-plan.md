# Plano: Seção Serviços — Fitflix como primeiro serviço

## 1. Diagnóstico da estrutura atual

- **Página:** `templates/pages/home.html` é uma one-page que inclui seções via `{% include %}`.
  - Inclui `sections/hero.html`
  - Inclui `sections/home.html` (seção "Projetos")
- **Layout base:** `templates/base.html` define a ordem de CSS carregados no `<head>` e o bloco `{% block extra_css %}{% endblock %}` para estilos específicos de página/seção.
- **CSS existente:**
  - `static/css/tokens.css` — design tokens (variáveis CSS)
  - `static/css/base.css` — reset e estilos globais
  - `static/css/components/navbar.css` — navbar
  - `static/css/sections/hero.css` — hero
  - `static/css/sections/project.css` — **vazio**
  - `static/css/sections/contact.css` — **vazio**
  - `static/css/sections/footer.css` — **vazio**
- **Navbar ativa:** `templates/partials/navbar.html` já contém link `href="#services"` (linha 14), mas o destino não existe ainda.
- **Documentação:** `docs/HOME.md` define a estrutura desejada da Home como: Hero, Sobre, Projetos, Stack, Processo, CTA, Footer. "Serviços" não está mapeado ali, mas está previsto na navbar e no ROADMAP.
- **Seção "Projetos":** `templates/sections/home.html` já contém um card do Fitflix com descrição, stack e link. Esta seção permanece intacta.
- **Asset:** `static/images/services/fitflix.png` já existe e será usado como elemento visual de destaque.

## 2. Arquivos que serão criados

| Arquivo | Motivo |
|---------|--------|
| `templates/sections/services.html` | Template da nova seção Serviços |
| `static/css/sections/services.css` | Estilos específicos da seção Serviços |

## 3. Arquivos existentes que serão modificados

| Arquivo | Alteração |
|---------|-----------|
| `templates/pages/home.html` | Incluir `sections/services.html` entre o hero e os projetos |
| `templates/base.html` | Adicionar `{% static 'css/sections/services.css' %}` no `<head>` |

## 4. Estrutura HTML proposta

**`templates/sections/services.html`**
```html
<section class="services" id="services">
  <div class="container">
    <div class="section-header">
      <span class="section-tag">Serviços</span>
      <h2>Soluções que entrego.</h2>
      <p>Desenvolvimento de sistemas web, SaaS e produtos digitais com foco em arquitetura, performance e experiência.</p>
    </div>

    <div class="services__grid">
      <article class="service-card">
        <div class="service-card__visual">
          <img src="{% static 'images/services/fitflix.png' %}" alt="Fitflix — case de desenvolvimento de SaaS para personal trainers">
        </div>
        <div class="service-card__content">
          <span class="service-status">Disponível para novos projetos</span>
          <h3>Desenvolvimento de SaaS</h3>
          <p>Plataformas web completas, como o Fitflix: arquitetura escalável, integrações e experiência do usuário.</p>
          <div class="service-stack">
            <span>Python</span>
            <span>Django</span>
            <span>PostgreSQL</span>
            <span>Cloudinary</span>
          </div>
        </div>
      </article>
    </div>
  </div>
</section>
```

**`templates/pages/home.html`** (ordem das seções após alteração)
```django
{% extends "base.html" %}

{% block content %}
  {% include "sections/hero.html" %}
  {% include "sections/services.html" %}
  {% include "sections/home.html" %}
{% endblock %}
```

**`templates/base.html`** (CSS adicional)
```html
<link rel="stylesheet" href="{% static 'css/sections/hero.css' %}">
<link rel="stylesheet" href="{% static 'css/sections/services.css' %}">
```

## 5. Estratégia de CSS

**Arquivo:** `static/css/sections/services.css`

- Reutilizar tokens de `tokens.css` (cores, fontes, espaçamento, easings).
- Reutilizar `.container` de `base.css`.
- Seguir o padrão BEM já adotado no projeto: `.services`, `.services__grid`, `.service-card`, `.service-card__visual`, `.service-card__content`.
- Layout desktop: grid com 2 colunas. Coluna esquerda: conteúdo textual do serviço. Coluna direita: asset visual do Fitflix com presença forte. O asset não é uma imagem no topo de card; é uma coluna visual dedicada. Em telas menores, a composição colapsa para uma coluna com conteúdo acima e imagem abaixo.
- Responsividade: breakpoints consistentes com `hero.css` (1120px, 860px, 620px).
- Não duplicar estilos de `.project-card` ou `.card` — criar classes específicas `.service-card`.
- A imagem do Fitflix deve ter `object-fit: cover` e dimensões controladas para não quebrar o layout.

## 6. Como o asset do Fitflix será utilizado

- Caminho Django: `{% static 'images/services/fitflix.png' %}`
- Uso: `<img>` dentro de `.service-card__visual`, funcionando como case visual do serviço de desenvolvimento de SaaS.
- `alt` descritivo para acessibilidade.
- Sem lazy loading (acima da dobra na ordem de scroll: Hero → Serviços → Projetos).
- Sem `srcset` ou `<picture>` nesta fase. A otimização de formatos modernos fica para Fase 7 do ROADMAP.

## 7. Como a estrutura permitirá futuros serviços/projetos

- A seção usa `.services__grid`, permitindo adicionar novos `.service-card` sem alterar a estrutura externa.
- Cada card é um `<article>` independente.
- Novos serviços seguem o mesmo padrão BEM.
- Para adicionar um novo serviço, basta duplicar o `<article class="service-card">` com novo conteúdo e asset em `static/images/services/`.
- Não requer alterações em `base.html`, `pages/home.html`, `config/urls.py` ou backend.

## 8. Riscos ou impactos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Repetição visual do Fitflix entre "Serviços" e "Projetos" | Média | Baixo | Os cards são conceitualmente diferentes (serviço vs projeto). O conteúdo textual é distinto. |
| A seção Serviços não está mapeada em `docs/HOME.md` | Alta | Baixo | Documentação fica defasada. Decisão: fora do escopo deste plano; pode ser atualizada futuramente. |
| CSS conflitante com `.project-card` ou `.card` | Baixa | Baixo | Usar classes BEM distintas (`.service-card`). |
| Layout quebrado em mobile se a grid não for testada | Média | Médio | Implementar breakpoints desde o início. |
| Asset `fitflix.png` com dimensões inesperadas | Baixa | Baixo | Usar `object-fit: cover` e container com proporção fixa. |
| Duplicação do Fitflix como segundo projeto idêntico | Baixa | Nulo | Serviços = o que ofereço. Projetos = o que construí. O card em Serviços é um case visual do serviço; o card em Projetos permanece como produto desenvolvido. Conteúdo textual distinto. |

## 9. Estratégia de validação

1. Abrir `/` e confirmar que a seção Serviços aparece entre Hero e Projetos.
2. Verificar que o asset `fitflix.png` carrega corretamente.
3. Confirmar que a seção Projetos permanece intacta (card do Fitflix original visível).
4. Testar responsividade em desktop, tablet e mobile.
5. Verificar no DevTools (Console) que não há erros 404 para CSS, JS ou imagens.
6. Confirmar que a navbar continua com o mesmo visual e comportamento (menu mobile, scroll state).
7. Validar semântica: `<section id="services">`, headings hierárquicos, `alt` na imagem.
