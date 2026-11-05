# 🖨️ Estandarizador de Promociones para Imprenta (BGCPR)

Aplicación web desarrollada para estandarizar y agilizar el proceso de impresión de promociones pequeñas de **Boys & Girls Clubs de Puerto Rico**.

### 🌐 Acceso Web en Vivo (Cualquier Dispositivo):
👉 **[https://samuelbadillo12-oss.github.io/estandarizador-promos-bgc/](https://samuelbadillo12-oss.github.io/estandarizador-promos-bgc/)**

*(Accede directamente desde tu teléfono móvil, iPad, tablet, laptop o computadora de escritorio sin instalar nada).*

---

## 🎯 Especificaciones y Proporciones

| Ajuste / Preset | Medida por Mini Flyer | Ideal Para |
| :--- | :--- | :--- |
| **Canva 8.5 × 11 (Recomendado)** | **4.00" de ancho × 5.18" de alto** | Artes creados en Canva en formato carta. Cero espacio blanco, líneas de corte pegadas al diseño. |
| **Cuarto de Hoja Completo** | **4.25" de ancho × 5.50" de alto** | Divide la hoja carta en 4 partes iguales exactas de borde a borde. |
| **BGC Clásico** | **3.89" de ancho × 5.19" de alto** | Medida histórica tradicional. |

- **Papel Base**: Carta / US Letter (8.5 × 11.0 pulgadas)
- **Capacidad por Hoja**: Hasta 4 promociones (cuadrícula 2 columnas × 2 filas)
- **Distribución de Corte**: Centro simétrico continuo (1 corte vertical a 4.25" y 1 corte horizontal a 5.50")
- **Resolución de Imprenta**: 300 DPI (alta fidelidad vectorial y rasterizada)

---

## ✨ Características Principales

1. **Subida Fácil y Multiformato**:
   - Acepta imágenes (`PNG`, `JPG`, `JPEG`, `WEBP`, `SVG`).
   - Acepta documentos `PDF` (extrae automáticamente páginas con alta resolución).
   - **Pegar directo desde el portapapeles**: Presiona `Ctrl+V` o `Cmd+V` para pegar una imagen copiada desde WhatsApp, correo o Canva sin tener que guardarla primero.
2. **Selector Rápido de Copias**:
   - Imprime **1, 2, 3 o 4 copias** en una sola hoja carta con un solo clic.
3. **Modos de Ajuste Inteligente**:
   - **Ajustar (Contain)**: Conserva toda la imagen original intacta sin cortar textos ni fechas importantes.
   - **Llenar (Cover)**: Llena todo el espacio de 3.89" × 5.19" sin dejar bordes blancos.
   - **Girar 90°**: Botón rápido para corregir la orientación si el arte viene apaisado.
4. **Guías de Corte Profesionales**:
   - **Marcas de corte de imprenta (Crop Marks)**: Ubicadas en los márgenes exteriores para guillotina.
   - **Líneas punteadas sutiles**: Para recortar con tijeras.
   - **Modo unido al centro**: Las 4 promos comparten una sola línea divisoria central, permitiendo cortar las 4 piezas con solo 6 cortes rectos de guillotina.
5. **Dos Opciones de Salida**:
   - **Imprimir Ahora**: Abre el diálogo nativo del navegador con hoja Carta y escala 100% calibrada.
   - **Descargar PDF Listo para Imprenta**: Genera un archivo `.pdf` a 300 DPI con medidas exactas vectoriales para abrir con Adobe Acrobat, Preview o Chrome.
6. **100% en el Navegador (Privacidad y Rapidez)**:
   - Todo se procesa en el equipo local del empleado; los artes nunca se envían a servidores externos.
   - Funciona sin conexión una vez cargada.

---

## 🚀 Cómo Iniciar la Aplicación con 1 Solo Clic (Para cualquier empleado)

No necesitas conocimientos técnicos ni abrir la terminal. Hemos preparado lanzadores directos tipo "botón":

### 🍎 En Mac (macOS):
- **Opción 1 (Recomendada)**: Haz doble clic en **`Estandarizador Promos.app`**.
  - Verás una notificación en pantalla y se abrirá tu navegador (Chrome o Safari) automáticamente.
- **Opción 2**: Haz doble clic en el archivo **`INICIAR_APP_MAC.command`**.

### 🪟 En Windows:
- Haz doble clic en el archivo **`INICIAR_APP_WINDOWS.bat`**.
  - Detectará el entorno y abrirá tu navegador predeterminado de inmediato.

---

## 💻 Para Desarrolladores o Modo Terminal (Opcional)

Si prefieres usar la terminal tradicional:
1. Instalar dependencias:
   ```bash
   npm install
   ```
2. Iniciar servidor:
   ```bash
   npm run dev
   ```
   Abre [http://localhost:5173](http://localhost:5173) en tu navegador.


---

## 🖨️ Instrucciones Clave para la Impresora de la Oficina

Al presionar **"Imprimir Ahora"** en el navegador, asegúrate de verificar lo siguiente en la ventana de impresión:

1. **Destino**: Selecciona tu impresora de oficina a color.
2. **Tamaño de papel**: **Carta (US Letter / 8.5 × 11 pulgadas)**.
3. **Escala**: **100% o "Tamaño Real / Actual Size"** *(NO uses "Ajustar al área de impresión" o "Fit to Printable Area")*.
4. **Márgenes**: **Predeterminado o Ninguno**.
5. **Opciones adicionales**: Desmarca **"Encabezados y pies de página"** para que no imprima fechas o URLs en las esquinas.

---

## ✂️ Instrucciones de Corte Rápido con Guillotina

Si utilizas la opción por defecto **"Unidas al centro"**:
1. Haz **1 corte vertical** siguiendo la guía central (a 4.25 pulg). Ya tienes dos tiras de 2 promos cada una.
2. Haz **1 corte horizontal** siguiendo la guía central (a 5.50 pulg). Ahora tienes las 4 promos separadas.
3. Recorta los bordes superior, inferior, izquierdo y derecho guiándote por las marcas exteriores.
4. ¡Listas para laminar y pegar en el boletín!

