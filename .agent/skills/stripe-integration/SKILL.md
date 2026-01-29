---
name: stripe-integration
description: Gestionar suscripciones, upgrades y cancelaciones de manera segura para el flujo de ingresos de KOLINK (Pro/Viral plans). Define patrones para webhooks y gestión de clientes.
---

# 💳 Stripe Integration: Motor de Ingresos

Esta habilidad gestiona toda la lógica transaccional de KOLINK. Es crítica para
la sostenibilidad del negocio.

## 🏗 Arquitectura de Pagos

El flujo de pagos debe ser seguro y atómico.

1. **Frontend (UI):**
   - No maneja lógica de negocio directa.
   - Llama a Edge Functions (`create-checkout-session`,
     `create-customer-portal`) vía `SubscriptionService`.
   - Usa `useSubscription` hook para estado local (Plan, Créditos).

2. **Backend (Edge Functions):**
   - `create-checkout-session`: Genera sesiones de Stripe.
   - `stripe-webhook`: ÚNICA fuente de verdad para actualizar el estado del
     usuario en Supabase (`public.subscriptions`).

3. **Base de Datos (Supabase):**
   - Tabla `subscriptions`: Refleja el estado real en Stripe.
   - Trigger `on_auth_user_created`: Crea entrada en `stripe_customers` al
     registrarse.

## 🔒 Patrones de Seguridad

1. **Validación de Webhooks:**
   - Siempre verificar la firma del webhook con `STRIPE_WEBHOOK_SECRET`.
   - Procesar eventos idempotentemente (usar `event.id` para evitar duplicados
     si es necesario, aunque Stripe reintenta).

2. **Sincronización de Estado:**
   - Nunca confíes en el frontend para dar acceso Pro.
   - El acceso se otorga SOLO si `subscriptions.status` es `active` o `trialing`
     en la DB.

3. **Manejo de Secretos:**
   - `STRIPE_SECRET_KEY` solo en Edge Functions.
   - `STRIPE_PUBLISHABLE_KEY` en variables de entorno del cliente (`VITE_...`).

## 🔄 Flujos Críticos

### Upgrade a Pro

1. Usuario click en "Upgrade".
2. `create-checkout-session` devuelve URL.
3. Redirección a Stripe hosted page.
4. Webhook `checkout.session.completed` -> Actualiza DB a `plan: 'pro'`.

### Control de Créditos (Pay-as-you-go)

- Si se implementan recargas puntuales, usar `payment_intent.succeeded` para
  sumar créditos atómicamente con una función RPC de base de datos
  (`increment_credits`).

## 🛠 Comandos Útiles (CLI Stripe)

Para probar webhooks localmente:
`stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook`
