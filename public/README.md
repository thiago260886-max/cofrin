# Página de Termos de Uso - Cofrin

## � Deploy Simplificado com Expo Web

Como você está usando Expo, **não precisa de HTML separado**! A tela `Terms.tsx` já funciona como página web automaticamente.

## 📦 Deploy na Vercel (Recomendado)

### Método 1: Via Vercel CLI (Mais Rápido)

1. Instale Vercel CLI:
```bash
npm i -g vercel
```

2. No terminal, dentro da pasta `public`:
```bash
cd public
vercel
```

3. Siga as instruções e escolha configurações padrão

4. URL final: `https://seu-projeto.vercel.app/termos.html`

### Opção 4: Firebase Hosting (Integrado com seu backend)

Como você já usa Firebase no app:

```bash
# Instalar Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Inicializar hosting na pasta public
firebase init hosting

# Deploy
firebase deploy --only hosting
```

URL final: `https://seu-projeto.web.app/termos.html`

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Na raiz do projeto (não na pasta public!)
vercel

# 3. Siga as instruções:
# - Link to existing project? No
# - What's your project's name? cofrin
# - In which directory is your code located? ./
# - Want to modify settings? No

# 4. Deploy de produção
vercel --prod
```

**URL gerada**: `https://seu-projeto.vercel.app/termos`

✅ A rota `/termos` funciona automaticamente pelo Expo Web!

### Método 2: Via GitHub + Vercel (Deploy Automático)

1. Crie um repositório no GitHub
2. Faça push do projeto:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/seu-usuario/cofrin.git
git push -u origin main
```

3. Acesse [vercel.com](https://vercel.com)
4. Clique em "Add New Project"
5. Importe o repositório do GitHub
6. Vercel detecta automaticamente que é Expo
7. Deploy automático!
� Configuração Necessária

### 1. Arquivo `.vercelignore` (opcional)

Se quiser otimizar o deploy, crie na raiz:
```
node_modules/
.expo/
.expo-shared/
*.log
```

### 2. Verificar `app.json`

Certifique-se de que tem:
```json
{
  "expo": {
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

✅ Já está configurado no seu projeto!

## 📱 Para Google Play Store

Depois do deploy na Vercel, use a URL no Google Play Console:

**Terms of Service**: `https://seu-projeto.vercel.app/termos`

Pronto! A URL é válida, pública e funcional.

## ✅ Checklist

- [ ] Fazer deploy na Vercel
- [ ] Testar URL no navegador: `https://seu-projeto.vercel.app/termos`
- [ ] Adicionar URL no Google Play Console
- [ ] Testar no mobile (deve ser responsivo)

## 🎯 Vantagens do Expo Web

✅ **Mesmo código** para mobile e web  
✅ **Mesma tela** renderizada automaticamente  
✅ **Sem duplicação** de conteúdo  
✅ **Atualização fácil** - Edita uma vez, funciona em todos lugares  
✅ **Deploy automático** com GitHub + Vercel