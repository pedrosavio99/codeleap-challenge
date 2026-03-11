# 🚀 CodeLeap Frontend

<p align="center">

Frontend moderno da aplicação **CodeLeap** construído com **React + TypeScript**, focado em **performance, escalabilidade e experiência do usuário**.

Desenvolvido como implementação completa consumindo uma API **Django REST Framework**.

</p>

---

## 👨‍💻 Autor

**Pedro Sávio**
Full Stack Developer

🌐 Portfolio
https://psvo.netlify.app

---

# 🌍 Demo

🔗 Frontend

```
codeleap-react-challenge.netlify.app
```

🔗 Backend API

```
https://github.com/pedrosavio99/codeleap-server
```
---

# 🧰 Tech Stack

### Frontend

* **React 19**
* **TypeScript**
* **Vite**
* **TailwindCSS**
* **Framer Motion**
* **React Router**
* **Axios**

### State Management

* **Zustand**

### Forms e validação

* **React Hook Form**
* **Zod**

### UI

* **Headless UI**
* **Heroicons**

### Data & performance

* **TanStack Query**
* **IntersectionObserver**

---

# 🧠 Destaques Técnicos

Este projeto foi construído pensando como um **engenheiro de produto**, priorizando performance e arquitetura limpa.

Principais técnicas utilizadas:

### 🔹 Infinite Scroll performático

Implementado com:

```
IntersectionObserver
```

Vantagens:

* não usa scroll listeners
* evita reflows desnecessários
* mais eficiente que scroll events

---

### 🔹 Polling inteligente de novos posts

O sistema detecta novos posts utilizando:

```
created__gt
```

E alterna automaticamente entre:

* polling ativo
* polling pausado

Quando a aba do navegador fica inativa (`visibilitychange`).

Isso reduz:

* chamadas de rede
* uso de CPU

---

### 🔹 Cache manual otimizado

Posts são armazenados em um **Map**, permitindo:

* deduplicação automática
* atualização eficiente
* ordenação controlada

Benefícios:

* menor número de renders
* performance previsível

---

### 🔹 Animações performáticas

Utilizando **Framer Motion** com:

```
layout animations
transform-gpu
```

Para garantir:

* animações suaves
* baixa utilização de CPU
* melhor UX

---

### 🔹 Otimizações de React

Boas práticas aplicadas:

* `useCallback`
* `useRef`
* componentes desacoplados
* memoização quando necessário

---

# 🏗 Arquitetura do Projeto

Estrutura baseada em **Feature-Based Architecture**, utilizada em aplicações escaláveis.

```
src
 ├ features
 │   └ posts
 │       ├ api
 │       ├ components
 │       ├ hooks
 │       ├ types
 │       └ constants
 │
 ├ components
 ├ pages
 ├ store
 └ utils
```

Cada feature contém:

| Camada     | Responsabilidade        |
| ---------- | ----------------------- |
| api        | comunicação com backend |
| hooks      | lógica de negócio       |
| components | UI                      |
| types      | tipagens                |
| constants  | constantes              |

Benefícios:

* melhor organização
* domínio isolado
* escalabilidade

---

# 🔐 Estado Global

O projeto utiliza **Zustand** para estado global mínimo.

Gerencia:

* usuário logado
* informações compartilhadas entre páginas

Escolhido por ser:

* simples
* leve
* sem boilerplate

---

# 📡 Integração com Backend

Este frontend consome a API:

👉 https://github.com/pedrosavio99/codeleap-server

Endpoints principais:

| Método | Endpoint                  | Descrição    |
| ------ | ------------------------- | ------------ |
| GET    | `/api/posts/`             | listar posts |
| POST   | `/api/posts/`             | criar post   |
| PUT    | `/api/posts/:id/`         | editar post  |
| DELETE | `/api/posts/:id/`         | deletar post |
| POST   | `/api/posts/:id/like/`    | curtir       |
| POST   | `/api/posts/:id/comment/` | comentar     |

Header utilizado:

```
X-Username: username
```

---

# ⚡ Performance

O projeto foi projetado para lidar com **feeds grandes** com eficiência.

Principais técnicas utilizadas:

* Infinite scroll
* Cache manual
* IntersectionObserver
* Polling adaptativo
* Minimização de re-render

---

# 🛠 Como Rodar Localmente

## 1️⃣ Clone o projeto

```
git clone <repo-front>
cd codeleap-challenge
```

---

## 2️⃣ Instale as dependências

```
npm install
```

---

## 3️⃣ Rode o projeto

```
npm run dev
```

Aplicação disponível em:

```
http://localhost:5173
```

---

# 📦 Build de Produção

```
npm run build
```

Preview do build:

```
npm run preview
```

---

# 🚀 Deploy

Frontend:

* **Netlify**

Backend:

* **Render**

Banco de dados:

* **Neon PostgreSQL Serverless**

---

# 📚 Conceitos Demonstrados

Este projeto demonstra conhecimento em:

* arquitetura frontend escalável
* performance em React
* gerenciamento de estado moderno
* integração REST APIs
* UX moderna
* animações performáticas
* organização de código em larga escala

---

# ⭐ Se esse projeto foi interessante

Considere dar uma estrela ⭐ no repositório!

Backend:
https://github.com/pedrosavio99/codeleap-server


================================================================================


# 🚀 CodeLeap Frontend

<p align="center">

Modern frontend for the **CodeLeap** application built with **React + TypeScript**, focused on **performance, scalability, and user experience**.

Developed as a full implementation consuming a **Django REST Framework API**.

</p>

---

## 👨‍💻 Author

**Pedro Sávio**  
Full Stack Developer  

🌐 Portfolio  
https://psvo.netlify.app

---

# 🌍 Demo

🔗 Frontend

```
codeleap-react-challenge.netlify.app
```

🔗 Backend API

```
https://github.com/pedrosavio99/codeleap-server
```

---

# 🧰 Tech Stack

### Frontend

* **React 19**
* **TypeScript**
* **Vite**
* **TailwindCSS**
* **Framer Motion**
* **React Router**
* **Axios**

### State Management

* **Zustand**

### Forms & Validation

* **React Hook Form**
* **Zod**

### UI

* **Headless UI**
* **Heroicons**

### Data & Performance

* **TanStack Query**
* **IntersectionObserver**

---

# 🧠 Technical Highlights

This project was built with a **product-minded engineering approach**, prioritizing performance and clean architecture.

Key techniques used:

### 🔹 High-performance Infinite Scroll

Implemented using:

```
IntersectionObserver
```

Advantages:

* avoids scroll listeners
* prevents unnecessary reflows
* more efficient than scroll events

---

### 🔹 Smart Polling for New Posts

The system detects new posts using:

```
created__gt
```

It automatically switches between:

* active polling
* paused polling

When the browser tab becomes inactive (`visibilitychange`).

This reduces:

* network requests
* CPU usage

---

### 🔹 Optimized Manual Cache

Posts are stored in a **Map**, allowing:

* automatic deduplication
* efficient updates
* controlled ordering

Benefits:

* fewer renders
* predictable performance

---

### 🔹 High-performance Animations

Using **Framer Motion** with:

```
layout animations
transform-gpu
```

To ensure:

* smooth animations
* low CPU usage
* better UX

---

### 🔹 React Optimizations

Best practices applied:

* `useCallback`
* `useRef`
* decoupled components
* memoization where necessary

---

# 🏗 Project Architecture

The structure follows a **Feature-Based Architecture**, commonly used in scalable applications.

```
src
 ├ features
 │   └ posts
 │       ├ api
 │       ├ components
 │       ├ hooks
 │       ├ types
 │       └ constants
 │
 ├ components
 ├ pages
 ├ store
 └ utils
```

Each feature contains:

| Layer      | Responsibility        |
| ---------- | --------------------- |
| api        | backend communication |
| hooks      | business logic        |
| components | UI                    |
| types      | type definitions      |
| constants  | shared constants      |

Benefits:

* better organization
* isolated domain logic
* improved scalability

---

# 🔐 Global State

The project uses **Zustand** for minimal global state management.

It handles:

* authenticated user
* shared information between pages

Chosen because it is:

* simple
* lightweight
* boilerplate-free

---

# 📡 Backend Integration

This frontend consumes the API:

👉 https://github.com/pedrosavio99/codeleap-server

Main endpoints:

| Method | Endpoint                  | Description |
|------|---------------------------|------------|
| GET | `/api/posts/` | list posts |
| POST | `/api/posts/` | create post |
| PUT | `/api/posts/:id/` | edit post |
| DELETE | `/api/posts/:id/` | delete post |
| POST | `/api/posts/:id/like/` | like |
| POST | `/api/posts/:id/comment/` | comment |

Header used:

```
X-Username: username
```

---

# ⚡ Performance

The project was designed to efficiently handle **large feeds**.

Main techniques used:

* Infinite scroll
* Manual caching
* IntersectionObserver
* Adaptive polling
* Render minimization

---

# 🛠 Running Locally

## 1️⃣ Clone the project

```
git clone <repo-front>
cd codeleap-challenge
```

---

## 2️⃣ Install dependencies

```
npm install
```

---

## 3️⃣ Run the project

```
npm run dev
```

Application available at:

```
http://localhost:5173
```

---

# 📦 Production Build

```
npm run build
```

Build preview:

```
npm run preview
```

---

# 🚀 Deployment

Frontend:

* **Netlify**

Backend:

* **Render**

Database:

* **Neon PostgreSQL Serverless**

---

# 📚 Concepts Demonstrated

This project demonstrates knowledge in:

* scalable frontend architecture
* React performance optimization
* modern state management
* REST API integration
* modern UX
* high-performance animations
* large-scale code organization

---

# ⭐ If you found this project interesting

Consider giving the repository a ⭐!

Backend:  
https://github.com/pedrosavio99/codeleap-server
