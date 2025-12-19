# Como Testar Deep Linking - Cofrin

## 🔗 URLs Configuradas

O aplicativo aceita as seguintes URLs:

### Deep Links do App:
- `cofrin://termos` - Abre a tela de Termos
- `cofrin://login` - Abre a tela de Login
- `cofrin://registro` - Abre a tela de Registro

### Universal Links (quando hospedado):
- `https://cofrin.app/termos`
- `https://www.cofrin.app/termos`
- `https://cofrin.app/login`
- `https://cofrin.app/registro`

## 📱 Testando no Android

### Via ADB (Android Debug Bridge):

```bash
# Abrir tela de Termos
adb shell am start -W -a android.intent.action.VIEW -d "cofrin://termos" com.cofrin.app

# Abrir tela de Login
adb shell am start -W -a android.intent.action.VIEW -d "cofrin://login" com.cofrin.app

# Testar universal link (quando tiver domínio)
adb shell am start -W -a android.intent.action.VIEW -d "https://cofrin.app/termos" com.cofrin.app
```

### Via Terminal no dispositivo Android:

```bash
# Usando Expo Go
npx expo start

# Pressione 's' para alternar para conexão via URL
# Digite: cofrin://termos
```

### Via Browser no Android:

Crie um arquivo HTML simples para testar:

```html
<!DOCTYPE html>
<html>
<head>
    <title>Teste Deep Link</title>
</head>
<body>
    <h1>Teste de Deep Links - Cofrin</h1>
    <ul>
        <li><a href="cofrin://termos">Abrir Termos no App</a></li>
        <li><a href="cofrin://login">Abrir Login no App</a></li>
        <li><a href="cofrin://registro">Abrir Registro no App</a></li>
    </ul>
</body>
</html>
```

## 🍎 Testando no iOS

### Via Terminal:

```bash
# Abrir no simulador
xcrun simctl openurl booted "cofrin://termos"

# Abrir no dispositivo físico via Safari
# Digite na barra de endereços: cofrin://termos
```

### Via Xcode:

1. Abra o projeto no Xcode
2. Execute o app
3. Vá em `Debug` > `Open URL`
4. Digite: `cofrin://termos`

## 🌐 Testando Universal Links

Antes de testar universal links, você precisa:

1. **Hospedar o arquivo `.well-known/apple-app-site-association`**

Crie o arquivo em `public/.well-known/apple-app-site-association`:

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.cofrin.app",
        "paths": ["/termos", "/login", "/registro"]
      }
    ]
  }
}
```

2. **Hospedar o arquivo `assetlinks.json` para Android**

Crie o arquivo em `public/.well-known/assetlinks.json`:

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.cofrin.app",
      "sha256_cert_fingerprints": [
        "SUA_FINGERPRINT_AQUI"
      ]
    }
  }
]
```

Para obter a fingerprint:

```bash
# Para debug
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Para release
keytool -list -v -keystore caminho/para/seu/keystore.jks -alias seu-alias
```

## ✅ Verificação de Funcionamento

### 1. Verificar se o deep link foi registrado:

**Android:**
```bash
adb shell dumpsys package com.cofrin.app | grep -A5 "Scheme:"
```

**iOS:**
```bash
# Verificar no Info.plist do app gerado
```

### 2. Testar redirecionamento:

Quando a URL for acessada no navegador:
- ✅ Deve perguntar se quer abrir no app
- ✅ Deve abrir a tela correta
- ✅ Não deve mostrar erro 404

### 3. Logs para debug:

Adicione logs no `navigation/index.tsx`:

```typescript
const linking = {
  prefixes: ['cofrin://', 'https://cofrin.app', 'https://www.cofrin.app'],
  config: {
    screens: {
      'Termos de Uso': 'termos',
      'Faça login': 'login',
      'Crie uma conta': 'registro',
    },
  },
};

// Debug: ver qual URL foi aberta
const onStateChange = (state: any) => {
  console.log('Navigation state changed:', state);
};

<NavigationContainer linking={linking} onStateChange={onStateChange}>
```

## 🐛 Troubleshooting

### Deep link não funciona no Android:

1. Limpe o cache do app:
```bash
adb shell pm clear com.cofrin.app
```

2. Reinstale o app:
```bash
npm run android
```

3. Verifique os intent filters no AndroidManifest.xml

### Deep link não funciona no iOS:

1. Verifique se o scheme está registrado no Info.plist
2. Limpe o build e reinstale
3. Teste primeiro com scheme custom (cofrin://) antes de universal links

### Universal links não funcionam:

1. Verifique se os arquivos `.well-known` estão acessíveis:
   - `https://cofrin.app/.well-known/apple-app-site-association`
   - `https://cofrin.app/.well-known/assetlinks.json`

2. Certifique-se de que são servidos com Content-Type correto:
   - `application/json` ou `application/octet-stream`

3. Não adicione extensão `.json` no arquivo da Apple
4. Certifique-se de que HTTPS está funcionando (não HTTP)

## 📊 Exemplo de Uso no Google Play

Quando preencher o formulário do Google Play Console:

**Política de Privacidade URL:**
```
https://cofrin.app/privacidade.html
```

**Termos de Serviço URL:**
```
https://cofrin.app/termos.html
```

**Site do Aplicativo:**
```
https://cofrin.app
```

## 🚀 Deploy Checklist

Antes de publicar:

- [ ] Arquivo HTML hospedado e acessível
- [ ] URL retorna status 200 (não 404)
- [ ] Página é responsiva (mobile e desktop)
- [ ] Deep links testados em dispositivo real
- [ ] Universal links configurados (se aplicável)
- [ ] URLs adicionadas no Google Play Console
- [ ] URLs adicionadas no App Store Connect (se iOS)

---

**Dica**: Para requisitos do Google Play, você PRECISA apenas da URL pública funcionando. Deep linking é opcional mas melhora a experiência do usuário.
