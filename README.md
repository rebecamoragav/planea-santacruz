# Planéa 🌟
> **“Que organizarlo no te quite la magia de vivirlo.”**
> *Slogan corto:* **“Descubre, Planéa y Vive”**

Plataforma web creada para **Santa Cruz de la Sierra, Bolivia**, que ayuda a personas y grupos a descubrir y reservar planes según presupuesto libre en Bolivianos (ej. Bs 1500), zona (Equipetrol, Norte, Centro, Urubó, Sur, Este), número de personas, fecha y tipo de actividad (Cena, Brunch, Cita, Fiesta, Deporte, Recreativo).

---

## 🚀 Cómo ejecutar el proyecto en Visual Studio Code

### 1. Requisitos previos
- Tener instalado **Node.js** (versión 18 o superior recomendada).
- Tener instalado **Visual Studio Code**.

### 2. Abrir el proyecto en VS Code
1. Abre **Visual Studio Code**.
2. Ve a `File` > `Open Folder...` y selecciona la carpeta del proyecto `planea`.
3. Abre la terminal integrada con `` Ctrl + ` `` (o `Terminal` > `New Terminal`).

### 3. Instalar dependencias
Ejecuta en la terminal:
```bash
npm install
```

### 4. Iniciar la aplicación en modo desarrollo
Ejecuta:
```bash
npm run dev
```
La terminal mostrará la URL local:
```
http://localhost:3000
```
Abre esa URL en tu navegador web favorito (Chrome, Edge, Firefox, Safari).

---

## 🔑 Acceso al Dashboard Administrativo Privado

Puedes acceder al panel administrativo de dos formas:
1. Haz clic en el ícono de escudo (**Admin**) en la esquina superior derecha del encabezado, o en el enlace **Acceso Administrativo** en el pie de página.
2. O navega agregando `#admin` al final de la URL:
   ```
   http://localhost:3000/#admin
   ```
- **Contraseña de acceso:** `admin123`

Dentro del panel administrativo podrás visualizar:
- Total de usuarios registrados.
- Total de reservas realizadas, confirmadas, pendientes y canceladas.
- Total de reseñas recibidas y calificación promedio.
- Métricas de clics por botón:
  - Clics en “Arma tu plan”
  - Clics en “Ver planes sugeridos”
  - Clics en “Pago realizado”
  - Clics en WhatsApp
  - Clics en confirmar reserva
  - Clics en reseñas
  - Clics en soporte
  - Cancelaciones registradas
- **Métricas Financieras con Separación de Comisión (10% Planéa / 90% Restaurante):**
  - **Volumen Total Gestionado (GMV):** 100% de lo pagado por los comensales.
  - **Comisión Neta Planéa (10%):** Lo que realmente ingresa y le queda a Planéa.
  - **Liquidación a Restaurantes (90%):** Lo que se transfiere a los establecimientos aliados.
  - **Ticket Promedio Planéa:** Ganancia promedio neta que recibe Planéa por cada reserva (10%).
  - **Ticket Promedio Cliente:** Monto promedio total gastado por los clientes en cada plan (100%).
- **Tarjetas KPI Principales:**
  - Usuarios registrados (y conteo de activos con reservas).
  - Cantidad de reservas realizadas (confirmadas vs pendientes).
  - Tasa de conversión: usuarios registrados vs usuarios que reservaron.
  - Clicks totales auditados en botones clave.
  - Reseñas y calificación promedio de los lugares (★ / 5.0).
  - Comisión neta Planéa (10%), Volumen Total Gestionado (GMV) y Ticket Promedio Planéa.
- **Gráficos Visuales de Comportamiento:**
  - **Gráfico de Líneas Interactivo:** Evolución cronológica de reservas y nuevos usuarios por día/semana en Santa Cruz.
  - **Gráfico de Barras por Categoría:** Demanda de las 6 categorías (Cena, Brunch, Cita, Fiesta, Deporte, Recreativo) con volumen e ingresos.
  - **Gráfico de Dona (Canales de Adquisición):** Fuente de llegada de usuarios (Instagram Reels 42%, TikTok 28%, WhatsApp 16%, Boca a boca 9%, Google 5%).
  - **Ranking de los Lugares Más Reservados:** Top de restaurantes y locales de Santa Cruz con medallas (🥇, 🥈, 🥉), zona, reservas, ingresos y calificación.
  - **Reservas por Zona de Santa Cruz:** Demanda por zona (Equipetrol, Norte, Centro, Urubó, Sur, Este).
  - **Embudo de Conversión Completo (Funnel de 5 Pasos):** Registro ➔ Búsqueda ➔ Click en Plan ➔ Reserva Confirmada ➔ Reseña Generada.
- **Módulo de CRM (Gestión de Clientes):**
  - Directorio completo de clientes con etiquetas: VIP, Frecuente, Nuevo, Inactivo.
  - Gasto total del cliente y ganancia neta generada para Planéa (10%).
  - LTV Promedio del Cliente vs LTV Neto Planéa.
  - Puntos Planéa acumulados y estatus hacia el evento gratis.
  - Editor de notas internas de seguimiento por cliente.
  - Enlace directo de fidelización por WhatsApp al cliente.
- Tablas interactivas con filtros y controles para:
  - Ver en cada reserva el total (100%), lo que va al restaurante (90%) y lo que gana Planéa (10%).
  - Cambiar el estado de las reservas (Confirmada, Pendiente, Cancelada).
  - Moderar reseñas (Aprobar u Ocultar en la portada).
  - Ver el registro detallado de eventos de telemetría y clics.

---

## 💳 Flujo de Pago por QR Referencial y Cancelación

1. **Paso 1:** El usuario selecciona fecha, hora, personas y teléfono de contacto.
2. **Paso 2:** Se despliega el **código QR Referencial** de Pago Simple con datos bancarios (Banco Unión / BCP, titular *Planéa Experiencias Bolivia S.R.L.*, NIT y monto exacto en Bs).
3. **Botón “Pago realizado”:**
   - Registra el pago por QR y genera la reserva confirmada.
   - Despliega el mensaje:
     > **“¡Tu reserva está lista y se envió a tu correo!”**
   - Muestra el correo de destino y el voucher con acceso a confirmación vía WhatsApp (+591 78100777).
4. **Botón “Cancelar reserva”:**
   - Permite al usuario desistir o cancelar la reserva tanto en el paso de pago como desde el comprobante.

---

## 📱 Soporte y Confirmación por WhatsApp

- **Número oficial de soporte:** `78100777`
- Al confirmar cualquier reserva, el sistema genera automáticamente un enlace de WhatsApp con el mensaje exacto:
  > *“Hola, quiero confirmar mi reserva en Planéa. Mi plan es: [nombre del plan], para [número de personas], el día [fecha] a horas [hora].”*
- Además, el botón flotante de soporte permite:
  - Llamar directamente al `78100777`
  - Abrir WhatsApp con el mensaje: *“Hola, necesito ayuda con mi reserva en Planéa.”*

---

## 🎁 Club de Puntos y Recompensa

- Cada usuario acumula **1 punto por cada reserva confirmada**.
- Al llegar a **10 reservas confirmadas**:
  - Se activa el banner de recompensa de **Evento Gratis**.
  - Calcula automáticamente el promedio gastado en sus planes:
    > *“Tienes un evento gratis estimado en Bs [promedio]”*

---

## 💾 Persistencia de Datos (LocalStorage)

Los datos se guardan en el navegador utilizando las siguientes claves en `localStorage`:
- `planea_usuarios`: Usuarios registrados con ID único, nombre, correo, fecha y puntos.
- `planea_usuario_actual`: Sesión activa del usuario.
- `planea_reservas`: Estructura de reservas con código, usuario, plan, zona, fecha, hora, personas, monto en Bs y estado.
- `planea_reseñas`: Reseñas aprobadas y pendientes con puntuación de 1 a 5 estrellas.
- `planea_metricas_eventos`: Estructura de auditoría de clics y eventos de usuario.

---

## ☁️ Base de Datos en la Nube (Firebase Firestore Activa)

Planéa cuenta con **Firebase Firestore** configurado y sincronizado en tiempo real:
- **Multidispositivo:** Si un usuario se registra o hace una reserva desde su celular en Santa Cruz, los datos viajan inmediatamente a Firestore y aparecen al instante en el Panel de Administrador de cualquier computadora o dispositivo en tiempo real.
- **Colecciones en la nube:**
  - `usuarios`: Base de datos de clientes registrados con puntos y etiquetas CRM.
  - `reservas`: Reservas confirmadas, pendientes, canceladas y pagos por QR.
  - `resenas`: Opiniones y calificaciones comunitarias.
  - `metricas`: Auditoría de clics y funnel de conversión.
- **Respaldo offline:** Mantiene compatibilidad con `localStorage` como capa de caché local y respaldo offline.
