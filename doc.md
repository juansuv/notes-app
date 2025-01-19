# Instrucciones de instalación

Este documento describe el proceso de instalación y configuración inicial de un proyecto basado en **FastAPI** y **React**, incluyendo los scripts `setup-env` y `setup-db` para automatizar la instalación de dependencias y la configuración de base de datos.

En él encontrarás:
- Cómo preparar tu ambiente local (en Linux o macOS; para Windows se recomienda usar [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install)).
- Cómo instalar Python y Node.
- Cómo configurar la base de datos.
- Cómo instalar dependencias y levantar el servidor de FastAPI junto con el de React.
- Una explicación detallada de los scripts `setup-env` y `setup-db`.
- Recomendaciones y tips de solución de problemas (troubleshooting).

---

## Índice

- [Prerequisitos](#prerequisitos)
- [Guía de inicio rápido](#guía-de-inicio-rápido)
- [Instalación de Python y Node](#instalación-de-python-y-node)
- [Configurar motor de base de datos](#configurar-motor-de-base-de-datos)
- [Instalar dependencias y configurar el proyecto](#instalar-dependencias-y-configurar-el-proyecto)
  - [Trouble Shooting](#trouble-shooting)
- [Iniciar los servidores (FastAPI y React)](#iniciar-los-servidores-fastapi-y-react)
- [Post-instalación](#post-instalación)
- [Primeros pasos con la aplicación](#primeros-pasos-con-la-aplicación)
- [Configuraciones](#configuraciones)
- [Manteniendo actualizadas nuestras dependencias](#manteniendo-actualizadas-nuestras-dependencias)
  - [Problema y antecedentes](#problema-y-antecedentes)
  - [Solución-y-cómo-implementarla](#solución-y-cómo-implementarla)
  - [Casos-de-uso-en-nuestra-aplicación](#casos-de-uso-en-nuestra-aplicación)
- [Explicación de los scripts setup-env y setup-db](#explicación-de-los-scripts-setup-env-y-setup-db)
  - [Script setup-env](#script-setup-env)
  - [Script setup-db](#script-setup-db)

---

## Prerequisitos

- **Linux (Debian/Ubuntu/Fedora) o macOS**. Para Windows, recomendamos usar [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install).
- Python 3.9 o superior.
- Node.js 16 o superior.

En distribuciones Linux (Debian/Ubuntu), ejecuta:

    sudo apt update
    sudo apt upgrade

En Fedora:

    sudo dnf update
    sudo dnf upgrade

En macOS (asegúrate de tener instalado [Homebrew](https://brew.sh/) si así lo prefieres):

    brew update
    brew upgrade

Para clonar el repositorio del proyecto, tienes dos opciones:

1. **SSH** (si ya configuraste tus llaves en GitHub):
    
       git clone git@github.com:organizacion/proyecto-fastapi-react.git
       cd proyecto-fastapi-react

2. **HTTPS** (si no tienes llave SSH configurada):
    
       git clone https://github.com/organizacion/proyecto-fastapi-react.git
       cd proyecto-fastapi-react

---

## Guía de inicio rápido

Habiendo cumplido los prerrequisitos, ejecuta estos dos scripts:

1. **`bin/setup-env`**  
   - Instala Python, Node y dependencias del sistema (PostgreSQL, Redis, etc.) según tu OS.
   - Crea el entorno virtual de Python y hace `pip install -r requirements.txt`.
   - Instala las dependencias de Node (React, etc.).
2. **`bin/setup-db`**  
   - Crea el usuario de base de datos.
   - Crea las bases de datos (desarrollo y test).
   - Configura extensiones necesarias (pgcrypto, etc.).

Después de correr ambos scripts, ya tendrás tu ambiente listo. Luego podrás iniciar el servidor de FastAPI y el de React en diferentes terminales (o con un solo comando, si tu proyecto lo soporta).

---

## Instalación de Python y Node

Al ejecutar:

    bin/setup-env

> **Tip:** No uses permisos de superusuario (`sudo`) a menos que el script te lo pida explícitamente.

Este script se encarga de:

- Instalar y/o configurar las versiones de Python y Node que requiere el proyecto.  
- Instalar (si aplica) manejadores de versiones como `pyenv` (para Python) y `nvm` (para Node), configurándolos de forma local.  
- Instalar los administradores de paquetes para Python (pip, poetry) y para Node (npm, yarn).

**Posibles casos especiales en macOS con M1/M2 (Apple Silicon)**  
Algunas librerías o binarios pueden no estar disponibles en su versión nativa y necesitan instalación manual.  
Si tienes errores en librerías específicas (por ejemplo, dependencias nativas de Node), revisa los issues conocidos de la librería o la documentación de Homebrew.

---

## Configurar motor de base de datos

Para el proyecto FastAPI + React, se suele utilizar **PostgreSQL** de forma local (aunque podrías usar MySQL, SQLite u otro motor con la configuración adecuada).

1. Asegúrate de tener instalado PostgreSQL >= 12 en tu sistema:
   - **Ubuntu/Debian:**
         
         sudo apt install postgresql postgresql-contrib

   - **Fedora:**
         
         sudo dnf install postgresql postgresql-server postgresql-contrib postgresql-devel

   - **macOS:**
         
         brew install postgresql
         brew services start postgresql

2. Verifica que el servicio de PostgreSQL esté corriendo:
    
       sudo service postgresql status
       # o bien
       brew services list

3. Configura tu base de datos (roles, contraseñas, etc.) según tu preferencia o deja la configuración por defecto si el script `bin/setup-db` se encargará de ello.

> **Importante:** Si algo más está usando el puerto 5432, PostgreSQL podría correr en otro puerto. Modifica el archivo `postgresql.conf` en la ruta que corresponda a tu sistema (por ejemplo `/etc/postgresql/14/main/postgresql.conf` en Debian/Ubuntu) para asegurar que corra en el puerto 5432 o uno que prefieras.

---

## Instalar dependencias y configurar el proyecto

Si quieres hacer los pasos manualmente (sin `setup-env` ni `setup-db`), debes:

1. Instalar dependencias de Python (por ejemplo):
    
       python3 -m venv venv
       source venv/bin/activate
       pip install -r requirements.txt

2. Instalar dependencias de Node:
    
       npm install
       # o
       yarn install

3. Crear y/o migrar la base de datos (p. ej. Alembic o scripts SQL).

### Trouble Shooting

- **Error: "role already exists" en PostgreSQL**  
  Si al crear usuarios en PostgreSQL falla porque ya existe el rol:
    
        sudo -u postgres psql
        DROP ROLE <usuario>;

  Luego vuelve a ejecutar tu script o crea el usuario a mano.

- **Error de permisos en Python**  
  Asegúrate de no usar `sudo` al instalar dependencias si tu proyecto está configurado con un entorno virtual. Si los permisos están mezclados, borra el `venv` y deja que el script lo recree.

- **Errores nativos de Node**  
  Algunas librerías de Node que tienen dependencias nativas (por ejemplo, `node-gyp`) requieren herramientas de compilación:  
  - Linux: `sudo apt-get install build-essential`  
  - macOS: `xcode-select --install`  
  - WSL2: igual que en Linux (`sudo apt-get install build-essential`).

---

## Iniciar los servidores (FastAPI y React)

1. **Levantar FastAPI** (por defecto en el puerto 8000):
    
       uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

2. **Levantar React** (por defecto en el puerto 3000):
    
       npm run start
       # o
       yarn start

> **Si usas WSL2 y no puedes acceder desde tu navegador a `localhost:3000` o `localhost:8000`**, revisa la configuración de puertos y el firewall de Windows, o prueba con `http://127.0.0.1:3000` y `http://127.0.0.1:8000`.

---

## Post-instalación

- Si el proyecto requiere datos para pruebas o cuentas de usuario predefinidas, revisa las instrucciones internas.  
- A veces se incluyen scripts de seed (para poblar la base de datos). Por ejemplo:
    
      bin/seed

  (si existe en tu proyecto).

- Asegúrate de crear un `.env.local` o `.env.development.local` con tus configuraciones personales (base de datos, tokens, etc.). Estos archivos suelen estar ignorados por Git.

---

## Primeros pasos con la aplicación

- Para ingresar en modo desarrollo: `http://localhost:3000` (React) y `http://localhost:8000/docs` (FastAPI, si usas la ruta `/docs`).
- Observa si el proyecto tiene usuarios o tokens de prueba. En caso de no tenerlos, crea un usuario desde la línea de comandos o usando la API (según documentación interna).

---

## Configuraciones

Las configuraciones (variables de entorno, puertos, credenciales) se manejan con:
- `.env` (valores por defecto).
- `.env.development.local` o `.env.local` (valores personalizados, ignorados por Git).
- En Python, se pueden usar librerías como `python-dotenv`.
- En Node, se suele usar `dotenv`.

Si quieres sobrescribir alguna configuración, hazlo en tu archivo local `.env.development.local`.

---

## Manteniendo actualizadas nuestras dependencias

### Problema y antecedentes

En proyectos activos, con frecuencia se actualizan librerías de Python (en `requirements.txt` o `poetry.lock`) o paquetes de Node (en `package.json`). Hay que correr manualmente los comandos `pip install -r requirements.txt` o `npm install` / `yarn` para actualizar tu entorno.

### Solución y cómo implementarla

Una estrategia es usar herramientas que detecten cambios en los archivos de dependencias y las actualicen automáticamente. Por ejemplo, scripts en Bash que vigilan `requirements.txt` o `yarn.lock` y ejecutan las instalaciones.

### Casos de uso en nuestra aplicación

- Si se actualiza `requirements.txt`, al hacer `git pull` podrías quedarte sin dependencias en tu entorno local.  
- Si se actualiza `package.json`, igual para las dependencias de Node.

---

## Explicación de los scripts setup-env y setup-db

En el proyecto se incluyen dos scripts principales para automatizar la instalación y configuración del ambiente de desarrollo: **`bin/setup-env`** y **`bin/setup-db`**.

### Script setup-env

Este script se encarga de:
1. Detectar el sistema operativo (Linux o macOS).
2. Instalar (o verificar) las dependencias del sistema (Python, Node, PostgreSQL, Redis, etc.).  
   - En Linux (APT o DNF), instala paquetes como `python3`, `build-essential`, `postgresql`, `redis`, `nodejs`, `npm`, `yarn`, entre otros.
   - En macOS, usa `brew` para instalar `python@3.9`, `postgresql`, `redis`, `node`, etc.
3. Crear y/o activar un entorno virtual de Python en la carpeta `server/`, instalar dependencias de Python (requirements.txt).
4. Instalar las dependencias de Node en la carpeta `frontend/` (usando `npm install` o `yarn install`).

El código del script es (simplificado para referencia):

    #!/bin/bash
    set -e  # Detiene el script si ocurre un error

    setup_linux_deps () {
      # Instala dependencias con apt o dnf
    }

    setup_macos_deps () {
      # Instala dependencias con brew
    }

    setup_python_env () {
      # Crea venv, instala pip y dependencias
    }

    setup_node_env () {
      # Hace npm install / yarn en la carpeta frontend
    }

    # Detecta OS y llama a la función correcta
    UNAME=$(uname)
    if [ "$UNAME" = "Linux" ]; then
      setup_linux_deps
    elif [ "$UNAME" = "Darwin" ]; then
      setup_macos_deps
    else
      echo "Sistema operativo no soportado."
      exit 1
    fi

    # Luego configura Python y Node
    setup_python_env
    setup_node_env
    echo "¡Todo listo!"

### Script setup-db

Este script se encarga de:
1. Verificar que PostgreSQL esté instalado y corriendo, iniciándolo si no está.
2. Cargar variables de entorno para la base de datos (producción o test) desde archivos `.env`.
3. Crear un usuario de base de datos (si no existe).
4. Crear las bases de datos de desarrollo y de test, eliminando antes si existían.
5. Configurar extensiones (pgcrypto, etc.).

El código del script (simplificado) es:

    #!/bin/bash
    set -e
    # Colores para log
    # ...

    source ./server/app/.env
    source ./server/app/.env.test

    check_postgresql_installed() { ... }
    start_postgresql_service() { ... }
    run_as_postgres() { ... }
    create_user() { ... }
    drop_database() { ... }
    create_database() { ... }
    configure_extensions() { ... }

    setup_database() {
      drop_database $1
      create_database $1
      configure_extensions $1
    }

    main() {
      check_postgresql_installed
      start_postgresql_service
      create_user
      setup_database $DB_NAME
      setup_database $DB_NAME_TEST
      # ...
    }

    main

---

**Orden de ejecución recomendado**  
1. Ejecutar `bin/setup-env` para instalar dependencias de Python, Node y configurar los entornos.  
2. Ejecutar `bin/setup-db` para crear el usuario y las bases de datos necesarias.  

Después de esto, ya podrás correr tu servidor de FastAPI (`uvicorn`) y tu servidor de React (`npm run start`) sin problemas.

---

¡Listo! Con estas instrucciones y la explicación de ambos scripts, tendrás un ambiente local funcional y automatizado para desarrollar, probar y contribuir al proyecto **FastAPI + React**.
