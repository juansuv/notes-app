# Documentación del Proyecto - NotiFy

## Descripción del Proyecto

**NotiFy** es una aplicación web diseñada para gestionar notas personales. Esta aplicación permite a los usuarios crear, leer, actualizar y eliminar notas de manera segura y eficiente. Cada usuario debe autenticarse para acceder a sus notas, garantizando privacidad y protección de datos. Una característica destacada del proyecto es la implementación de una estrategia de bloqueo eficiente en el backend para manejar problemas de concurrencia y prevenir condiciones de carrera, simulando un entorno altamente paralelizado.

### Puntos tratados en esta documentación
1. [**Instrucciones sobre cómo configurar y ejecutar el proyecto localmente.**](#instrucciones-para-configurar-y-ejecutar-el-proyecto)
2. [**Tecnologías utilizadas y razones para elegirlas.**](#tecnologías-utilizadas-y-razones-para-elegirlas)
3. [**Explicación detallada de la estrategia de bloqueo implementada.**](#explicación-detallada-de-la-estrategia-de-bloqueo-implementada)
4. [**Desafíos enfrentados y soluciones, especialmente en relación con problemas de concurrencia.**](#desafíos-enfrentados-y-cómo-se-superaron)

---

## Instrucciones para Configurar y Ejecutar el Proyecto

---

### Requisitos

1. **Sistema Operativo Compatible**  
   - **Linux (Debian/Ubuntu/Fedora)** o **macOS** son recomendados.  
   - **Windows**, se sugiere instalar [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install).

2. **Requisitos del Software**  
   - **Python**: Versión 3.9  
   - **Node.js**: Versión > 20 
   - **PostgreSQL**: Versión 14.15 o la estable más reciente (mínimo 12).

3. **Herramientas adicionales**  
   - **Git** para clonar el repositorio.


### Preparar el ambiente local

1. **Clonar el Repositorio**  
   - Usa el siguiente comando para clonar el proyecto:

   ```bash
   git clone https://github.com/juansuv/notes-app.git
   cd notes-app
    ```

2. **Creación de Archivos `.env` para el Backend y el Frontend**

   A continuación, se describen los pasos necesarios para configurar las variables de entorno en el proyecto **NotiFy**. Los archivos `.env` se utilizan para definir configuraciones sensibles y específicas del entorno
   
   - Uno para el **Backend** en la carpeta `server/app`.
   - Otro para el **Frontend** en la carpeta raíz del frontend (`frontend/`).  
     
   1. **Archivo `.env` para el Backend (`server/app/.env`)**
   
   Crea un archivo `.env` en la carpeta `server/app` con las siguientes variables:
   
   ```env
         DATABASE_URL=postgresql+asyncpg://notes_user:Notes123.localhost/notes_app //String de conexión para la base de datos 
         SECRET_KEY=claveultrasecreta           //contraseña para encriptar
         ALGORITHM=HS256                        //algoritmo de encriptar
         ACCESS_TOKEN_EXPIRE_MINUTES=30         //tiempo que dura el access token
         DB_HOST=localhost                      // Host donde se encuentra la base de datos
         DB_PORT=5432                           // Puerto de conexión a la base de datos
         DB_USER=notes_user                     // Usuario de la base de datos
         DB_PASS=Notes123                       // Contraseña de la base de dato
         DB_NAME=notes_app                      // Nombre de la base de datos
         DB_POOL=5                              // Numero de workes que responden solicitudes 
      ```  
      
   2. **Archivo `.env` para el Frontend (`frontend/.env`)**
   
      Crea un archivo `.env` en la carpeta raíz del frontend (`frontend/`) con las siguientes variables:
      
      ```env
      VITE_API_URL=http://localhost:8000 // URL base de la API del backend
      ```   

   Con esto preparado, estarás listo para proceder con la instalación de Python, Node.js y las demás dependencias necesarias para el proyecto. Continúa con las siguientes instrucciones para más detalles sobre la instalación y configuración.
   
3. **Scripts dentro de la carpeta `bin`**

   En la carpeta `bin` del proyecto hay **dos scripts** diseñados para facilitar el proceso de configuración y ejecución del entorno:

   1. **`setup_env.sh`**  
      Este script es una herramienta robusta y multiplataforma que facilita la instalación de dependencias esenciales como **Python**, **Node.js**, y **React** para el proyecto. Está diseñado para reconocer el sistema operativo en uso y ejecutar comandos específicos para:

      - **Linux**: Instala dependencias a través del gestor de paquetes correspondiente (por ejemplo, `apt` o `yum`).
      - **macOS**: Utiliza herramientas como `brew` para instalar las dependencias.
      - **Windows/WSL**: se sugiere instalar dependencias manualmente.

      **Características principales**:
      - Compatible con múltiples plataformas.
      - Mejora la estabilidad del entorno configurado al validar la instalación de cada dependencia.
      - Proporciona logs claros para depurar problemas durante la configuración.

      Para ejecutarlo:

      ```bash
      ./bin/setup_env.sh
      ```

   2. **`setup-db.sh`**  
      Este script automatiza la configuración de la base de datos necesaria para el proyecto. Sus principales funciones son:

      - **Creación de la base de datos**: Configura y crea la base de datos en PostgreSQL utilizando los parámetros definidos en los archivos de configuración o variables de entorno.
      - **Aplicación de migraciones**: Ejecuta las migraciones necesarias para inicializar la estructura de la base de datos.

   

         Para ejecutar el script:  
      ```bash
      ./bin/setup-db.sh
      ```
   ---
   ### Pasos manuales en caso de fallo del script  
      Si el script falla por cualquier motivo, los pasos manuales para configurar el ambiente son los siguientes:

   1. **Instalación de Dependencias en Linux**  

      Para distribuciones basadas en Debian/Ubuntu (APT)
      Ejecuta los siguientes comandos para instalar las dependencias necesarias:
      
      ```bash
      sudo apt update
      sudo apt install -y \
      python3.9 \
      python3-pip \
      python3.9-venv \
      build-essential \
      curl \
      git \
      postgresql \
      postgresql-contrib \
      libpq-dev \
      redis \
      nodejs \
      npm \
      yarn
      ```

   2. **Instalación de Dependencias en macOS**

      Asegúrate de tener [Homebrew](https://brew.sh/) instalado. Luego, ejecuta:

      ```bash
      brew install python3.9 \
      postgresql \
      redis \
      node \
      npm \
      yarn
      
      brew link --overwrite python3.9
      brew services start postgresql
      brew services start redis
      ```

   3. **Configuración del Entorno Virtual de Python**

      Configura el entorno virtual de Python en la carpeta `server` con los siguientes pasos:
      
      ```bash
      cd server
      python3 -m venv venv
      source venv/bin/activate
      pip3 install --upgrade pip
      pip3 install -r requirements.txt
      deactivate
      cd ..
      ```

   4. **Configuración del Entorno Node.js (React con Vite)**

      Configura el entorno Node.js en la carpeta `frontend` con los siguientes pasos:
      
      ```bash
      cd frontend
      npm install
      cd ..
      ```

   5. **Crear un usuario para la base de datos (si no existe)**:
      ```bash
      DO
      $$
      BEGIN
         IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'notes_user') THEN
            CREATE ROLE notes_user WITH LOGIN PASSWORD 'Notes123';
            ALTER ROLE notes_user CREATEDB;
         END IF;
      END
      $$;
      ```

   6. **Crear la base de datos**:  
      ```bash
      CREATE DATABASE notes_app OWNER notes_user;
      ```

   7. **Dar permisos al usuario sobre la base de datos**:
      ```bash
      GRANT ALL PRIVILEGES ON DATABASE notes_app TO notes_user;
      ```

   8. **Aplicar las migraciones manualmente**:  
      Una vez configurada la base de datos, es necesario activar el entorno virtual (venv) para garantizar que `Alembic` esté instalado y disponible. Sigue estos pasos:

      1. Activa el entorno virtual:
         - En sistemas Unix/Linux/macOS:
         ```bash
         source venv/bin/activate
         ```
         - En Windows:
         ```bash
         venv\Scripts\activate
         ```

      2. Aplica las migraciones necesarias utilizando `Alembic`:
         ```bash
         alembic upgrade head
         ```

   Ambos scripts o configuraciones manuales son fundamentales para garantizar que el entorno de desarrollo esté configurado de manera uniforme y sin problemas.
---
 ### Pasos para Ejecutar el Proyecto
 
 #### 1. Ejecutar el Frontend
 
 Para levantar el servidor del frontend, sigue estos pasos:
 
 1. Cambia al directorio del frontend:
    ```bash
    cd frontend
    ```
 
 2. Instala las dependencias si aún no lo has hecho:
    ```bash
    npm install
    ```
 
 3. Ejecuta el servidor de desarrollo:
    ```bash
    npm run dev
    ```
 
 4. El servidor del frontend estará disponible en:
    ```bash
    http://localhost:3000
    ```
 
 ---
 
 ### 2. Ejecutar el Backend
 
 Para levantar el servidor del backend, sigue estos pasos:
 
 1. Cambia al directorio del backend:
    ```bash
    cd server
    ```
 
 2. Activa el entorno virtual:
    ```bash
    source venv/bin/activate
    ```
 
 3. Ejecuta el servidor de desarrollo:
    ```bash
    uvicorn app.main:app --reload
    ```
 
 4. El servidor del backend estará disponible en:
    ```bash
    http://localhost:8000
    ```
 
 ### 2. Ejecutar las pruebas del backend
 
 Para levantar el servidor del backend, sigue estos pasos:
 
 1. Cambia al directorio del backend:
    ```bash
    cd server
    ```
 
 2. Activa el entorno virtual:
    ```bash
    source venv/bin/activate
    ```
 
 3. Ejecuta el pruebas del servidor:
    ```bash
    pytest  --asyncio-mode=auto 
    ```

 ---
 
 Con ambos servidores ejecutándose, podrás acceder a la aplicación web desde el navegador en `http://localhost:3000`, y la API estará disponible en `http://localhost:8000`.

 ## Tecnologías Utilizadas y Razones para Elegirlas
 
 En el desarrollo del proyecto **NotiFy**, se seleccionaron las siguientes tecnologías. A continuación, se describen las herramientas utilizadas y las razones por las que fueron elegidas aunque la mayoría de estas fueron requisitos del proyecto:
 
 ### 1. **Frontend**
 
 **React con Vite**
 - **Descripción**: React es una biblioteca popular para la construcción de interfaces de usuario dinámicas. Vite es un moderno build tool que ofrece un entorno de desarrollo rápido.
 - **Razones para elegirlo**:
   - Popularidad y soporte de la comunidad.
   - Modularidad y capacidad de manejar componentes.
   - Vite acelera los tiempos de desarrollo gracias a su servidor de desarrollo ultra rápido y su compilación optimizada.
 
 **TypeScript**
 - **Descripción**: TypeScript es un superset de JavaScript que añade tipado estático.
 - **Razones para elegirlo**:
   - Mejora la productividad al detectar errores antes de tiempo.
   - Facilita la escalabilidad y el mantenimiento del proyecto.
 
 **Material-UI (MUI)**
 - **Descripción**: Una biblioteca de componentes que facilita la creación de interfaces de usuario atractivas y responsivas.
 - **Razones para elegirlo**:
   - Amplia colección de componentes listos para usar.
   - Soporte para temas personalizados.
   - Integración fluida con React.

 **Framer Motion**
 - **Descripción**: Una librería de animación para React que permite crear animaciones fluidas y dinámicas.
 - **Razones para elegirlo**:
   - Proporciona una API intuitiva y fácil de usar para implementar animaciones avanzadas.
   - Es compatible con React, lo que facilita su integración en los componentes del frontend.
   - Permite mejorar la experiencia de usuario al añadir transiciones suaves entre las vistas y animaciones en elementos interactivos.
   - Se utilizó para enriquecer la interfaz de usuario, especialmente en las transiciones entre pantallas y para destacar elementos interactivos como botones y formularios.

 
  **Redux**
 - **Descripción**: Redux es una librería para el manejo del estado global en aplicaciones JavaScript.
 - **Razones para elegirlo**:
   1. **Persistencia del Conflicto**: Redux permite almacenar el estado del conflicto detectado entre las versiones del cliente y el servidor, garantizando que este no se pierda incluso si el usuario actualiza la página.
   2. **Centralización del Estado**: Proporciona una única fuente de verdad para todo el estado de la aplicación, facilitando el acceso y la manipulación del conflicto desde diferentes componentes del frontend.
   3. **Manejo de Estados Complejos**: A diferencia de otros enfoques como el estado local de React o Context API, Redux es más adecuado para gestionar estados complejos y múltiples actualizaciones concurrentes.
 - **Por qué no usar otras opciones**:
   - El estado local de React sería insuficiente para persistir el conflicto entre actualizaciones de página.
   - Context API funciona bien para estados simples, pero puede volverse difícil de manejar y escalar en aplicaciones grandes o con estados altamente dinámicos.
 
 Redux fue la opción preferida por su flexibilidad, robustez y capacidad para manejar los estados de conflicto de manera eficiente, especialmente en escenarios de alta concurrencia y resolución manual por parte del usuario.

 ---
 
 ### 2. **Backend**
 
 **FastAPI**
 - **Descripción**: FastAPI es un framework web moderno, rápido y altamente eficiente basado en Python.
 - **Razones para elegirlo**:
   - Desempeño excepcional gracias a su integración con `asyncio`.
   - Generación automática de documentación interactiva (Swagger y ReDoc).
   - Tipado y validación automática de datos utilizando Pydantic.
 
 **Python**
 - **Descripción**: Un lenguaje de programación versátil y fácil de aprender.
 - **Razones para elegirlo**:
   - Amplia comunidad de desarrolladores y soporte de bibliotecas.
   - Compatible con FastAPI y bibliotecas relacionadas.
   - **Versión utilizada**: **Python 3.9**, ya que versiones superiores no son compatibles con `gci` (Garbage Collection Interface).
   - **Conflictos resueltos para pruebas**: En el entorno de pruebas, hubo conflictos relacionados con el uso de múltiples clientes en loops asincrónicos. Esto fue resuelto bajando las versiones de las siguientes librerías:
     - **httpx**
     - **pytest-asyncio**
     - **anyio**
     - **asyncpg**
   - Estas versiones permitieron un manejo más consistente de los eventos de bucle y evitaron problemas al ejecutar pruebas concurrentes.
 
 **JWT (JSON Web Token)**
 - **Descripción**: Una librería utilizada para la autenticación mediante tokens seguros.
 - **Razones para elegirlo**:
    - Proporciona un método eficiente y seguro para autenticar usuarios y mantener sesiones activas.
    - Compatible con FastAPI y fácil de integrar con el flujo de autorización.
    - Se utilizó específicamente para manejar el inicio de sesión mediante cookies seguras y la emisión de refresh tokens, permitiendo mantener la sesión activa de forma eficiente y segura.

**bcrypt**
- **Descripción**: Una librería de encriptación utilizada para proteger contraseñas.
- **Razones para elegirlo**:
    - Proporciona encriptación robusta y comprobada para almacenar contraseñas de manera segura.
    - Es ampliamente utilizada en la industria y compatible con múltiples lenguajes.
    - Se utilizó para encriptar las contraseñas de los usuarios antes de almacenarlas en la base de datos, garantizando un nivel alto de seguridad.

  **PostgreSQL**
 - **Descripción**: PostgreSQL es un sistema de gestión de bases de datos relacional avanzado y de código abierto.
 - **Razones para elegirlo**:
   - Soporte para datos estructurados y consultas complejas.
   - Extensiones útiles como `pgcrypto` para funciones adicionales.
   - Alto desempeño y estabilidad.
 
 ---
 
 ### 3. **Control de Versiones y Gestión de Paquetes**
 
 **Git y GitHub**
 - **Descripción**: Herramientas para el control de versiones y la colaboración en equipo.
 - **Razones para elegirlo**:
   - Seguimiento de cambios en el código fuente.
   - Facilidad para colaborar con otros desarrolladores.
   - Almacenamiento remoto seguro y accesible.
 
 **Pip y npm**
 - **Descripción**: Gestores de paquetes para Python (pip) y Node.js (npm).
 - **Razones para elegirlos**:
   - Amplio soporte para bibliotecas y dependencias.
   - Instalación rápida y sencilla de módulos requeridos por el proyecto.
   - **Versión de Node.js requerida**: > **20**, ya que soporta operadores modernos como `||=` que no están disponibles en versiones anteriores.
 
 ---
 
 Estas tecnologías fueron seleccionadas para garantizar un desarrollo eficiente, una experiencia de usuario de alta calidad y un backend robusto y escalable.

  ## Explicación Detallada de la Estrategia de Bloqueo Implementada
 
 En el proyecto **NotiFy**, se utilizó una estrategia de **bloqueo optimista con control de versiones** para manejar los conflictos de concurrencia. A continuación, se detalla cómo funciona esta estrategia, las razones para elegirla y cómo se integra tanto en el backend como en el frontend.
 
 ### ¿Qué es el Bloqueo Optimista con Control de Versiones?
 
 El **bloqueo optimista** asume que las modificaciones concurrentes son raras. En lugar de bloquear un recurso (como una nota) mientras un usuario lo edita, este enfoque permite que múltiples usuarios realicen cambios simultáneamente. La validación de los cambios se realiza al momento de guardar, verificando si la versión del recurso que se intenta modificar coincide con la última versión almacenada en el servidor.
 
 #### Funcionamiento General
 1. **Cada recurso tiene un número de versión asociado**:
    - Este número se incrementa cada vez que el recurso es modificado y guardado.
 
 2. **El cliente envía el número de versión actual junto con los cambios**:
    - Si el número de versión enviado coincide con el número de versión almacenado en el servidor, los cambios son aplicados.
    - Si el número no coincide, se detecta un conflicto.
 
 3. **En caso de conflicto, el cliente puede resolverlo de varias maneras**:
    - **Mantener la versión del servidor**: Se descartan los cambios locales y se utiliza la última versión guardada en el servidor.
    - **Mantener la versión del cliente**: Se sobreescriben los cambios en el servidor con los cambios locales.
    - **Unir ambas versiones**: Se presenta una interfaz para combinar manualmente los cambios.
 
 ---
 
 ### Integración de la Estrategia
 
 #### En el Backend
 - **Control de Versiones**:
   - Cada recurso ( una nota) tiene un campo `version` en la base de datos.
   - Este campo se utiliza para comparar la versión del cliente con la versión almacenada.
 
 - **Detección de Conflictos**:
   - Antes de aplicar cambios, el backend verifica si el número de versión enviado por el cliente coincide con el número de versión del recurso en la base de datos.
   - Si hay una discrepancia, el backend devuelve un error indicando que hay un conflicto, junto con la versión más reciente del recurso.
 
 #### En el Frontend
 - **Resolución de Conflictos**:
   - Cuando el backend detecta un conflicto, el frontend muestra una interfaz que permite al usuario elegir entre:
     1. Usar la versión del servidor.
     2. Usar la versión del cliente.
     3. Combinar manualmente ambas versiones.
 
 - **Gestión de Conflictos en Redux**:
   - El estado del conflicto se almacena en **Redux**. Esto asegura que, incluso si el usuario actualiza la página, el conflicto permanezca visible y pueda resolverse.
   - Redux guarda información sobre:
     - La versión del cliente.
     - La versión del servidor.
     - El contenido actual del recurso.
   - Al mantener el conflicto en Redux, el flujo de resolución es consistente y robusto, incluso después de recargar la página.
 
 - **Flujo de Resolución**:
   1. El usuario realiza cambios en una nota y envía la solicitud de actualización al backend.
   2. Si se detecta un conflicto, el backend envía la versión actual del recurso junto con un mensaje de conflicto.
   3. El frontend almacena el conflicto en Redux y muestra las opciones para resolverlo.
   4. Dependiendo de la elección del usuario, se envía una nueva solicitud al backend para resolver el conflicto.
 
 ---
 
 ### Razones para Elegir el Bloqueo Optimista
 
 1. **Escalabilidad**:
    - Este enfoque no bloquea recursos en la base de datos, lo que permite un mayor número de operaciones concurrentes sin afectar el desempeño.
 
 2. **Experiencia de Usuario**:
    - Al no bloquear el recurso, los usuarios pueden trabajar simultáneamente sin interrupciones.
 
 3. **Flexibilidad en la Resolución de Conflictos**:
    - La interfaz del frontend permite a los usuarios decidir cómo manejar los conflictos, ofreciendo opciones claras y personalizadas.
 
 4. **Evita Sobreescrituras No Intencionales**:
    - Cada cambio es validado contra la última versión del recurso, asegurando que no se pierdan modificaciones importantes.
 
 5. **Persistencia de Conflictos**:
    - Al usar Redux para almacenar el estado del conflicto, se garantiza que la información se conserve incluso si el usuario actualiza la página.
 
 ---
 
 ### Ejemplo Práctico
 
 Supongamos que dos usuarios (A y B) están editando la misma nota:
 
 1. **Usuario A** comienza a editar la nota (versión 1).
 2. **Usuario B** guarda cambios en la nota, incrementando la versión a 2.
 3. **Usuario A** intenta guardar sus cambios con la versión 1.
 4. El backend detecta el conflicto porque la versión enviada (1) no coincide con la versión actual (2).
 5. El frontend almacena el conflicto en Redux y muestra una interfaz para resolverlo.
 6. Usuario A decide:
    - Usar los cambios de la versión del servidor.
    - Sobrescribir con su versión.
    - Combinar ambos contenidos manualmente.
 
 ---
 
 Con esta estrategia, el sistema garantiza integridad en los datos, escalabilidad y una experiencia de usuario fluida, permitiendo manejar conflictos de manera eficiente.
  

   ## Desafíos Enfrentados y Cómo se Superaron
 
 Durante el desarrollo del proyecto **NotiFy**, surgieron diversos desafíos, especialmente en relación con la concurrencia, la integración de tecnologías y el manejo de conflictos. A continuación, se detallan los problemas más relevantes y las soluciones implementadas:
 
 ### 1. **Manejo de Conflictos Concurrentes**
 
 **Desafío**: Al permitir que múltiples usuarios editen simultáneamente los mismos recursos (notas), surgieron problemas relacionados con la sobrescritura de datos y la gestión de versiones.
 
 **Solución**: Se implementó una estrategia de **bloqueo optimista con control de versiones**:
 - Cada recurso tiene un número de versión asociado que se verifica al momento de guardar cambios.
 - En caso de conflicto, se devuelve un error con las versiones del cliente y el servidor, lo que permite resolver el conflicto en el frontend.
 - Se agregó la opción para que el usuario **mezcle los datos** de las versiones del cliente y del servidor. Esto implicó un manejo adicional de los datos, ya que fue necesario identificar y resaltar las diferencias entre ambas versiones para permitir una combinación precisa y sin pérdidas.
 
 **Aprendizaje**: Aunque implementar la funcionalidad para mezclar datos incrementó la complejidad del sistema, mejoró significativamente la experiencia del usuario, permitiéndole tomar decisiones informadas en casos de conflictos.
 
 ---
 
 ### 2. **Problemas con Pruebas Concurrentes**
 
 **Desafío**: Durante el desarrollo de pruebas asincrónicas, las librerías `httpx` y `pytest-asyncio` presentaban errores al intentar manejar múltiples clientes en bucles de eventos compartidos.
 
 **Solución**:
 - Se bajaron las versiones de las siguientes librerías para resolver el conflicto:
   - **httpx**: `0.23.x`
   - **pytest-asyncio**: `0.18.x`
   - **anyio**: `3.6.x`
 - Esto permitió un manejo consistente de eventos de bucles asincrónicos y evitó problemas al ejecutar pruebas concurrentes.
 
 **Aprendizaje**: Mantener las dependencias actualizadas no siempre es ideal en escenarios complejos; probar y documentar versiones compatibles es clave para estabilidad.
 
 ---
 
 ### 3. **Persistencia del Estado de Conflicto en el Frontend**
 
 **Desafío**: En caso de detectar un conflicto entre las versiones del cliente y el servidor, era necesario garantizar que la información del conflicto no se perdiera al actualizar la página.
 
 **Solución**:
 - Se utilizó **Redux** para almacenar el estado del conflicto globalmente.
 - Esto permitió mantener el conflicto presente incluso si el usuario actualizaba la página, ofreciendo una experiencia consistente y robusta.
 
 **Aprendizaje**: Centralizar el manejo del estado crítico en herramientas como Redux mejora la robustez de la aplicación y facilita la escalabilidad.
 
 ---
 
 ### 4. **Compatibilidad con Tecnologías**
 
 **Desafío**: Algunas tecnologías requerían versiones específicas para garantizar compatibilidad:
 - **Python**: Se utilizó la versión 3.9 debido a problemas de compatibilidad con `gci` en versiones superiores.
 - **Node.js**: La versión 20 fue requerida para soportar operadores modernos como `||=`.
 
 **Solución**:
 - Documentar claramente las versiones necesarias en los prerrequisitos del proyecto.
 - Configurar entornos virtuales y manejadores de versiones (`pyenv`, `nvm`) para facilitar la instalación de las versiones correctas.
 
 **Aprendizaje**: Definir versiones específicas y asegurarse de que todo el equipo trabaje bajo las mismas reduce problemas de incompatibilidad.
 
 ---
 
 ### 5. **Configuración dinámica del proyecto**
 
 **Desafío**: Asegurar que la base de datos PostgreSQL estuviera correctamente configurada con los roles, permisos y extensiones necesarias en multiples sistemas operativos, y configurar herramientas como alembic para generar la correctas migraciones 
 
 **Solución**:
 - Automatización mediante scripts Bash (`setup-db` y `setup-env`) para crear usuarios, bases de datos y configurar extensiones.
 - Validaciones para detectar errores de configuración antes de continuar con la ejecución.
 - Crear un instructivo de configuración manual en caso de fallen los scripts
 
 **Aprendizaje**: Automatizar configuraciones complejas reduce errores manuales y acelera el proceso de despliegue.

 ### 6. **Lógica para Compartir Notas y WebSockets**
 
 **Desafío**: Se planteó la necesidad de implementar una funcionalidad para compartir notas entre usuarios y enviar actualizaciones en tiempo real cuando alguien estuviera editando una nota.
 
 **Solución Propuesta**:
 - Se diseñó la lógica en el backend para compartir notas entre usuarios, utilizando roles y permisos específicos.
 - Se planeó usar **WebSockets** para:
   - Enviar la información de las notas compartidas a los usuarios en tiempo real.
   - Notificar cuando un usuario está editando una nota, evitando conflictos simultáneos.
 
 **Limitación**: Lastimosamente esta funcionalidad no se pudo implementar en el Frontend debido a falta de tiempo. Sin embargo, quedó desarrollada en el backend y lista para desarrollos futuros.
 
 ---
 
 ### 7. **Retos Personales y Gestión del Tiempo**
 
 **Desafío**: Uno de los mayores retos fue gestionar el tiempo disponible para trabajar en el proyecto. Durante el día estaba ocupado con responsabilidades laborales y familiares.
 
 **Solución**:
 - Trabajar durante las noches y madrugadas, que era el momento disponible para concentrarme en el proyecto.
 - Dividir las tareas en objetivos pequeños y manejables para avanzar progresivamente en cada sesión nocturna.
 
 **Aprendizaje**: La dedicación, organización y enfoque permitieron completar gran parte del proyecto a pesar de las circunstancias personales y la falta de tiempo.
 
  ---
 
 Estos desafíos fueron abordados con soluciones prácticas y bien documentadas, lo que permitió garantizar la estabilidad, escalabilidad y robustez del proyecto **NotiFy**.
 
