---
name: react-native
description: Convenções, libs e proibições do Veritas para apps React Native e Expo. Use ao criar ou revisar telas, componentes em `src/components/`, navegação com React Navigation ou Expo Router, estilos com NativeWind ou `StyleSheet.create`, listas com `FlatList`, `SafeAreaView` e estado global com Zustand.
metadata:
  escopo: mobile
  stacks: [react-native]
  upstream:
    - url: https://reactnative.dev/docs/getting-started
      pacote: react-native
      registry: npm
  versao_verificada: "0.86.2"
---

# React Native — convenções da casa

> **Projeto que já existe?** Estas convenções valem para código novo e para
> remodelação. Em sistema legado, de cliente ou de outra equipe, a arquitetura
> do projeto manda: antes da primeira mudança, siga `veritas:projeto-existente`.
>
> **Dado pessoal?** Código que toca CPF, contato, saúde, dado financeiro ou
> credencial, e todo log, exportação ou integração, segue também a
> `veritas:lgpd`, em qualquer modo.

## Filosofia

Functional Components e Hooks. Evite dependências da web (DOM).

## Tecnologias

- **Navegação**: React Navigation (com TypeScript)
- **UI**: NativeWind (Tailwind) ou StyleSheet nativo
- **Estado Global**: Zustand
- **Armazenamento Local**: AsyncStorage ou react-native-mmkv

## Proibições (violação = erro)

- **UI NATIVA** — Nunca use tags HTML (`div`, `span`, `p`). Use estritamente
  componentes do React Native (`View`, `Text`, `TouchableOpacity`,
  `ScrollView`).
- **ESTILIZAÇÃO** — Se usar Tailwind (NativeWind), use a propriedade
  `className`. Caso contrário, prefira `StyleSheet.create` ao invés de estilos
  inline puros.
- **RESPONSIVIDADE** — Sempre considere áreas seguras usando `SafeAreaView` e
  flexbox para layouts adaptativos.
- **PERFORMANCE** — Evite funções inline pesadas no `render`/`return` para não
  triggar re-renders desnecessários em listas (`FlatList`).

## Skills de fora

Se estiverem instaladas, carregue sem esperar pedido:

- Lista, animação, performance ou módulo nativo → `vercel-react-native-skills`
- Prop booleana demais, componente reutilizável → `vercel-composition-patterns`

Elas decidem tática; stack, libs e pastas são desta skill. **Em conflito,
esta vence**: lib nova que elas sugerirem passa pela `veritas:principios`. O
que nunca entra sozinho: [skills-de-fora.md](../atomic-design/skills-de-fora.md).

## Recursos adicionais

- Estrutura e arquitetura: [architecture.md](architecture.md)

## Origem

Portada do `scaffold/stacks/react_native.py` do Veritas v1, onde vivia como
string dentro do Python.
